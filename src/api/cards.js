import axios from 'axios'

const BASE_URL = 'http://localhost:5500/Brand'

export default {
  // 모든 브랜드 데이터 가져오기
  getBrands() {
    return axios.get(BASE_URL)
  },

  // 특정 카드회사 가져오기
  getBrandByCode(id) {
    // return axios.get(`${BASE_URL}/${code}`)
    return axios.get(`${BASE_URL}/${id}`)
    // return axios.get(`${BASE_URL}?code=${code}`)
  },

  // 새 카드회사 추가
  createBrand(brand) {
    return axios.post(BASE_URL, brand)
  },

  async updateBrand(id, newLabel) {
    // 현재 카드회사의 정보 가져오기
    const res = await this.getBrandByCode(id)
    if (!res.data.length === 0) throw new Error('존재하지 않는 카드회사입니다.')
    const brand = res.data[0]
    const newBrand = {
      ...brand,
      label: newLabel,
    }
    return axios.put(`${BASE_URL}/${brand.id}`, newBrand)
  },

  async updateBrandNo(list) {
    try {
      // 모든 브랜드 데이터 가져오기
      const res = await axios.get(BASE_URL)
      if (res.status !== 200) throw new Error('데이터를 가져오지 못했습니다.')

      let brands = res.data
      list.forEach(updateItem => {
        const brand = brands.find(b => b.id === updateItem.id)
        if (brand) brand.no = parseInt(updateItem.no, 10)
      })

      brands.sort((a, b) => a.no - b.no)
      const updatePromises = brands.map(brand => axios.put(`${BASE_URL}/${brand.id}`, brand))
      await Promise.all(updatePromises) // 모든 요청이 완료될 때까지 기다림
      return brands
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async updateCardNo(id, list) {
    try {
      // 특정 브랜드 가져오기
      // const res = await axios.get(`${BASE_URL}?code=${code}`)
      const res = await axios.get(`${BASE_URL}/${id}`)
      if (res.status !== 200 || !res.data) throw new Error('존재하지 않는 카드입니다.')

      let brand = res.data[0]
      brand.cards.forEach(card => {
        const updatedCard = list.find(item => item.value === card.value)
        if (updatedCard) {
          card.no = parseInt(updatedCard.no, 10) // 🔹 no 업데이트
        }
      })

      brand.cards.sort((a, b) => a.no - b.no)
      await axios.put(`${BASE_URL}/${brand.id}`, brand)
      return brand.cards
    } catch (error) {
      console.error('❌ 카드 no 업데이트 실패:', error)
      throw error
    }
  },

  // 카드 추가 (특정 카드회사 내 카드 추가)
  async addCardsToBrand(id, newCards) {
    const res = await axios.get(`${BASE_URL}/${id}`)
    const addCards = {
      ...res.data,
      cards: [...res.data.cards, ...newCards],
    }
    return axios.put(`${BASE_URL}/${id}`, addCards)
  },

  // 카드 정보 수정
  async updateCards(id, cardId, updatedFields) {
    try {
      // 1️⃣ 특정 브랜드 가져오기 (id 기준)
      const res = await axios.get(`${BASE_URL}/${id}`)
      if (!res.data.length) throw new Error('❌ 브랜드를 찾을 수 없습니다.')

      let brand = res.data[0] // JSON Server는 배열로 반환하므로 첫 번째 항목 선택

      // 2️⃣ `cards` 속성이 없을 경우 빈 배열로 초기화
      if (!Array.isArray(brand.cards)) brand.cards = []

      // 3️⃣ 기존 카드 찾기
      const existingCard = brand.cards.find(c => c.code === cardId)

      if (!existingCard) throw new Error(`❌ 카드(${cardId})를 찾을 수 없습니다.`)

      // 4️⃣ 기존 데이터와 변경된 데이터 비교 후 업데이트
      const updatedCard = { ...existingCard, ...updatedFields }

      // 5️⃣ 특정 카드 정보만 업데이트
      brand.cards = brand.cards.map(c => (c.id === cardId ? updatedCard : c))

      // 6️⃣ `PUT` 요청으로 업데이트 (브랜드 ID 사용)
      const updatedRes = await axios.put(`${BASE_URL}/${brand.id}`, brand)

      return updatedRes.data
    } catch (error) {
      console.error('❌ 카드 정보 업데이트 실패:', error)
      throw error
    }
  },
}
