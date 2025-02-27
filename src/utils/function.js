// 소수점
export const func = {
  formatCurrency(value) {
    if (!value) return ''
    // 숫자만 남기기 (정수 및 소수점 허용)
    let numericValue = String(value).replace(/[^0-9.]/g, '')
    // 소수점이 여러 개 입력되지 않도록 제한
    let parts = numericValue.split('.')
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('')
    }

    // 세 자리마다 콤마 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  parseCurrency(value) {
    if (!value) return 0
    // 숫자와 소수점만 남기기
    let numericValue = String(value).replace(/[^0-9.]/g, '')
    // 소수점 이하 버리기 (정수 변환)
    numericValue = numericValue.split('.')[0]
    return Number(numericValue) || 0
  },
}
