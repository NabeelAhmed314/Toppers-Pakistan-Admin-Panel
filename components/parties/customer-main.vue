<template>
  <div>
    <div class="product-main">
      <div>
        <List
          :data="customers"
          create-route="/parties/customer/add"
          update-route="/parties/customer/edit/$id"
          delete-route="/customer/delete/$id"
          :data-columns="customerHeader"
          @partyChange="updateCustomer"
          @update="getCustomers"
        />
      </div>
      <div>
        <Detail
          v-if="customer"
          :party="customer"
          detail-title="Transactions"
          :data="customerTransactions"
          :data-columns="customerTransactionHeader"
        />
        <!--        <entity-detail-->
        <!--          v-if="product"-->
        <!--          product-->
        <!--          :item="product"-->
        <!--          detail-title="Transactions"-->
        <!--          :data-columns="productTransactionHeader"-->
        <!--          :data="productTransactions"-->
        <!--          @openAdjust="openAdjust"-->
        <!--          @getProduct="updateProduct"-->
        <!--        />-->
      </div>
    </div>
  </div>
</template>

<script>
import List from '@/components/parties/list'
import Detail from '@/components/parties/detail'
export default {
  name: 'CustomerMain',
  components: { Detail, List },
  data: () => ({
    customers: [],
    customer: null,
    customerHeader: [
      { text: 'Name', value: 'name', width: '50%' },
      {
        text: '',
        value: 'actions',
        width: '10px',
        sortable: false,
        align: 'right'
      }
    ],
    customerTransactions: [],
    customerTransactionHeader: [
      { text: 'Type', value: 'action_type' },
      { text: 'Date', value: 'date' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price/Unit', value: 'value' },
      { text: 'Status', value: 'status' },
      { text: '', value: 'actions', width: '10px', sortable: false }
    ]
  }),
  async mounted() {
    await this.getCustomers()
  },
  methods: {
    getCustomer() {
      if (this.customers.length > 0) {
        this.customer = this.customers[0]
        this.getCustomerTransactions()
      } else {
        this.customer = null
      }
    },
    async getCustomerTransactions() {
      this.customerTransactions = await this.$axios.$get(
        'customer/transactions/' + this.customer.id
      )
    },
    updateCustomer(item) {
      this.customer = item
      this.getCustomerTransactions()
    },
    async getCustomers() {
      this.customers = await this.$axios.$get('/customer')
      this.getCustomer()
    }
  }
}
</script>

<style scoped>
.product-main {
  display: grid;
  grid-template-columns: calc(25% - 5px) calc(75% - 5px);
  grid-column-gap: 10px;
  padding: 10px;
}
</style>
