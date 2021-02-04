<template>
  <div class="sale-order-main">
    <SimpleForm
      :title="title"
      :data="formData"
      return
      :endpoint="
        isUpdate ? '/paymentIn/update/' + paymentIn.id : '/paymentIn/store'
      "
    >
      <div style="display: flex" class="span-2">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="paymentIn.customer_id"
              outlined
              dense
              flat
              :rules="[required]"
              :search-input.sync="searchCustomer"
              label="Customer *"
              :items="customers"
              item-text="name"
              persistent-hint
              :item-value="(item) => item.id"
              :readonly="isUpdate"
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
            <v-autocomplete
              v-model="paymentIn.branch_id"
              outlined
              dense
              flat
              :rules="[required]"
              label="Branch *"
              :items="branches"
              item-text="name"
              persistent-hint
              :item-value="(item) => item.id"
              :readonly="
                isUpdate ||
                  $auth.user.type === 'Sub Admin' ||
                  this.$auth.user.type === 'Branch Manager'
              "
              @change="getPartialOrders"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="paymentIn.order"
              outlined
              dense
              flat
              label="Partial Order"
              :items="partialOrders"
              item-text="id"
              :item-value="(item) => item"
            >
            </v-autocomplete>
          </div>
          <div class="sale-order-customer-address">
            <div v-if="paymentIn.order">
              <p>Total: {{ paymentIn.order.amount }}</p>
              <p>
                Received :
                {{ paymentIn.order.amount - paymentIn.order.balance_due }}
              </p>
              <p>Balance: {{ paymentIn.order.balance_due }}</p>
            </div>
            <v-textarea
              v-model="paymentIn.description"
              label="Description"
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
            <label style="width: 50%">Receipt Number</label>
            <v-text-field
              v-model="paymentIn.receipt_id"
              readonly
              style="margin: 0"
              dense
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Receipt Date</label>
            <v-text-field
              v-model="paymentIn.receipt_date"
              :readonly="isUpdate"
              :rules="[required]"
              style="margin: 0"
              dense
              type="date"
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Received</label>
            <v-text-field
              v-model="paymentIn.received"
              :rules="[required, paymentIn.order ? priceValidator : true]"
              style="margin: 0"
              dense
              outlined
              type="number"
            />
          </div>
        </div>
      </div>
    </SimpleForm>
    <v-dialog v-model="addCustomer" width="850px">
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
              outlined
              label="Customer Name"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.email"
              :rules="[customerSend.email ? emailValidator : true]"
              outlined
              label="Customer Email"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.phone"
              type="number"
              outlined
              label="Customer Phone"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.address"
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
import { required, emailValidator } from '@/common/lib/validator'
import SimpleForm from '@/common/ui/widgets/SimpleForm'
import { Payment } from '@/models/payment'

export default {
  name: 'PaymentInForm',
  components: {
    SimpleForm
  },
  props: {
    title: {
      type: String,
      default: 'Add Payment In'
    },
    paymentIn: {
      type: [Object, Payment],
      default: () => new Payment()
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      branches: [],
      customers: [],
      addCustomer: false,
      customerSend: {
        name: '',
        phone: '',
        email: '',
        address: ''
      },
      address: null,
      addresses: [],
      searchCustomer: '',
      partialOrders: []
    }
  },
  mounted() {
    this.getCustomers()
    this.getBranches()
    if (
      this.$auth.user.type === 'Sub Admin' ||
      this.$auth.user.type === 'Branch Manager'
    ) {
      this.paymentIn.branch_id = this.$auth.user.branch_id
    }
    if (!this.isUpdate) {
      this.getReceiptId()
    }
  },
  methods: {
    required,
    emailValidator,
    priceValidator(value) {
      let s = null
      if (parseInt(value) <= parseInt(this.paymentIn.order.balance_due)) {
        s = true
      } else {
        s = 'Received must be less than balance.'
      }
      return s
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
    async getBranches() {
      this.branches = await this.$axios.$get('branch')
    },
    async getReceiptId() {
      this.paymentIn.receipt_id = await this.$axios.$get(
        '/paymentIn/getReceipt'
      )
      this.paymentIn.receipt_date = moment().format('YYYY-MM-DD')
    },
    openCustomerForm() {
      this.customerSend.name = this.searchCustomer
      this.addCustomer = !this.addCustomer
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
    selectCustomer(i) {
      console.log('select')
      console.log(i)
      this.paymentIn.customer_id = i
      this.getPartialOrders()
    },
    async getPartialOrders() {
      if (this.paymentIn.customer_id && !this.paymentIn.branch_id) {
        this.partialOrders = await this.$axios.$get(
          '/saleOrder/customer/partial/' + this.paymentIn.customer_id + '/-1'
        )
      } else if (this.paymentIn.customer_id && this.paymentIn.branch_id) {
        this.partialOrders = await this.$axios.$get(
          '/saleOrder/customer/partial/' +
            this.paymentIn.customer_id +
            '/' +
            this.paymentIn.branch_id
        )
      }
    },
    formData() {
      if (this.paymentIn.order) {
        this.paymentIn.order_id = this.paymentIn.order.id
      }
      console.log(this.paymentIn)
      return this.paymentIn
    }
  }
}
</script>

<style>
.form {
  width: 850px !important;
}
.sale-order-main {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sale-order-customer {
  display: flex;
}
.sale-order-customer-form {
  width: 50%;
  padding: 20px;
}
.sale-order-customer-invoice {
  width: 50%;
  padding: 20px;
  margin: 0 20px 0 0;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
