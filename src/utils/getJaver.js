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

// Obtener javer de la sesión actual del usuario
export async function getJaverFromSession() {
  try {
    // Obtener usuario autenticado
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) {
      console.error('No hay usuario autenticado')
      return null
    }

    // Buscar el javer por id_auth
    const { data: javerData, error: javerError } = await supabase
      .from('Javerim')
      .select('id_jvr, nombre, apellido, apodo')
      .eq('id_auth', authData.user.id)
      .single()

    if (javerError) {
      console.error('Error buscando javer:', javerError)
      return null
    }

    if (!javerData) {
      console.warn('No se encontró javer para este usuario')
      return null
    }

    // Retornar nombre formateado
    return {
      id_jvr: javerData.id_jvr,
      displayName: javerData.apodo ? javerData.apodo : `${javerData.nombre} ${javerData.apellido}`,
      nombre: javerData.nombre,
      apellido: javerData.apellido,
      apodo: javerData.apodo,
    }
  } catch (error) {
    console.error('Error en getJaverFromSession:', error)
    return null
  }
}
