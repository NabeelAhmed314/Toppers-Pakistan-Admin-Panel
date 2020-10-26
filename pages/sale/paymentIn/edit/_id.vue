<template>
  <PaymentInForm :payment-in="paymentIn" is-update title="Update Payment In" />
</template>

<script>
import PaymentInForm from '@/components/sale/payment-in/form'
export default {
  name: 'Id',
  components: { PaymentInForm },
  async asyncData({ $axios, route }) {
    return {
      paymentIn: await $axios.$get('paymentIn/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
