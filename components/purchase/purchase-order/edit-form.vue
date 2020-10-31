<template>
  <div class="sale-order-main">
    <v-form ref="form">
      <div class="sale-order-customer">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="order.supplier"
              style="margin: 0 3px;width: calc(60% - 3px)"
              outlined
              dense
              flat
              :rules="[order.payment_type === 'Credit' ? required : true]"
              :label="
                order.payment_type === 'Credit'
                  ? 'Supplier *'
                  : 'Supplier (Optional)'
              "
              :items="suppliers"
              item-text="name"
              :hint="
                order.supplier
                  ? order.supplier.balance
                    ? 'Bal: ' + order.supplier.balance
                    : 'Bal: 0.0'
                  : ''
              "
              persistent-hint
              :item-value="(item) => item"
              readonly
            >
            </v-autocomplete>
          </div>
          <div class="sale-order-customer-address">
            <v-textarea
              v-model="order.billing_address"
              style="margin: 0 3px;width: calc(60% - 3px)"
              label="Billing Address"
              hide-details
              rows="3"
              dense
              outlined
            />
          </div>
        </div>
        <v-spacer />
        <div class="sale-order-customer-invoice">
          <div style="display: flex">
            <label style="width: 50%">Invoice Number</label>
            <v-text-field
              v-model="order.invoice_id"
              readonly
              style="margin: 0"
              dense
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Invoice Date</label>
            <v-text-field
              v-model="order.invoice_date"
              readonly
              :rules="[required]"
              style="margin: 0"
              dense
              type="date"
            />
          </div>
          <v-autocomplete
            v-model="order.branch_id"
            readonly
            dense
            :rules="[required]"
            :items="branches"
            item-text="name"
            item-value="id"
            label="Branch"
            placeholder="Search a Branch"
            @change="
              (item) => {
                getProducts(item)
              }
            "
          ></v-autocomplete>
        </div>
      </div>
      <div class="sale-order-items">
        <v-data-table
          :headers="columns"
          :items="selectedProducts"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-switch
                v-model="type"
                readonly
                :label="order.payment_type === 'Credit' ? 'Credit' : 'Cash'"
                hide-details
              ></v-switch>
              <v-spacer />
              <v-btn
                style="margin-bottom: 0 !important;"
                color="primary"
                dark
                elevation="0"
                class="mb-2"
                @click="addItem"
                >Add Item</v-btn
              >
            </v-toolbar>
          </template>
          <template v-slot:item.count="{ item }">
            <p style="margin: 0">{{ selectedProducts.indexOf(item) + 1 }}</p>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              v-if="selectedProducts.length > 1"
              color="red"
              @click="removeItem(item)"
              >mdi-delete</v-icon
            >
          </template>
          <template v-slot:item.product="{ item }">
            <div
              :class="{
                variantField: item.variants && item.variants.length > 0
              }"
            >
              <v-autocomplete
                v-model="item.product"
                :value="item.product"
                outlined
                dense
                :readonly="item.id"
                :rules="[required]"
                hide-details
                flat
                :items="products"
                item-text="name"
                :value-comparator="(a, b) => a && b && a.id === b.id"
                :item-value="(product) => product"
                @change="(product) => productChanged(product, item)"
              >
                <template v-slot:no-data>
                  <p style="margin: 0;text-align: center">
                    {{
                      order.branch_id
                        ? 'No Products Found'
                        : 'Please Select Branch First'
                    }}
                  </p>
                </template>
              </v-autocomplete>
              <v-autocomplete
                v-if="item.variants && item.variants.length > 0"
                v-model="item.variant"
                :readonly="item.id"
                outlined
                dense
                :rules="[required]"
                hide-details
                flat
                :items="item.variants"
                :value-comparator="(a, b) => a && b && a.id === b.id"
                item-text="name"
                :item-value="(variant) => variant"
                @change="variantChanged(item)"
              >
              </v-autocomplete>
            </div>
          </template>
          <template v-slot:item.qty="{ item }">
            <v-text-field
              v-model="item.qty"
              dense
              outlined
              hide-details
              type="number"
              :rules="[required, quantity]"
              @change="quantityChanged(item)"
            />
          </template>
        </v-data-table>
      </div>
      <div class="sale-order-total">
        <v-spacer />
        <div style="width: 30%">
          <div
            style="display: grid; grid-template-columns: 1fr 1fr;margin-bottom: 5px"
          >
            <label>Total</label>
            <v-text-field
              v-model="total"
              readonly
              outlined
              dense
              hide-details
              placeholder="0.0"
            ></v-text-field>
          </div>
          <div
            v-if="type"
            style="display: grid; grid-template-columns: 1fr 1fr;margin-bottom: 5px"
          >
            <label>Received</label>
            <v-text-field
              v-model="received"
              :value="received"
              outlined
              dense
              hide-details
              placeholder="0.0"
              @change="checkBalance"
            ></v-text-field>
          </div>
          <div
            v-if="type"
            style="display: grid; grid-template-columns: 1fr 1fr;margin-bottom: 5px"
          >
            <label>Balance</label>
            <v-text-field
              v-model="balance"
              readonly
              outlined
              dense
              hide-details
              placeholder="0.0"
            ></v-text-field>
          </div>
        </div>
      </div>
      <v-toolbar flat dense>
        <div></div>
        <v-spacer />
        <v-btn
          style="margin-bottom: 0 !important;"
          color="primary"
          dark
          elevation="0"
          class="mb-2"
          @click="formData"
          >Update</v-btn
        >
      </v-toolbar>
    </v-form>
  </div>
