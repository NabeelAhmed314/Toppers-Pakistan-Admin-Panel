<template>
  <div class="sale-order-main">
    <SimpleForm
      :title="title"
      :data="formData"
      return
      :endpoint="
        isUpdate ? '/paymentOut/update/' + paymentOut.id : '/paymentOut/store'
      "
    >
      <div style="display: flex" class="span-2">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="paymentOut.supplier_id"
              outlined
              dense
              flat
              :rules="[required]"
              label="Supplier *"
              :search-input.sync="searchSupplier"
              :items="suppliers"
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
              v-model="paymentOut.branch_id"
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
              @click="getPartialOrders"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="paymentOut.order"
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
            <div v-if="paymentOut.order">
              <p>Total: {{ paymentOut.order.amount }}</p>
              <p>
                Paid :
                {{ paymentOut.order.amount - paymentOut.order.balance_due }}
              </p>
              <p>Balance: {{ paymentOut.order.balance_due }}</p>
            </div>
            <v-textarea
              v-model="paymentOut.description"
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
              v-model="paymentOut.receipt_id"
              readonly
              style="margin: 0"
              dense
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Receipt Date</label>
            <v-text-field
              v-model="paymentOut.receipt_date"
              :readonly="isUpdate"
              :rules="[required]"
              style="margin: 0"
              dense
              type="date"
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Paid</label>
            <v-text-field
              v-model="paymentOut.received"
              :rules="[required, paymentOut.order ? priceValidator : true]"
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
        endpoint="supplier/store"
        @response="selectCustomerAfterSave"
      >
        <div class="span-2">
          <v-card style="padding: 20px;margin-bottom: 30px;box-shadow: none">
            <v-text-field
              v-model="customerSend.name"
              :rules="[required]"
              style="align-items: center !important;"
              outlined
              label="Supplier Name"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.email"
              style="align-items: center !important;"
              outlined
              label="Supplier Email"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerSend.phone"
              style="align-items: center !important;"
              outlined
              type="number"
              label="Supplier Phone"
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
import { required } from '@/common/lib/validator'
import SimpleForm from '@/common/ui/widgets/SimpleForm'
import { Payment } from '@/models/payment'
export default {
  name: 'PaymentOutForm',
  components: {
    SimpleForm
  },
  props: {
    title: {
      type: String,
      default: 'Add Payment Out'
    },
    paymentOut: {
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
      suppliers: [],
      searchSupplier: '',
      addCustomer: false,
      customerSend: {
        name: '',
        phone: '',
        email: ''
      },
      partialOrders: []
    }
  },
  mounted() {
    this.getSuppliers()
    this.getBranches()
    if (
      this.$auth.user.type === 'Sub Admin' ||
      this.$auth.user.type === 'Branch Manager'
    ) {
      this.paymentOut.branch_id = this.$auth.user.branch_id
    }
    if (!this.isUpdate) {
      this.getReceiptId()
    }
  },
  methods: {
    required,
    priceValidator(value) {
      let s = null
      if (parseInt(value) <= parseInt(this.paymentOut.order.balance_due)) {
        s = true
      } else {
        s = 'Paid must be less than balance.'
      }
      return s
    },
    async getSuppliers() {
      if (this.$auth.user.type === 'Main Admin') {
        this.suppliers = await this.$axios.$get('/supplier/branch/0')
      } else {
        this.suppliers = await this.$axios.$get(
          '/supplier/branch/' + this.$auth.user.branch_id
        )
      }
    },
    async getBranches() {
      this.branches = await this.$axios.$get('branch')
    },
    async getReceiptId() {
      this.paymentOut.receipt_id = await this.$axios.$get(
        '/paymentOut/getReceipt'
      )
      this.paymentOut.receipt_date = moment().format('YYYY-MM-DD')
    },
    formData() {
      if (this.paymentOut.order) {
        this.paymentOut.order_id = this.paymentOut.order.id
      }
      console.log(this.paymentOut)
      return this.paymentOut
    },
    openCustomerForm() {
      this.customerSend.name = this.searchSupplier
      this.addCustomer = !this.addCustomer
    },
    selectCustomer(i) {
      console.log(i)
      this.getSuppliers()
      this.paymentOut.supplier_id = i
      console.log(this.paymentOut.supplier_id)
      this.getPartialOrders()
    },
    selectCustomerAfterSave(i) {
      console.log(i)
      console.log(i.data.id)
      this.getSuppliers()
      this.paymentOut.supplier_id = i.data.id
      this.addCustomer = false
    },
    saveCustomer() {
      return this.customerSend
    },
    async getPartialOrders() {
      if (this.paymentOut.supplier_id && !this.paymentOut.branch_id) {
        this.partialOrders = await this.$axios.$get(
          '/purchaseOrder/supplier/partial/' +
            this.paymentOut.supplier_id +
            '/-1'
        )
      } else if (this.paymentOut.supplier_id && this.paymentOut.branch_id) {
        this.partialOrders = await this.$axios.$get(
          '/purchaseOrder/supplier/partial/' +
            this.paymentOut.supplier_id +
            '/' +
            this.paymentOut.branch_id
        )
      }
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
