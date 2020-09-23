<template>
  <category-form title="Add Category" />
</template>

<script>
import CategoryForm from '../../../components/product/category-form'
export default {
  name: 'Add',
  middleware: 'isAdmin',
  components: { CategoryForm }
}
</script>

<style scoped></style>
