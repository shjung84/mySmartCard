<template lang="pug">
  q-page-sticky(position="top" expand class="bg-primary text-white")
    q-toolbar
      q-toolbar-title
        h2.text-h4 {{ title }}
</template>

<script>
export default {
  name: 'TitleLayout',
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
h2 {
  margin: 0;
}
.q-page-sticky {
  z-index: 2;
}
</style>
