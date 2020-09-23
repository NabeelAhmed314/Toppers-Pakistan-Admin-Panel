<template>
  <product-form title="Update Product" :product="product" is-update />
</template>

<script>
import ProductForm from '../../../components/product/product-form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { ProductForm },
  async asyncData({ $axios, route }) {
    return {
      product: await $axios.$get('product/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
