import { parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * Formatea un celular en base al código de país
 * @param {string} rawNumber - Ejemplo: "1158021867"
 * @param {string} countryCode - Ejemplo: "AR"
 * @param {string} format - 'E.164', 'INTERNATIONAL', 'NATIONAL'
 * @returns {string} número formateado
 */
export function formatPhone(rawNumber, countryCode, format = 'E.164') {
  try {
    const phoneNumber = parsePhoneNumberFromString(rawNumber, countryCode)
    if (!phoneNumber) return null
    return phoneNumber.format(format)
  } catch (err) {
    console.error('Error formateando número:', err)
    return null
  }
}

/**
 * Obtiene el número "puro" (sin código de país) a partir de un número completo
 * @param {string} fullNumber - Ejemplo: "+541158021867"
 * @param {string} countryCode - Ejemplo: "AR"
 * @returns {string} número puro - Ejemplo: "1158021867"
 */
export function getRawPhoneNumber(fullNumber, countryCode) {
  try {
    const phoneNumber = parsePhoneNumberFromString(fullNumber, countryCode)
    if (!phoneNumber) return null
    return phoneNumber.nationalNumber
  } catch (err) {
    console.error('Error obteniendo número puro:', err)
    return null
  }
}
