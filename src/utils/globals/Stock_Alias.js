export function Set_Stock_Alias(category, name) {
  let Stock_Alias = ''
  const procesarString = (str) => {
    // 1. Reemplazar todos los espacios en blanco (incluyendo múltiples espacios, tabulaciones, etc.) por un solo espacio para separarlos.
    //    Luego usar .split(' ') para obtener un array de palabras.
    //    .filter(Boolean) elimina cualquier elemento vacío que pueda resultar de múltiples espacios.
    const palabras = str.trim().split(/\s+/).filter(Boolean)

    // 2. Mapear el array para capitalizar la primera letra de cada palabra.
    const palabrasCapitalizadas = palabras.map((palabra) => {
      // Si la palabra está vacía (aunque filter(Boolean) ya debería prevenirlo), retornar un string vacío.
      if (palabra.length === 0) return ''
      // Capitalizar la primera letra y concatenar el resto de la palabra en minúsculas.
      return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    })

    // 3. Unir todas las palabras sin ningún espacio entre ellas.
    return palabrasCapitalizadas.join('')
  }
  name = procesarString(name)
  switch (category) {
    case 'Equipamiento':
      Stock_Alias = 'STK-EQP:' + name
      break
    case 'Comunicación':
      Stock_Alias = 'STK-COM:' + name
      break
    case 'Transporte':
      Stock_Alias = 'STK-TRP:' + name
      break
    case 'Material':
      Stock_Alias = 'STK-MAT:' + name
      break
    case 'HDRJ':
      Stock_Alias = 'STK-HAD:' + name
      break
    case 'Otro':
      Stock_Alias = 'STK:' + name
      break
    default:
      Stock_Alias = 'STK:' + name
  }
  return Stock_Alias
}
