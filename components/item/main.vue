<template>
  <div class="product-main">
    <div>
      <ItemList
        :data="items"
        :data-columns="header"
        create-route="/item/add"
        update-route="/item/edit/$id"
        delete-route="/item/delete/$id"
        @filterItem="filterItems"
        @itemChange="updateItem"
      />
    </div>
    <div>
      <ItemDetail
        v-if="item"
        :item="item"
        detail-title="Transactions"
        :data="itemTransactions"
        :data-columns="itemTransactionHeader"
        @getItem="updateItem"
        @update="getItems"
      />
    </div>
  </div>
</template>

<script>
import ItemList from '@/components/item/list'
import ItemDetail from '@/components/item/detail'
export default {
  name: 'ItemMain',
  components: { ItemDetail, ItemList },
  data: () => {
    return {
      branchId: 0,
      header: [
        { text: 'Name', value: 'name', width: '50%' },
        { text: 'Quantity', value: 'stock', width: '50%' },
        { text: '', value: 'actions', width: '10px', sortable: false }
      ],
      items: [],
      item: null,
      itemTransactions: [],
      itemTransactionHeader: [
        { text: 'Type', value: 'type' },
        { text: 'Name', value: 'customer.name' },
        { text: 'Variant', value: 'variant.name' },
        { text: 'Date', value: 'date' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price/Unit', value: 'price' },
        { text: 'Status', value: 'status' },
        { text: '', value: 'actions', width: '10px', sortable: false }
      ],
      adjustBool: false,
      adjust: null,
      adjustItems: ['Add Stock', 'Reduce Stock', 'Opening Stock']
    }
  },
  mounted() {
    if (this.$auth.user.type === 'Sub Admin') {
      this.branchId = this.$auth.user.branch_id
    }
    this.getItems()
  },
  methods: {
    async getItems() {
      this.items = await this.$axios.$get('item/filter/' + this.branchId)
      if (this.items.length > 0) {
        this.item = this.items[0]
        await this.getItemTransactions()
      } else {
        this.item = null
      }
    },
    async getItemTransactions() {
      this.itemTransactions = await this.$axios.$get(
        '/itemTransaction/item/' + this.item.id
      )
    },
    async filterItems(item) {
      this.branchId = item
      await this.getItems()
    },
    async updateItem(item) {
      this.items = await this.$axios.$get('item/filter/' + this.branchId)
      this.item = item
      await this.getItemTransactions()
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
