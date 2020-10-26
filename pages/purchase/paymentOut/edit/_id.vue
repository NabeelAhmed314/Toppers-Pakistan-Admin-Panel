<template>
  <PaymentOutForm
    :payment-out="paymentOut"
    is-update
    title="Update Payment Out"
  />
</template>

<script>
import PaymentOutForm from '@/components/purchase/payment-out/form'
export default {
  name: 'Id',
  components: { PaymentOutForm },
  middleware: 'isAdmin',
  async asyncData({ $axios, route }) {
    return {
      paymentOut: await $axios.$get('paymentOut/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
