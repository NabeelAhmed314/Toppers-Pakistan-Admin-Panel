<template>
  <CategoryForm is-update title="Update Category" :category="category" />
</template>

<script>
import CategoryForm from '../../../../components/product/category-form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { CategoryForm },
  async asyncData({ $axios, route }) {
    return {
      category: await $axios.$get('category/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
