<template>
  <EditSaleOrder :order="order" :selected-products="orderItems" />
</template>

<script>
import EditSaleOrder from '@/components/sale/sale-order/edit-form'
export default {
  name: 'Id',
  components: { EditSaleOrder },
  async asyncData({ $axios, route }) {
    const order = await $axios.$get('saleOrder/' + route.params.id)
    const orderItems = await $axios.$get(
      'saleOrderItems/saleOrder/' + route.params.id
    )
    return {
      order,
      orderItems
    }
  }
}
</script>

<style scoped></style>
