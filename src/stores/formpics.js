/**
 * @fileoverview Store para manejo de imágenes en formularios con Supabase Storage
 *
 * GUÍA DE USO:
 *
 * Se recomienda usar este store a través del composable useFormImage:
 *
 * 1. Importar el composable en tu componente:
 *    import { useFormImage } from '@/composables/useFormImage'
 *
 * 2. Usar el composable (proporciona toda la lógica necesaria):
 *    const {
 *      imagePreview,        // URL de previsualización de la imagen seleccionada
 *      handleImageChange,   // Método para manejar cambio de archivo
 *      uploadImage,         // Sube una nueva imagen
 *      updateImage,         // Actualiza una imagen existente
 *      deleteImage,        // Elimina una imagen
 *      clearImage          // Limpia el estado actual
 *    } = useFormImage('mi-bucket-name')
 *
 * 3. Usar en el template:
 *    <template>
 *      <input
 *        type="file"
 *        @change="handleImageChange"
 *        accept="image/*"
 *      >
 *      <img v-if="imagePreview" :src="imagePreview">
 *    </template>
 *
 * 4. Ejemplo de uso en métodos CRUD:
 *
 *    // Subir nueva imagen
 *    const result = await uploadImage()
 *    if (result) {
 *      // Guardar en base de datos:
 *      const { url, path } = result
 *    }
 *
 *    // Actualizar imagen existente
 *    const result = await updateImage(oldPath)
 *    if (result) {
 *      // Actualizar en base de datos:
 *      const { url, path } = result
 *    }
 *
 *    // Eliminar imagen
 *    const success = await deleteImage(path)
 *    if (success) {
 *      // Limpiar campos en base de datos
 *    }
 *
 * NOTA: Este es el store interno usado por useFormImage.
 * Se recomienda NO usar este store directamente, sino a través del composable.
 *
 * Si necesitas acceso directo al store, estos son los métodos disponibles:
 *
 * Estado:
 * - uploading: Boolean - indica si hay una subida en progreso
 * - uploadProgress: Number - porcentaje de progreso (0-100)
 * - uploadError: String|null - mensaje de error si algo falla
 *
 * Métodos:
 * - setBucket(bucketName): void - configura el bucket a usar
 * - getCurrentBucket(): string - obtiene el nombre del bucket actual
 * - uploadImage(file): Promise<{url, path}|null> - sube una nueva imagen
 * - updateImage(newFile, oldPath): Promise<{url, path}|null> - actualiza una imagen existente
 * - deleteImage(path): Promise<boolean> - elimina una imagen
 * - getPublicUrl(path): string - obtiene la URL pública de una imagen
 */

import { supabase } from '@/services/supabase'
import { ref } from 'vue'

// Store para manejo de imágenes en formularios
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref(null)
const currentBucket = ref('form-images') // Bucket por defecto

/**
 * Sube una imagen al bucket de Supabase
 * @param {File} file - Archivo a subir
 * @param {string} folder - Carpeta dentro del bucket (ej: 'espacios', 'javerim')
 * @returns {Promise<{path: string, url: string} | null>} Objeto con path y url pública de la imagen
 */
async function uploadImage(file, folder = '') {
  if (!file) return null

  try {
    uploading.value = true
    uploadError.value = null

    // Genera un nombre único usando timestamp y nombre original
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Sube el archivo
    const { data, error } = await supabase.storage
      .from(currentBucket.value)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Obtiene la URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(currentBucket.value).getPublicUrl(filePath)

    return {
      path: filePath,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    uploadError.value = error.message
    return null
  }
}

/**
 * Actualiza una imagen, borrando la anterior
 * @param {File} newFile - Nuevo archivo a subir
 * @param {string} oldPath - Path de la imagen anterior a reemplazar
 * @param {string} folder - Carpeta dentro del bucket
 * @returns {Promise<{path: string, url: string} | null>} Objeto con path y url pública de la nueva imagen
 */
async function updateImage(newFile, oldPath, folder = '') {
  if (!newFile) return null

  try {
    // Primero subimos la nueva imagen
    const newImage = await uploadImage(newFile, folder)
    if (!newImage) throw new Error('Error uploading new image')

    // Si hay una imagen anterior, la borramos
    if (oldPath) {
      await deleteImage(oldPath)
    }

    return newImage
  } catch (error) {
    console.error('Error updating image:', error)
    uploadError.value = error.message
    return null
  }
}

/**
 * Elimina una imagen del bucket
 * @param {string} path - Path de la imagen a eliminar
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
async function deleteImage(path) {
  if (!path) return false

  try {
    const { error } = await supabase.storage.from(currentBucket.value).remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    uploadError.value = error.message
    return false
  }
}

/**
 * Obtiene la URL pública de una imagen
 * @param {string} path - Path de la imagen en el bucket
 * @returns {string} URL pública de la imagen
 */
function getPublicUrl(path) {
  if (!path) return ''

  const {
    data: { publicUrl },
  } = supabase.storage.from(currentBucket.value).getPublicUrl(path)

  return publicUrl
}

/**
 * Configura el bucket a utilizar para las operaciones
 * @param {string} bucketName - Nombre del bucket en Supabase Storage
 */
function setBucket(bucketName) {
  if (!bucketName) return
  currentBucket.value = bucketName
}

/**
 * Obtiene el nombre del bucket actual
 * @returns {string} Nombre del bucket actual
 */
function getCurrentBucket() {
  return currentBucket.value
}

export default {
  // Estado
  uploading,
  uploadProgress,
  uploadError,

  // Métodos
  uploadImage,
  updateImage,
  deleteImage,
  getPublicUrl,
  setBucket,
  getCurrentBucket,
}
