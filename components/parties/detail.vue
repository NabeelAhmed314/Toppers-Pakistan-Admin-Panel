<template>
  <div class="entity-detail-main">
    <div v-if="party" class="entity-detail-item">
      <div style="display: flex;margin:15px 0">
        <p style="margin: 0">{{ party.name }}</p>
      </div>
      <div style="display: flex">
        <div>
          <p>
            Phone:&nbsp; <span class="entity-value">{{ party.phone }}</span>
          </p>
          <p>
            Email:&nbsp; <span class="entity-value">{{ party.email }}</span>
          </p>
        </div>
        <v-spacer />
        <div>
          <p>
            Balance:&nbsp;
            <span v-if="party.balance" class="entity-value">
              <span v-if="party.balance < 0" class="negative"
                >Rs. {{ toPositive(party.balance) }}</span
              >
              <span v-else class="positive">Rs. {{ party.balance }}</span>
            </span>
            <span v-else class="entity-value">{{ 'Rs. 0.0' }}</span>
          </p>
        </div>
      </div>
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
      <template v-slot:item.action_type="{ item }">
        <p style="margin: 0">
          {{ getType(item.action_type) }}
        </p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'
export default {
  name: 'Detail',
  props: {
    party: {
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
      default: () => []
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
        case 3:
          return 'Sale'
        case 4:
          return 'Payment In'
        case 5:
          return 'Sale Return'
        case 6:
          return 'Purchase Order'
        case 7:
          return 'Payment Out'
        case 8:
          return 'Purchase Return'
      }
    },
    async removeItem(item) {
      window.console.log(item)
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
    },
    toPositive(value) {
      return Math.abs(parseInt(value))
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
.negative {
  color: red;
}
.positive {
  color: green;
}
.form {
  width: 100%;
}
</style>