</template>

<script>
import { required, quantity } from '@/common/lib/validator'
export default {
  name: 'EditPurchaseOrder',
  props: {
    order: {
      type: Object,
      default: null
    },
    selectedProducts: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    return {
      branches: [],
      products: [],
      suppliers: [],
      type: false,
      total: null,
      received: null,
      balance: null,
      columns: [
        { text: '#', value: 'count', width: '50px', sortable: false },
        { text: 'Product', value: 'product', width: '500px', sortable: false },
        { text: 'Qty', value: 'qty', width: '100px', sortable: false },
        { text: 'Unit', value: 'product.unit.name', sortable: false },
        { text: 'Price/Unit', value: 'price', sortable: false },
        { text: 'Amount', value: 'amount', sortable: false },
        { text: '', value: 'actions', sortable: false, width: '50px' }
      ]
    }
  },
  mounted() {
    this.getBranches()
    this.getCustomers()
    this.getProducts(this.order.branch_id)
  },
  async beforeMount() {
    await this.setAmount()
  },
  methods: {
    required,
    quantity,
    addItem() {
      this.selectedProducts.push({
        product: null,
        qty: 1,
        unit: null,
        price: null,
        amount: null,
        variants: [],
        variant: null
      })
    },
    async setAmount() {
      this.type = this.order.payment_type === 'Credit'
      this.total = this.order.amount
      this.balance = this.order.balance_due
      this.recieved = this.order.amount - this.order.balance_due
      for (const item of this.selectedProducts) {
        item.amount = item.qty * item.price
        item.variants = await this.$axios.$get('variant/item/' + item.item_id)
        console.log(item)
      }
      this.selectedProducts = Array.from(this.selectedProducts)
    },
    async getBranches() {
      this.branches = await this.$axios.$get('branch')
    },
    async getCustomers() {
      this.suppliers = await this.$axios.$get('supplier')
    },
    async getProducts(i) {
      this.products = await this.$axios.$get('item/filter/' + i)
    },
    async productChanged(i, index) {
      const setIndex = this.selectedProducts.indexOf(index)
      this.selectedProducts[setIndex].variant = null
      this.selectedProducts[setIndex].variants = await this.$axios.$get(
        'variant/item/' + i.id
      )
      if (this.selectedProducts[setIndex].variants.length > 0) {
        this.selectedProducts[setIndex].variant = this.selectedProducts[
          setIndex
        ].variants[0]
        this.selectedProducts[setIndex].price = this.selectedProducts[
          setIndex
        ].variant.sale_price
      } else {
        this.selectedProducts[setIndex].variant = null
        this.selectedProducts[setIndex].price = i.sale_price
      }
      this.selectedProducts[setIndex].product = i
      this.selectedProducts[setIndex].unit = i.unit.name
      this.selectedProducts[setIndex].amount =
        this.selectedProducts[setIndex].price *
        this.selectedProducts[setIndex].qty
      this.getTotal()
      this.checkBalance()
    },
    quantityChanged(item) {
      if (!item) return

      item.amount = parseInt(item.price) * parseInt(item.qty)
      this.selectedProducts = Array.from(this.selectedProducts)
      this.getTotal()
      this.checkBalance()
    },
    variantChanged(item) {
      const setIndex = this.selectedProducts.indexOf(item)
      this.selectedProducts[setIndex].price = this.selectedProducts[
        setIndex
      ].variant.sale_price
      this.selectedProducts[setIndex].amount =
        this.selectedProducts[setIndex].price *
        this.selectedProducts[setIndex].qty
      this.getTotal()
      this.checkBalance()
    },
    removeItem(item) {
      const setIndex = this.selectedProducts.indexOf(item)
      if (this.selectedProducts.length > 1)
        this.selectedProducts.splice(setIndex, 1)
      this.getTotal()
      this.checkBalance()
    },
    getTotal() {
      let total = 0
      for (const product of this.selectedProducts) {
        total = total + parseInt(product.amount)
      }
      this.total = total
    },
    checkBalance() {
      this.balance = this.total - this.received
    },
    async formData() {
      if (this.$refs.form.validate()) {
        const data = {}
        data.supplier = this.order.supplier ? this.order.supplier.id : null
        data.billingAddress = this.order.billing_address
        data.amount = this.total
        if (this.type) data.balance = this.balance
        data.items = []
        for (const item of this.selectedProducts) {
          data.items.push({ item })
        }
        console.log(data)
        await this.$axios.$post('purchaseOrder/update/' + this.order.id, data)
        this.$router.back()
      }
    }
  }
}
</script>

<style>
.sale-order-main {
}
.sale-order-customer {
  display: flex;
  background-color: #fcfcfc;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.sale-order-customer-form {
  width: 40%;
  padding: 20px;
}
.sale-order-customer-invoice {
  width: 30%;
  padding: 20px;
  margin: 0 20px 0 0;
}
.sale-order-customer-name {
}
.sale-order-total {
  display: flex;
  padding: 20px 40px;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}
.variantField {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
}
</style>
