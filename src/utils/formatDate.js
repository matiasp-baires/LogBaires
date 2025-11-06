export function formatDateTime(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)

  // Opciones para el formato de fecha (dd/mm/yyyy)
  const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  // Opciones para el formato de hora (hh:mm 24h)
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }

  const formattedDate = new Intl.DateTimeFormat('es-ES', dateOptions).format(date)
  const formattedTime = new Intl.DateTimeFormat('es-ES', timeOptions).format(date)

  // Reemplazamos el separador de fecha de '/' a '-'
  return `${formattedDate} ${formattedTime}`
}
