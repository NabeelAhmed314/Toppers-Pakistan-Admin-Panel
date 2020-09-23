<template>
  <sub-category-form
    is-update
    title="Update Sub Category"
    :subcategory="subcategory"
  />
</template>

<script>
import SubCategoryForm from '../../../../components/product/sub-category-form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { SubCategoryForm },
  async asyncData({ $axios, route }) {
    return {
      subcategory: await $axios.$get('subCategory/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
