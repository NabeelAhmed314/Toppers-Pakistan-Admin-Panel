<template>
  <ItemForm
    is-update
    title="Update Item"
    :item="item"
    :options="options"
    :variants="variants"
    :uploaded-images="images"
  />
</template>

<script>
import ItemForm from '@/components/item/form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { ItemForm },
  async asyncData({ $axios, route }) {
    const item = await $axios.$get('item/' + route.params.id)
    const images = await $axios.$get('itemImages/item/' + route.params.id)
    const options = await $axios.$get('option/item/' + route.params.id)
    const variants = await $axios.$get('variant/item/' + route.params.id)
    // const variants = await $axios.$get('item/' + route.params.id)
    // const options = await $axios.$get('item/' + route.params.id)
    // const optionValues = await $axios.$get('item/' + route.params.id)
    return {
      item,
      images,
      options,
      variants
      // variants,
      // options: { optionNames: options, optionValues }
    }
  }
}
</script>

<style scoped></style>
