<template>
  <div>
    <div class="product-main">
      <div>
        <List
          :data="suppliers"
          :data-columns="supplierHeader"
          create-route="/parties/supplier/add"
          update-route="/parties/supplier/edit/$id"
          delete-route="/supplier/delete/$id"
          @partyChange="updateSupplier"
          @update="getSuppliers"
        />
        <!--        <entity-list-->
        <!--          :data-columns="productHeader"-->
        <!--          :data="products"-->
        <!--          create-route="product/add"-->
        <!--          update-route="product/edit/$id"-->
        <!--          delete-route="/product/delete/$id"-->
        <!--          @update="updateProducts"-->
        <!--          @productChange="updateProduct"-->
        <!--        />-->
      </div>
      <div>
        <Detail
          v-if="supplier"
          :party="supplier"
          detail-title="Transactions"
          :data-columns="supplierTransactionHeader"
          :data="supplierTransactions"
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
  name: 'SupplierMain',
  components: { Detail, List },
  data: () => ({
    suppliers: [],
    supplier: null,
    supplierHeader: [
      { text: 'Name', value: 'name', width: '50%' },
      {
        text: '',
        value: 'actions',
        width: '10px',
        sortable: false,
        align: 'right'
      }
    ],
    supplierTransactions: [],
    supplierTransactionHeader: [
      { text: 'Type', value: 'action_type' },
      { text: 'Date', value: 'date' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price/Unit', value: 'value' },
      { text: 'Status', value: 'status' },
      { text: '', value: 'actions', width: '10px', sortable: false }
    ]
  }),
  async mounted() {
    await this.getSuppliers()
  },
  methods: {
    getSupplier() {
      if (this.suppliers.length > 0) {
        this.supplier = this.suppliers[0]
        this.getSupplierTransactions()
      } else {
        this.supplier = null
      }
    },
    async getSupplierTransactions() {
      this.supplierTransactions = await this.$axios.$get(
        'supplier/transactions/' + this.supplier.id
      )
    },
    updateSupplier(item) {
      this.supplier = item
      this.getSupplierTransactions()
    },
    async getSuppliers() {
      this.suppliers = await this.$axios.$get('/supplier')
      this.getSupplier()
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
