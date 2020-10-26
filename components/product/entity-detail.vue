<template>
  <div class="entity-detail-main">
    <div v-if="product" class="entity-detail-item">
      <div style="display: flex;margin:15px 0">
        <p style="margin: 0">{{ item.name }}</p>
        <v-spacer />
        <v-btn color="primary" small @click="adjust = !adjust"
          >Adjust Item</v-btn
        >
      </div>
      <div style="display: flex">
        <p>SALE PRICE:&nbsp;</p>
        <p class="entity-value">{{ item.sale_price }}</p>
        <v-spacer />
        <p>STOCK QUANTITY:&nbsp;</p>
        <p class="entity-value">{{ item.stock }}</p>
      </div>
      <div style="display: flex">
        <p>PURCHASE PRICE:&nbsp;</p>
        <p class="entity-value">{{ item.purchase_price }}</p>
        <v-spacer />
        <p>STOCK VALUE:&nbsp;</p>
        <p class="entity-value">{{ item.stock_value }}</p>
      </div>
    </div>
    <v-data-table
      :height="product ? '48vh' : '75vh'"
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
              outlined
              hide-details
              dense
              clearable
            >
            </v-text-field>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item.product-actions="{ item }">
        <v-icon
          v-if="item.action_type < 3"
          color="green"
          small
          class="mr-2"
          @click.stop.prevent="update(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="item.action_type < 3"
          color="red"
          small
          @click.stop.prevent="removeItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          color="green"
          small
          class="mr-2"
          @click.stop.prevent="update(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon color="red" small @click.stop.prevent="removeItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.action_type="{ item }">
        <p style="margin: 0">
          {{ getType(item.action_type) }}
        </p>
      </template>
      <template v-slot:item.value="{ item }">
        <p style="margin: 0">Rs. {{ item.value }}</p>
      </template>
    </v-data-table>
    <v-dialog
      v-model="adjust"
      persistent
      width="50%"
      @click:outside="noSubmitClose"
    >
      <SimpleForm
        title="Adjust Product Stock"
        method="post"
        :data="formData"
        :endpoint="endpoint"
        :clear="false"
        @response="closeDialog"
      >
        <div class="span-2">
          <v-text-field
            v-model="item.name"
            class="textfieldStyle"
            :rules="[required]"
            outlined
            readonly
            dense
            label="Product Name"
          />
          <v-select
            v-model="sendData.adjustType"
            :rules="[required]"
            :items="updateAdjust ? updateAdjustType : adjustType"
            :value="sendData.adjustType"
            label="Adjustment Type"
            :readonly="readonly"
            dense
            outlined
          ></v-select>
          <v-text-field
            v-model="sendData.quantity"
            class="textfieldStyle"
            :rules="[required]"
            outlined
            type="number"
            dense
            label="Quantity"
          />
          <v-text-field
            v-model="sendData.date"
            class="textfieldStyle"
            :rules="[required]"
            type="date"
            outlined
            dense
            label="Adjustment Date"
          />
          <v-text-field
            v-model="sendData.atPrice"
            class="textfieldStyle"
            outlined
            :rules="[required]"
            type="number"
            dense
            label="At Price"
          />
        </div>
      </SimpleForm>
    </v-dialog>
  </div>
</template>

<script>
import SimpleForm from '../../common/ui/widgets/SimpleForm'
import { required } from '@/common/lib/validator'
export default {
  name: 'EntityDetail',
  components: { SimpleForm },
  props: {
    product: {
      type: Boolean,
      default: false
    },
    detailTitle: {
      type: String,
      default: 'None'
    },
    item: {
      Type: Object,
      default: null
    },
    data: {
      type: Array,
      default: () => []
    },
    dataColumns: {
      type: Array,
      default: () => [
        { text: 'Order #', value: 'OrderNo' },
        { text: 'Customer', value: 'name' },
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
      updateAdjust: false,
      updateAdjustType: ['Add Stock', 'Reduce Stock', 'Opening Stock'],
      adjustType: ['Add Stock', 'Reduce Stock'],
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
      this.updateAdjust = false
      this.$emit('getProduct', item.data)
    },
    noSubmitClose() {
      this.adjust = !this.adjust
      this.sendData.adjustType = null
      this.sendData.date = null
      this.sendData.atPrice = null
      this.sendData.quantity = null
      this.endpoint = 'productHistory/store'
      this.readonly = false
      this.updateAdjust = false
    },
    update(item) {
      this.sendData.quantity = item.quantity
      this.sendData.adjustType = this.getType(item.action_type)
      this.sendData.date = item.date
      this.sendData.atPrice = item.value
      this.readonly = true
      this.updateAdjust = true
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
        case 5:
          return 'Sale Return'
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
