<template lang="pug">
  q-toolbar
    q-toolbar-title(style="height: 70px;")
      h1 My Smart Credit Card
    q-btn(flat @click="$emit('onToggleDrawer')" round dense icon="menu")
  q-toolbar-title.sub-title
    h2.text-h4 {{ title }}
</template>

<script>
export default {
  name: 'HeaderLayout',
  emits: ['onToggleDrawer'],
  computed: {
    title() {
      return this.$route.meta.title
    },
  },
  data() {
    return {
      //
    }
  },
}
</script>

<style lang="scss" scoped>
h1,
h2 {
  margin: 0;
}
.sub-title {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: $primary;
}
</style>
