<template>
  <div style="padding: 20px">
    <DataViewer
      :action="false"
      title="Day Close"
      :endpoint="
        this.$auth.user.type === 'Main Admin'
          ? 'dayClose/0'
          : 'dayClose/' + this.$auth.user.branch_id
      "
      :columns="columns"
    />
  </div>
</template>

<script>
import DataViewer from '@/common/ui/widgets/DataViewer'
export default {
  name: 'DayCloseMain',
  components: { DataViewer },
  data: () => {
    return {
      columns: [
        { text: 'Date', value: 'date' },
        { text: 'Branch', value: 'branch.name' },
        { text: 'Sale', value: 'sale' },
        { text: 'To Recieve', value: 'toReceive' },
        { text: 'Purchase', value: 'purchase' },
        { text: 'To Pay', value: 'toPay' },
        { text: 'Expense', value: 'expense' },
        { text: 'Stock', value: 'stock' },
        { text: 'Stock Value', value: 'stockValue' },
        { text: 'Cash In Hand', value: 'cash' }
      ]
    }
  }
}
</script>

<style scoped></style>
