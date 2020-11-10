<template>
  <ProfitLossMain />
</template>

<script>
import ProfitLossMain from '@/components/report/profit-loss'
export default {
  name: 'ProfitLoss',
  middleware: 'isAdmin',
  components: { ProfitLossMain }
}
</script>

<style scoped></style>
