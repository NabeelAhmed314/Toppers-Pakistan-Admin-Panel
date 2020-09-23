<template>
  <ProductMain />
</template>

<script>
import ProductMain from '../../components/product/main'
export default {
  middleware: 'isAdmin',
  components: { ProductMain }
}
</script>

<style scoped></style>
