export function Set_Stock_Alias(category, name) {
  let Stock_Alias = ''
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
