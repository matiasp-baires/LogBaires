import { ref } from 'vue'
import formpics from '@/stores/formpics'

/**
 * Composable para manejo simplificado de imágenes en formularios
 * @param {string} bucketName - Nombre del bucket a usar
 * @returns {Object} Métodos y refs para manejo de imágenes
 *
 * @example
 * // En tu componente:
 * const {
 *   imageFile,
 *   imagePreview,
 *   handleImageChange,
 *   uploadImage,
 *   updateImage,
 *   deleteImage
 * } = useFormImage('mi-bucket')
 *
 * // En tu template:
 * <input type="file" @change="handleImageChange" accept="image/*">
 * <img v-if="imagePreview" :src="imagePreview">
 */
export function useFormImage(bucketName) {
  // Configure bucket
  formpics.setBucket(bucketName)

  // State
  const imageFile = ref(null)
  const imagePreview = ref(null)

  /**
   * Maneja el cambio de archivo de imagen
   */
  function handleImageChange(event) {
    const file = event.target.files[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      event.target.value = ''
      return
    }

    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }

  /**
   * Sube una nueva imagen
   * @returns {Promise<{url: string, path: string} | null>}
   */
  async function uploadImage() {
    if (!imageFile.value) return null

    try {
      const result = await formpics.uploadImage(imageFile.value)
      clearImage()
      return result
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  /**
   * Actualiza una imagen existente
   * @param {string} oldPath - Path de la imagen existente
   * @returns {Promise<{url: string, path: string} | null>}
   */
  async function updateImage(oldPath) {
    if (!imageFile.value) return null

    try {
      const result = await formpics.updateImage(imageFile.value, oldPath)
      clearImage()
      return result
    } catch (error) {
      console.error('Error updating image:', error)
      return null
    }
  }

  /**
   * Elimina una imagen
   * @param {string} path - Path de la imagen a eliminar
   * @returns {Promise<boolean>}
   */
  async function deleteImage(path) {
    if (!path) return false

    try {
      return await formpics.deleteImage(path)
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  /**
   * Limpia el estado de la imagen
   */
  function clearImage() {
    imageFile.value = null
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
      imagePreview.value = null
    }
  }

  return {
    // State
    imageFile,
    imagePreview,
    isUploading: formpics.uploading,
    error: formpics.uploadError,

    // Methods
    handleImageChange,
    uploadImage,
    updateImage,
    deleteImage,
    clearImage,
  }
}
