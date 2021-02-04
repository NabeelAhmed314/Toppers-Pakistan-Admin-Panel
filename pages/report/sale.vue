<template>
  <SaleReport />
</template>

<script>
import SaleReport from '@/components/report/sale'
export default {
  name: 'Sale',
  middleware: 'isAdminOrManager',
  components: { SaleReport }
}
</script>

<style scoped></style>
