<template>
  <div class="sale-order-main">
    <v-form ref="form">
      <div class="sale-order-customer">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="customer"
              style="margin: 0 3px;width: calc(60% - 3px)"
              outlined
              dense
              flat
              :search-input.sync="searchCustomer"
              :value-comparator="(a, b) => a && b && a.id === b.id"
              :rules="[type ? required : true]"
              :label="type ? 'Customer *' : 'Customer (Optional)'"
              :items="customers"
              item-text="name"
              :hint="
                customer
                  ? customer.balance
                    ? 'Bal: ' + customer.balance
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
                    @click="openCustomerForm()"
                  >
                    <v-icon>mdi-plus-circle</v-icon>
                    Add Party
                  </p>
                </span>
              </template>
            </v-autocomplete>
          </div>
          <div class="sale-order-customer-address">
            <v-select
              v-model="address"
              style="margin: 0 3px;width: calc(60% - 3px)"
              outlined
              dense
              flat
              :value-comparator="(a, b) => a && b && a.id === b.id"
              label="Address (Optional)"
              :items="addresses"
              :item-value="(item) => item"
              @change="(item) => selectAddress(item)"
            >
              <template v-slot:no-data>
                <span>
                  <p style="margin: 0">
                    {{
                      customer ? 'No Address Found' : 'Select Customer First'
                    }}
                  </p>
                </span>
              </template>
              <template v-slot:item="{ item }">
                {{ item.description ? item.description + ',' : '' }}
                {{ item.house ? item.house + ',' : '' }}
                {{ item.street ? item.street + ',' : '' }}
                {{ item.area ? item.area + ',' : '' }}
                {{ item.city ? item.city + ',' : '' }}
                {{ item.mobile ? item.mobile : '' }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.description ? item.description + ',' : '' }}
                {{ item.house ? item.house + ',' : '' }}
                {{ item.street ? item.street + ',' : '' }}
                {{ item.area ? item.area + ',' : '' }}
                {{ item.city ? item.city + ',' : '' }}
                {{ item.mobile ? item.mobile : '' }}
              </template>
            </v-select>
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
            :readonly="
              $auth.user.type === 'Sub Admin' ||
                $auth.user.type === 'Branch Manager'
            "
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
            style="display: grid; grid-template-columns: 1fr 1fr;margin-bottom: 5px"
          >
            <label>Extra Charges</label>
            <v-text-field
              v-model="extraCharges"
              outlined
              dense
              hide-details
              placeholder="0.0"
              @change="extraChargesApply"
            ></v-text-field>
          </div>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr;margin-bottom: 5px"
          >
            <label>Discount</label>
            <v-text-field
              v-model="discount"
              outlined
              dense
              hide-details
              placeholder="0.0"
              @change="extraChargesApply"
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
    <v-dialog v-model="addCustomer" width="50%">
      <SimpleForm
        title="Add Customer"
        method="post"
        :data="saveCustomer"
        endpoint="customer/store"
        @response="addAddress"
      >
        <div class="span-2">
          <v-card style="padding: 20px;margin-bottom: 30px;box-shadow: none">
            <v-text-field
              v-model="customerSend.name"
              :rules="[required]"
              style="align-items: center !important;"
              outlined
              label="Customer Name"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.email"
              style="align-items: center !important;"
              outlined
              label="Customer Email"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.phone"
              style="align-items: center !important;"
              outlined
              label="Customer Phone"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.address"
              style="align-items: center !important;"
              outlined
              label="Customer Address"
              dense
            ></v-text-field>
          </v-card>
        </div>
      </SimpleForm>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import SimpleForm from '../../../common/ui/widgets/SimpleForm'
