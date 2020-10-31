<template>
  <div class="sale-order-main">
    <v-form ref="form">
      <div class="sale-order-customer">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="supplier"
              style="margin: 0 3px;width: calc(60% - 3px)"
              outlined
              dense
              flat
              :rules="[type ? required : true]"
              :search-input.sync="searchSupplier"
              :label="type ? 'Supplier *' : 'Supplier (Optional)'"
              :value-comparator="(a, b) => a && b && a.id === b.id"
              :items="suppliers"
              item-text="name"
              :hint="
                supplier
                  ? supplier.balance
                    ? 'Bal: ' + supplier.balance
                    : 'Bal: 0.0'
                  : ''
              "
              persistent-hint
              :item-value="(item) => item"
              @change="(item) => selectCustomer(item)"
            >
              <template v-slot:no-data>
                <span>
                  <p
                    style="margin: 0 5px 0 0;text-align: right;cursor: pointer"
                    @click="saveSupplier"
                  >
                    <v-icon>mdi-plus-circle</v-icon>
                    Add Party
                  </p>
                </span>
              </template>
            </v-autocomplete>
          </div>
          <div class="sale-order-customer-address">
            <v-textarea
              v-model="billingAddress"
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
              v-model="invoiceNumber"
              readonly
              style="margin: 0"
              dense
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Invoice Date</label>
            <v-text-field
              v-model="invoiceDate"
              :rules="[required]"
              style="margin: 0"
              dense
              type="date"
            />
          </div>
          <v-autocomplete
            v-model="branch"
            dense
            :rules="[required]"
            :items="branches"
            item-text="name"
            item-value="id"
            label="Branch"
            :readonly="$auth.user.type === 'Sub Admin'"
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
                :label="type ? 'Credit' : 'Cash'"
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
            <div :class="{ variantField: item.variants.length > 0 }">
              <v-autocomplete
                outlined
                dense
                :rules="[required]"
                hide-details
                flat
                :items="products"
                item-text="name"
                :item-value="(product) => product"
                @change="(product) => productChanged(product, item)"
              >
                <template v-slot:no-data>
                  <p style="margin: 0;text-align: center">
                    {{
                      branch
                        ? 'No Products Found'
                        : 'Please Select Branch First'
                    }}
                  </p>
                </template>
              </v-autocomplete>
              <v-autocomplete
                v-if="item.variants.length > 0"
                v-model="item.variant"
                outlined
                dense
                :rules="[required]"
                hide-details
                flat
                :items="item.variants"
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
          >Submit</v-btn
        >
      </v-toolbar>
    </v-form>
  </div>
</template>

<script>
import moment from 'moment'
import { required, quantity } from '@/common/lib/validator'
export default {
  name: 'FormPurchaseOrder',
  data: () => {
    return {
      selectedProducts: [
        {
          product: null,
          qty: 1,
          unit: null,
          price: null,
          amount: null,
          variant: null,
          variants: []
        }
      ],
      searchSupplier: '',
      branches: [],
      branch: null,
      products: [],
      variants: [],
      suppliers: [],
      supplier: null,
      billingName: null,
      billingAddress: null,
      invoiceNumber: null,
      invoiceDate: null,
      type: false,
      total: null,
      received: null,
      balance: null,
      columns: [
        { text: '#', value: 'count', width: '50px', sortable: false },
        { text: 'Product', value: 'product', width: '500px', sortable: false },
        { text: 'Qty', value: 'qty', width: '100px', sortable: false },
        { text: 'Unit', value: 'unit', sortable: false },
        { text: 'Price/Unit', value: 'price', sortable: false },
        { text: 'Amount', value: 'amount', sortable: false },
        { text: '', value: 'actions', sortable: false, width: '50px' }
      ]
    }
  },
  mounted() {
    if (this.$auth.user.type === 'Sub Admin') {
      this.branch = this.$auth.user.branch_id
      this.getProducts(this.branch)
    }
    this.getBranches()
    this.getSuppliers()
    this.getInvoiceNumber()
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
        variant: null,
        variants: []
      })
    },
    async getBranches() {
      this.branches = await this.$axios.$get('branch')
    },
    async getSuppliers() {
      this.suppliers = await this.$axios.$get('supplier')
    },
    async getInvoiceNumber() {
      this.invoiceNumber = await this.$axios.$get('purchaseOrder/getInvoice')
      this.invoiceDate = moment().format('YYYY-MM-DD')
    },
    async getProducts(i) {
      this.products = await this.$axios.$get('item/filter/' + i)
    },
    selectCustomer(i) {
      this.supplier = i
      this.billingName = i.name
    },
    async saveSupplier() {
      if (this.searchSupplier) {
        console.log(this.searchSupplier)
        const obj = {
          name: this.searchSupplier
        }
        const response = await this.$axios.$post('supplier/store', obj)
        await this.getSuppliers()
        this.selectCustomer(response)
      }
    },
    async productChanged(i, index) {
      const setIndex = this.selectedProducts.indexOf(index)
      this.selectedProducts[setIndex].variant = null
      this.selectedProducts[setIndex].variants = await this.$axios.$get(
        'order/variant/item/' + i.id
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
      const setIndex = this.selectedProducts.indexOf(item)
      this.selectedProducts[setIndex].amount =
        this.selectedProducts[setIndex].price *
        this.selectedProducts[setIndex].qty
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
        // const formData = new FormData()
        const data = {}
        data.supplier = this.supplier ? this.supplier.id : null
        data.billingAddress = this.billingAddress
        data.invoiceNumber = this.invoiceNumber
        data.invoiceDate = this.invoiceDate
        data.branchId = this.branch
        data.type = this.type ? 'Credit' : 'Cash'
        data.amount = this.total
        if (this.type) data.balance = this.balance
        data.items = []
        for (const item of this.selectedProducts) {
          data.items.push({ item })
        }
        await this.$axios.$post('purchaseOrder/store', data)
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
