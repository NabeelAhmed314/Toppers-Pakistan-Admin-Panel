<template>
  <div style="padding: 20px">
    <DataViewer
      title="Addresses"
      :endpoint="'/address/' + customerId"
      :columns="columns"
      back
      :action="false"
    />
  </div>
</template>

<script>
import DataViewer from '@/common/ui/widgets/DataViewer'
export default {
  name: 'CustomerAddresses',
  components: { DataViewer },
  props: {
    customerId: {
      type: String,
      default: '0'
    }
  },
  data: () => {
    return {
      columns: [
        { text: 'Address', value: 'address' },
        { text: 'Phone', value: 'mobile' }
      ]
    }
  }
}
</script>

<style scoped></style>
