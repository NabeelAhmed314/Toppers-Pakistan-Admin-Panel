<template>
  <sale-return />
</template>

<script>
import SaleReturn from '@/components/sale/sale-return/sale-return'
export default {
  name: 'Index',
  middleware: 'isAdminOrManager',
  components: { SaleReturn }
}
</script>

<style scoped></style>
