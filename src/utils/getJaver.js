import { supabase } from '@/services/supabase'

let javerCache = null

// Debe llamarse una vez al iniciar la app
export async function initJaverCache() {
  try {
    const { data, error } = await supabase.from('Javerim').select('dni, nombre, apellido, apodo')
    if (error) throw error
    // Guardar en objeto para acceso rápido por dni
    javerCache = {}
    for (const javer of data) {
      javerCache[javer.dni] = javer
    }
    console.log('Javerim cache inicializado')
  } catch (error) {
    console.error('Error inicializando cache Javerim:', error)
    javerCache = {}
  }
}

// Uso síncrono: getJaver(dni)
export function getJaver(dni) {
  if (!javerCache) {
    console.warn('Javerim cache no inicializado')
    return dni
  }
  const javer = javerCache[dni]
  if (javer) {
    return javer.apodo ? javer.apodo : javer.nombre + ' ' + javer.apellido || dni
  }
  return dni
}
