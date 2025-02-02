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
      style="height: 150px"
    )
      div(class="absolute-bottom bg-transparent")
        q-avatar(size="56px" class="q-mb-sm")
          img(src="https://cdn.quasar.dev/img/boy-avatar.png")
        div.text-weight-bold Razvan Stoenescu
        div @rstoenescu
    q-scroll-area(
      style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
    )
      q-list(padding)
          q-list(padding)
            q-item(active v-ripple clickable)
              router-link(to="/") Card
            q-item(v-ripple clickable)
              router-link(to="/Board") Board
            //- q-item(v-ripple clickable)
              q-item-section(avatar)
                q-icon(name="star")
              q-item-section
                q-item-label d

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
      //
    }
  },
  methods: {
    //
  },
}
</script>
