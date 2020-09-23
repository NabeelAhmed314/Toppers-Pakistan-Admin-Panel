<template>
  <sub-category-form />
</template>

<script>
import SubCategoryForm from '../../../components/product/sub-category-form'
export default {
  name: 'Add',
  middleware: 'isAdmin',
  components: { SubCategoryForm }
}
</script>

<style scoped></style>
