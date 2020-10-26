<template>
  <div style="padding: 20px">
    <DataViewer
      title="Expenses"
      endpoint="/expense"
      :columns="columns"
      create
      create-route="/expense/add"
      change
      change-route="/expense/edit/$id"
      remove
      remove-route="/expense/delete/$id"
      :on-delete="onDelete"
    />
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="snackbarColor"
      :timeout="1500"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import DataViewer from '@/common/ui/widgets/DataViewer'
export default {
  name: 'ExpenseMain',
  components: { DataViewer },
  data: () => {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'green',
      columns: [
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Branch', value: 'branch.name' },
        { text: 'Total', value: 'total' },
        { text: 'Paid', value: 'paid' },
        { text: 'Balance', value: 'balance' }
      ]
    }
  },
  methods: {
    onDelete() {
      this.snackbarColor = 'green'
      this.snackbarText = 'Deleted Notification Successfully'
      this.snackbar = true
    }
  }
}
</script>

<style scoped></style>
