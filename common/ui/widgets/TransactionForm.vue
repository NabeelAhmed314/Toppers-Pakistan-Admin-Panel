<template>
  <simple-form
    :data="data"
    :title="title"
    :return="false"
    :endpoint="endpoint"
    :message="message"
    @reset="reset"
    @response="response"
  >
    <slot />

    <p class="span-2 separator" />

    <div v-if="loading" style="display: flex; justify-content: center">
      <v-progress-circular />
    </div>

    <div v-else-if="patient" class="transaction-content">
      <div v-if="data.remainingAmount !== 0" class="price-line">
        <p>Remaining Amount:</p>
        <span />
        <p>{{ data.remainingAmount }} PKR</p>
      </div>
      <div class="price-line">
        <p>Total Amount:</p>
        <span />
        <p>{{ data.currentAmount }} PKR</p>
      </div>

      <div style="margin-bottom: 20px" />

      <v-text-field
        v-model="transaction.paidCash"
        dense
        outlined
        label="Cash Received"
      />
      <v-text-field
        v-model="transaction.returnedCash"
        dense
        outlined
        label="Cash Returned"
      />
    </div>

    <div v-else>Select a Patient First</div>
  </simple-form>
</template>

<script>
import { defineComponent, ref, watch } from '@vue/composition-api'
import { Transaction } from '../../models/reception/transaction'
import SimpleForm from './SimpleForm'

export default defineComponent({
  extends: SimpleForm,
  components: { SimpleForm },

  props: {
    transaction: {
      type: Transaction,
      required: true
    }
  },

  setup(props, context) {
    const patient = ref(false)
    const loading = ref(false)

    async function updateTransaction() {
      loading.value = true
      const transaction = await context.root.$axios.$get(
        `transactions/remaining/${props.transaction.patient._id}`
      )
      props.transaction.remainingAmount = transaction

      loading.value = false
    }

    function reset() {
      context.emit('reset')
    }

    watch(
      () => props.transaction.patient,
      () => {
        if (props.transaction.patient) {
          patient.value = true
          updateTransaction()
        } else patient.value = false
      }
    )

    function response(res) {
      context.emit('response', res)
    }

    return { patient, loading, reset, response }
  }
})
</script>

<style lang="sass">
.separator
  width: 100% !important
  border-top: 1px solid rgba(black, .14) !important

.transaction-content
  grid-column: 2 / 3 !important

.price-line
  height: 20px
  display: flex
  font-size: 15px
  color: #00000099
  font-family: "Ubuntu Condensed", sans-serif

  span
    flex: 1
</style>
