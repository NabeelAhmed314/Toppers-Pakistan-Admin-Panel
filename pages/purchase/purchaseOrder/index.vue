<template>
  <PurchaseOrder />
</template>

<script>
import PurchaseOrder from '@/components/purchase/purchase-order/purchase-order'
export default {
  name: 'Index',
  components: { PurchaseOrder },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
