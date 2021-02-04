<template>
  <PurchaseReturn />
</template>

<script>
import PurchaseReturn from '@/components/purchase/purchase-return/purchase-return'
export default {
  name: 'Index',
  components: { PurchaseReturn },
  middleware: 'isAdminOrManager'
}
</script>

<style scoped></style>
