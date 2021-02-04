<template>
  <ProfitLossMain />
</template>

<script>
import ProfitLossMain from '@/components/report/profit-loss'
export default {
  name: 'ProfitLoss',
  middleware: 'isAdminOrManager',
  components: { ProfitLossMain }
}
</script>

<style scoped></style>
