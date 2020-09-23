<template>
  <product-form title="Add Product" />
</template>

<script>
import ProductForm from '../../components/product/product-form'
export default {
  name: 'Add',
  middleware: 'isAdmin',
  components: { ProductForm }
}
</script>

<style scoped></style>