import { required, quantity } from '@/common/lib/validator'
export default {
  name: 'FormSaleOrder',
  components: {
    SimpleForm
  },
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
      searchCustomer: '',
      branches: [],
      branch: null,
      products: [],
      variants: [],
      customers: [],
      customer: null,
      billingName: null,
      billingAddress: null,
      invoiceNumber: null,
      invoiceDate: null,
      type: false,
      total: null,
      received: null,
      discount: null,
      extraCharges: null,
      balance: null,
      columns: [
        { text: '#', value: 'count', width: '50px', sortable: false },
        { text: 'Product', value: 'product', width: '500px', sortable: false },
        { text: 'Qty', value: 'qty', width: '100px', sortable: false },
        { text: 'Unit', value: 'unit', sortable: false },
        { text: 'Price/Unit', value: 'price', sortable: false },
        { text: 'Amount', value: 'amount', sortable: false },
        { text: '', value: 'actions', sortable: false, width: '50px' }
      ],
      addCustomer: false,
      customerSend: {
        name: '',
        phone: '',
        email: '',
        address: ''
      },
      address: null,
      addresses: []
    }
  },
  mounted() {
    if (
      this.$auth.user.type === 'Sub Admin' ||
      this.$auth.user.type === 'Branch Manager'
    ) {
      this.branch = this.$auth.user.branch_id
      this.getProducts(this.branch)
    }
    this.getBranches()
    this.getCustomers()
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
    async getCustomers() {
      if (this.$auth.user.type === 'Main Admin') {
        this.customers = await this.$axios.$get('/customer/branch/0')
      } else {
        this.customers = await this.$axios.$get(
          '/customer/branch/' + this.$auth.user.branch_id
        )
      }
    },
    async getAddresses() {
      this.addresses = await this.$axios.$get('/address/' + this.customer.id)
    },
    async getInvoiceNumber() {
      this.invoiceNumber = await this.$axios.$get('saleOrder/getInvoice')
      this.invoiceDate = moment().format('YYYY-MM-DD')
    },
    async getProducts(i) {
      this.products = await this.$axios.$get('item/filter/' + i)
    },
    openCustomerForm() {
      this.customerSend.name = this.searchCustomer
      this.addCustomer = !this.addCustomer
    },
    selectAddress(i) {
      this.address = i
    },
    selectCustomer(i) {
      this.customer = i
      this.billingName = i.name
      this.getAddresses()
    },
    saveCustomer() {
      return this.customerSend
    },
    addAddress(data) {
      const send = {}
      if (this.customerSend.address) {
        send.city = this.customerSend.address
      }
      if (this.customerSend.phone) {
        send.mobile = this.customerSend.phone
      }
      send.customer_id = data.data.id
      if (this.customerSend.address) {
        this.$axios.$post('address', send)
      }
      this.getCustomers()
      this.selectCustomer(data.data)
      this.addCustomer = !this.addCustomer
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
    extraChargesApply() {
      this.getTotal()
      if (this.extraCharges && this.discount) {
        this.total =
          parseInt(this.total) +
          parseInt(this.extraCharges) -
          parseInt(this.discount)
      } else if (this.extraCharges && !this.discount) {
        this.total = parseInt(this.total) + parseInt(this.extraCharges)
      } else if (this.discount && !this.extraCharges) {
        this.total = parseInt(this.total) - parseInt(this.discount)
      }
      this.checkBalance()
    },
    async formData() {
      if (this.$refs.form.validate()) {
        // const formData = new FormData()
        const data = {}
        data.customer = this.customer ? this.customer.id : null
        data.billingAddress = this.billingAddress
        data.invoiceNumber = this.invoiceNumber
        data.invoiceDate = this.invoiceDate
        data.branchId = this.branch
        data.type = this.type ? 'Credit' : 'Cash'
        data.amount = this.total
        if (this.address) {
          data.address_id = this.address.id
        }
        if (this.$auth.user.type === 'Branch Manager') {
          data.delivery_fee = this.$auth.user.branch.delivery
        } else {
          for (const branch of this.branches) {
            if (branch.id === this.branch) {
              data.delivery_fee = branch.delivery
            }
          }
        }
        if (this.discount) data.discount = this.discount
        if (this.extraCharges) data.extra = this.extraCharges
        if (this.type) data.balance = this.balance
        data.items = []
        for (const item of this.selectedProducts) {
          data.items.push({ item })
        }
        await this.$axios.$post('saleOrder/store', data)
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
.form {
  width: 100%;
}
</style>
