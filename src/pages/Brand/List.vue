<template lang="pug">
q-page
  q-splitter(v-model="splitterModel")
    //- List
    template(v-slot:before)
      div.q-pa-md
        .q-gutter-sm
          q-btn(label="카드사 추가" color="primary" @click="handleRegist(false)")
        q-separator.q-mt-md.q-mb-md
        q-tree(
          :nodes="treeData"
          node-key="id"
          label-key="label"
          children-key="children"
          selected-color="primary"
          default-expand-all
          :selected="selected"
          @update:selected="handleNodeSelect"
        )
    //- Detail
    template(v-slot:after class="q-splitter__after")
      div.q-pa-md
        .q-gutter-sm
          q-btn(label="카드사 수정" color="primary" :disabled="!selectedBrand || selectedCard" @click="handleRegist(true)")
          q-btn(label="카드 추가" color="primary" :disabled="!selectedBrand || selectedCard" @click="handleAddCard")
          q-btn(label="카드 수정" color="primary" :disabled="!selectedCard" @click="handleEditCard")
          q-btn(label="카드 삭제" color="primary" :disabled="!selectedCard" @click="handleDeleteCard")
          q-separator.q-mt-md.q-mb-md
        template(v-if="selected && selectedNode")
          q-card.my-card.bg-secondary.text-white
            q-card-section
              .text-h5
                div
                  q-chip(color="primary" text-color="white" size="sm" square) No : {{ selectedNode.no }}
                  q-chip(color="primary" text-color="white" size="sm" square) category : {{ categories.find(c => c.value === selectedNode.category)?.label }}
                p Code : {{ selectedNode.code }}
                p Label : {{ selectedNode.label }}
          div.q-mt-md(v-if="selectedNode.annualFee")
            .text-h5.q-mb-md(v-if="selectedNode?.annualFee") 전월실적 {{ selectedNode.minUsage }}만원
            div.text-bold 타입:
              ul
                li(v-for="(type, index) in selectedNode.annualFee ?? []" :key="index")
                  | {{ type.label }} - {{ type.value?.toLocaleString() ?? 'N/A' }}원
              div.text-bold 조건:
              ul
                li(v-for="(cond, index) in selectedNode.condition ?? []" :key="index")
                  | {{ cond.label }} - {{ cond.value?.toLocaleString() ?? 'N/A' }}원
              div.text-bold 혜택:
              ul
                li(v-for="(benefit, index) in selectedNode.benefit ?? []" :key="index")
                  | {{ benefit.label }} - {{ benefit.value?.toLocaleString() ?? 'N/A' }}원
        template(v-else)
          p 카드선택

pop-add-brand(
  :visible="visibleAddBrand"
  :brands="brands"
  :data="selectedNode"
  :isEdit="isEdit"
  :no="no"
  @close="visibleAddBrand = false"
  @refresh="refresh"
)
pop-edit-card(
  :visible="visibleEditCard"
  :parent="parent"
  :data="selectedNode"
  @close="visibleEditCard = false"
  @refresh="refresh"
)
</template>

<script>
import { nextTick } from 'vue'
import api from 'src/api/cards'
import categories from 'src/api/categories'

import popAddBrand from './_popups/addBrand.vue'
import popEditCard from './_popups/editCard.vue'

export default {
  name: 'BrandList',
  components: {
    popAddBrand,
    popEditCard,
  },
  watch: {},
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      // ----selectedCard----------------
      visibleAddBrand: false,
      visibleEditCard: false,

      // list
      brands: [],
      categories: categories,

      // tree
      treeData: [],
      splitterModel: 30,
      selected: null,
      selectedNode: null,
      selectedBrand: null,
      selectedCard: null,

      // 카드사 수정
      isEdit: false,
      no: null,

      // 카드수정
      parent: {},
    }
  },
  methods: {
    async fetchData() {
      const res = await api.getBrands()
      // brand의 개수
      this.no = res.data.length + 1
      if (res.status !== 200) return
      this.brands = res.data.sort((a, b) => a.no - b.no)
      this.treeData = res.data.map(brand => ({
        id: brand.id,
        code: brand.code,
        label: brand.label,
        // label: `${brand.no}. ${brand.label}`,
        no: brand.no,
        children: brand.cards.map(card => ({
          id: `${brand.code}_${card.code}`,
          code: card.code,
          label: card.label,
          no: card.no,
          category: card.category,
          minUsage: card.minUsage,
          annualFee: Array.isArray(card.annualFee) ? card.annualFee : [],
          condition: Array.isArray(card.condition) ? card.condition : [],
          benefit: Array.isArray(card.benefit) ? card.benefit : [],
        })),
      }))
    },

    async refresh() {
      await this.fetchData()
      await nextTick()
      if (this.selectedCard) this.selectNodeByCode(this.selectedCard)
    },

    findNode(nodes, id) {
      for (const node of nodes) {
        if (node.id === id) {
          return node
        }
        if (node.children) {
          // 🔹 재귀 탐색
          const found = this.findNode(node.children, id, node)
          if (found) return found
        }
      }
      return null
    },
    handleNodeSelect(val) {
      if (!val) return
      this.selected = val

      const findNode = this.findNode(this.treeData, val)
      if (!findNode) return
      this.selectedNode = findNode

      // // 🔹 브랜드인지 카드인지 구분하여 저장
      if (this.selectedNode?.children) {
        // 브랜드 선택
        this.selectedBrand = this.selectedNode.code
        // 카드 초기화
        this.selectedCard = null
      } else {
        // 카드 선택
        this.selectedCard = this.selectedNode.id
      }
    },

    // 🔹 클릭 없이 특정 노드를 자동 선택하는 메서드
    selectNodeByCode(id) {
      this.handleNodeSelect(id)
    },

    handleRegist(val) {
      this.isEdit = val
      this.visibleAddBrand = true
    },
    handleAddCard() {
      this.$router.push({ name: 'BrandRegist', params: { id: this.selectedNode.id } })
    },
    handleEditCard() {
      const parent = this.treeData.find(node => node.children.find(child => child.id === this.selectedNode.id))
      this.parent = {
        code: parent.code,
        label: parent.label,
      }
      this.visibleEditCard = true
    },
    handleDeleteCard() {
      this.$q
        .dialog({
          title: '카드 삭제',
          message: '정말 삭제하시겠습니까?',
          ok: {
            label: '삭제',
            color: 'red',
          },
          cancel: {
            label: '취소',
            color: 'primary',
          },
        })
        .onOk(() => {
          api
            .deleteCard(this.selectedNode.code)
            .then(() => {
              this.refresh()
            })
            .catch(error => {
              console.error(error)
              this.$q.notify({
                color: 'negative',
                message: '카드 삭제 중 오류가 발생했습니다.',
                position: 'top',
              })
            })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
main.q-page {
  .q-splitter {
    height: 100%;
  }
}
</style>
