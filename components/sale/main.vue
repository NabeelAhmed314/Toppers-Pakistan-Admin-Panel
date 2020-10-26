<template>
  <sale-order />
</template>

<script>
import SaleOrder from '@/components/sale/sale-order/sale-order'
export default {
  name: 'SaleMain',
  components: { SaleOrder },
  data: () => ({
    tab: null
  }),
  methods: {}
}
</script>

<style scoped></style>
