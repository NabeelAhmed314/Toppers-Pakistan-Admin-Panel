<template>
  <div class="entity-detail-main">
    <div v-if="item.stock" class="entity-detail-item">
      <div style="display: flex;margin:15px 0">
        <p style="margin: 0">{{ item.name }}</p>
        <v-spacer />
        <v-btn
          v-if="$auth.user.type === 'Main Admin'"
          color="primary"
          small
          aria-hidden="true"
          @click="
            () => {
              adjust = !adjust
              this.endpoint = this.variant
                ? '/itemTransaction/variant/store'
                : '/itemTransaction/no-variant/store'
            }
          "
          >Adjust Item</v-btn
        >
      </div>
      <div style="display: flex">
        <p>SALE PRICE:&nbsp;</p>
        <p class="entity-value">Rs. {{ item.sale_price }}</p>
        <v-spacer />
        <p>STOCK QUANTITY:&nbsp;</p>
        <p class="entity-value">{{ item.stock }}</p>
      </div>
      <div style="display: flex">
        <p>PURCHASE PRICE:&nbsp;</p>
        <p class="entity-value">Rs. {{ item.purchase_price }}</p>
        <v-spacer />
        <p>STOCK VALUE:&nbsp;</p>
        <p class="entity-value">Rs. {{ item.stock_value }}</p>
      </div>
    </div>
    <v-data-table
      :height="item.stock ? '52vh' : '78vh'"
      :headers="dataColumns"
      :items="data"
      :search="search"
      class="elevation-1"
      disable-pagination
      hide-default-footer
      dense
      @click:row="openDetail(item)"
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
              aria-hidden="true"
              dense
              clearable
            >
            </v-text-field>
          </div>
          <v-btn
            v-if="!item.stock"
            style="margin: 0 10px"
            aria-hidden="true"
            color="primary"
            @click="openVariant"
            >Details</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="item.type < 3 && $auth.user.type === 'Main Admin'"
          color="green"
          small
          class="mr-2"
          aria-hidden="true"
          @click.stop.prevent="update(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
      <template v-slot:item.type="{ item }">
        <p style="margin: 0">
          {{ getType(item.type) }}
        </p>
      </template>
      <template v-slot:item.price="{ item }">
        <p style="margin: 0">Rs. {{ item.price }}</p>
      </template>
    </v-data-table>
    <v-dialog
      v-model="adjust"
      max-width="50%"
      persistent
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
            :rules="[required]"
            outlined
            readonly
            dense
            label="Product Name"
          />
          <v-select
            v-model="adjustment.type"
            :rules="[required]"
            :items="updateAdjust ? updateAdjustType : adjustType"
            :value="adjustment.type"
            label="Adjustment Type"
            :readonly="readonly"
            dense
            outlined
          ></v-select>
          <v-text-field
            v-model="adjustment.quantity"
            :rules="[required]"
            outlined
            type="number"
            dense
            label="Quantity"
          />
          <v-text-field
            v-model="adjustment.date"
            :rules="[required]"
            type="date"
            outlined
            dense
            label="Adjustment Date"
          />
          <v-text-field
            v-model="adjustment.price"
            outlined
            :rules="[required]"
            type="number"
            dense
            label="Price"
          />
        </div>
      </SimpleForm>
    </v-dialog>
    <v-dialog v-model="showError" width="50%" style="padding: 20px">
      <v-card style="padding: 20px">
        <p style="margin: 0">Error: {{ error }}</p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'
import SimpleForm from '@/common/ui/widgets/SimpleForm'
export default {
  name: 'ItemDetail',
  components: {
    SimpleForm
  },
  props: {
    detailTitle: {
      type: String,
      default: 'None'
    },
    // eslint-disable-next-line vue/require-prop-types
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
      default: () => []
    },
    variant: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      endpoint: '/itemTransaction/no-variant/store',
      deleteRoute: '/itemTransaction/delete/$id',
      readonly: false,
      search: '',
      adjust: false,
      updateAdjust: false,
      updateAdjustType: ['Add Stock', 'Reduce Stock', 'Opening Stock'],
      adjustType: ['Add Stock', 'Reduce Stock'],
      adjustment: {
        type: null,
        quantity: null,
        date: null,
        price: null
      },
      error: '',
      showError: false
    }
  },
  methods: {
    required,
    openVariant() {
      this.$router.push('/item/variant/' + this.item.id)
    },
    openDetail(item) {
      this.$emit('openAdjust', item)
      this.$emit('openSubCategory', item)
      this.$emit('openProduct', item)
    },
    formData() {
      const formData = new FormData()
      if (this.variant) {
        formData.append('item_id', this.item.item_id)
        formData.append('variant_id', this.item.id)
      } else {
        formData.append('item_id', this.item.id)
      }
      formData.append('quantity', this.adjustment.quantity)
      formData.append('price', this.adjustment.price)
      formData.append('type', this.adjustment.type)
      formData.append('date', this.adjustment.date)
      return formData
    },
    closeDialog(item) {
      this.adjust = !this.adjust
      this.adjustment.type = null
      this.adjustment.date = null
      this.adjustment.price = null
      this.adjustment.quantity = null
      this.endpoint = '/itemTransaction/no-variant/store'
      this.readonly = false
      this.updateAdjust = false
      this.$emit('getItem', item.data)
    },
    noSubmitClose() {
      this.adjust = !this.adjust
      this.adjustment.type = null
      this.adjustment.date = null
      this.adjustment.price = null
      this.adjustment.quantity = null
      this.endpoint = '/itemTransaction/no-variant/store'
      this.readonly = false
      this.updateAdjust = false
    },
    update(item) {
      this.adjustment.quantity = item.quantity
      this.adjustment.type = this.getType(item.type)
      this.adjustment.date = item.date
      this.adjustment.price = item.price
      this.readonly = true
      this.updateAdjust = true
      if (this.variant) {
        this.endpoint = '/itemTransaction/variant/update/' + item.id
      } else {
        this.endpoint = '/itemTransaction/no-variant/update/' + item.id
      }
      this.adjust = true
    },
    getType(item) {
      switch (item) {
        case 0:
          return 'Opening Stock'
        case 1:
          return 'Add Stock'
        case 2:
          return 'Reduce Stock'
        case 3:
          return 'Sale'
        case 5:
          return 'Sale Return'
        case 6:
          return 'Purchase'
        case 7:
          return 'Payment Out'
        case 8:
          return 'Purchase Return'
      }
    },
    async removeItem(item) {
      window.console.log(item)
      if (confirm('Are you sure? You Cannot Undo This Action!')) {
        const response = await this.$axios.$delete(
          this.deleteRoute.replace('$id', item.id)
        )
        console.log(response)
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
