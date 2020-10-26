<template>
  <ExpenseForm title="Update Expense" :expense="expense" is-update />
</template>

<script>
import ExpenseForm from '@/components/expense/form'
export default {
  name: 'Id',
  components: { ExpenseForm },
  middleware: 'isAdmin',
  async asyncData({ $axios, route }) {
    return {
      expense: await $axios.$get('expense/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
