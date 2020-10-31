<template>
  <SaleReturnForm
    title="Update Sale Return"
    :sale-return="saleReturn"
    is-update
  />
</template>

<script>
import SaleReturnForm from '@/components/sale/sale-return/form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { SaleReturnForm },
  async asyncData({ $axios, route }) {
    console.log(await $axios.$get('saleReturn/' + route.params.id))
    return {
      saleReturn: await $axios.$get('saleReturn/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
