<template>
  <PurchaseReport />
</template>

<script>
import PurchaseReport from '@/components/report/purchase'
export default {
  name: 'Purchase',
  middleware: 'isAdminOrManager',
  components: { PurchaseReport }
}
</script>

<style scoped></style>
