<template>
  <div style="padding: 20px">
    <DataViewer
      :action="false"
      title="Month Close"
      :endpoint="
        this.$auth.user.type === 'Main Admin'
          ? 'monthClose/0'
          : 'monthClose/' + this.$auth.user.branch_id
      "
      :columns="columns"
    />
  </div>
</template>

<script>
import DataViewer from '@/common/ui/widgets/DataViewer'
export default {
  name: 'MonthCloseMain',
  components: { DataViewer },
  data: () => {
    return {
      columns: [
        { text: 'Date From', value: 'date_from' },
        { text: 'Date To', value: 'date_to' },
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
