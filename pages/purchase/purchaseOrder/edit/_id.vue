<template>
  <EditPurchaseOrder :order="order" :selected-products="orderItems" />
</template>

<script>
import EditPurchaseOrder from '@/components/purchase/purchase-order/edit-form'
export default {
  name: 'Id',
  components: { EditPurchaseOrder },
  middleware: 'isAdmin',
  async asyncData({ $axios, route }) {
    const order = await $axios.$get('purchaseOrder/' + route.params.id)
    const orderItems = await $axios.$get(
      'purchaseOrderItems/purchaseOrder/' + route.params.id
    )
    return {
      order,
      orderItems
    }
  }
}
</script>

<style scoped></style>
