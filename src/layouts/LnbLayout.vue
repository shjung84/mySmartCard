<template lang="pug">
  q-drawer(
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    show-if-above
    :width="200"
    :breakpoint="400"
  )
    q-img(
      class="absolute-top"
      src="https://cdn.quasar.dev/img/material.png"
      style="height: 120px"
    )
      //- div(class="absolute-bottom bg-transparent")
        q-avatar(size="56px" class="q-mb-sm")
          img(src="https://cdn.quasar.dev/img/boy-avatar.png")
        div.text-weight-bold Razvan Stoenescu
        div @rstoenescu
    q-scroll-area(
      style="height: calc(100% - 120px); margin-top:120px; border-right: 1px solid #ddd"
    )
      q-list
        q-item(
          v-for="(menu, index) in menus"
          :key="index"
          :to="menu.path"
          clickable
          active-class="bg-primary text-white"
        )
          q-item-section(avatar)
            q-icon(:name="menu.icon" size="sm")
          q-item-section
            q-item-label {{ menu.name }}

</template>

<script>
export default {
  name: 'LnbLayout',
  components: {
    // SidebarMenuItems,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      menus: [
        { name: 'Card', path: '/', icon: 'business' },
        { name: 'Brand', path: '/Brand', icon: 'edit' },
        { name: 'Sort', path: '/Sort', icon: 'list' },
      ],
    }
  },
  methods: {
    //
  },
}
</script>

<style lang="scss" scoped>
.q {
  &-list {
  }
  &-item {
  }
}
</style>
