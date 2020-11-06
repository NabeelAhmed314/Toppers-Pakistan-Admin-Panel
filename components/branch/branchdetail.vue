<template>
  <div class="entity-detail-main">
    <div v-if="branch" class="entity-detail-item">
      <div style="display: flex;margin:15px 0">
        <p style="margin: 0">{{ branch.name }}</p>
      </div>
      <div style="display: flex">
        <p>
          Phone:&nbsp; <span class="entity-value">{{ branch.phone }}</span>
        </p>
        <v-spacer />
        <p>
          Email:&nbsp; <span class="entity-value">{{ branch.email }}</span>
        </p>
      </div>
      <p>
        Address:&nbsp; <span class="entity-value">{{ branch.address }}</span>
      </p>
    </div>
    <v-data-table
      :height="'52vh'"
      :headers="dataColumns"
      :items="data"
      :search="search"
      class="elevation-1"
      disable-pagination
      hide-default-footer
      dense
      @click:row="openDetail"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <p>{{ detailTitle }}</p>
          <v-spacer></v-spacer>
          <div style="width: 250px">
            <v-text-field
              v-model="search"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              aria-hidden="true"
              outlined
              hide-details
              dense
              clearable
            >
            </v-text-field>
          </div>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'
export default {
  name: 'BranchDetail',
  props: {
    branch: {
      type: Object,
      default: null
    },
    detailTitle: {
      type: String,
      default: 'None'
    },
    data: {
      type: Array,
      default: () => []
    },
    dataColumns: {
      type: Array,
      default: () => [
        { text: 'Order #', value: 'OrderNo' },
        { text: 'Customer', value: 'asd' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Total', value: 'total' },
        { text: 'Type', value: 'type' },
        { text: '', value: 'actions', width: '10px', sortable: false }
      ]
    }
  },
  data: () => {
    return {
      endpoint: '/productHistory/store',
      deleteRoute: '/productHistory/delete/$id',
      readonly: false,
      search: '',
      adjust: false,
      adjustType: ['Add Stock', 'Reduce Stock', 'Opening Stock'],
      sendData: {
        adjustType: null,
        quantity: null,
        date: null,
        atPrice: null
      }
    }
  },
  methods: {
    required,
    openDetail(item) {
      this.$emit('openAdjust', item)
      this.$emit('openSubCategory', item)
      this.$emit('openProduct', item)
    },
    formData() {
      const formData = new FormData()
      formData.append('product_id', this.item.id)
      formData.append('quantity', this.sendData.quantity)
      formData.append('atPrice', this.sendData.atPrice)
      formData.append('actionType', this.sendData.adjustType)
      formData.append('date', this.sendData.date)
      return formData
    },
    closeDialog(item) {
      this.adjust = !this.adjust
      this.sendData.adjustType = null
      this.sendData.date = null
      this.sendData.atPrice = null
      this.sendData.quantity = null
      this.endpoint = 'productHistory/store'
      this.readonly = false
      this.$emit('getProduct', item.data)
    },
    update(item) {
      this.sendData.quantity = item.quantity
      this.sendData.adjustType = this.getType(item.action_type)
      this.sendData.date = item.date
      this.sendData.atPrice = item.value
      this.readonly = true
      this.endpoint = '/productHistory/update/' + item.id
      this.adjust = true
    },
    getType(item) {
      switch (item) {
        case 0:
          return 'Add Stock'
        case 1:
          return 'Reduce Stock'
        case 2:
          return 'Opening Stock'
      }
    },
    async removeItem(item) {
      if (confirm('Are you sure?')) {
        const response = await this.$axios.$delete(
          this.deleteRoute.replace('$id', item.id)
        )
        if (response.error) {
          this.showError = true
          this.error = response.error
        } else {
          this.$emit('update')
        }
      }
    }
  }
}
</script>

<style>
.entity-detail-main {
  height: 82vh;
}
.entity-detail-item {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  padding: 10px;
  height: 30%;
  margin-bottom: 10px;
}
.entity-detail-item-detail {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  padding: 10px;
  height: calc(70% - 10px);
}
.entity-value {
  color: #bc282b;
}
.form {
  width: 100%;
}
</style>
