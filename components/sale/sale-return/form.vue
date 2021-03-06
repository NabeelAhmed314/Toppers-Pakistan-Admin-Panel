<template>
  <div class="sale-order-main">
    <SimpleForm
      style="margin-top: 20px"
      :title="title"
      :data="formData"
      return
      :endpoint="
        isUpdate ? '/saleReturn/update/' + saleReturn.id : '/saleReturn/store'
      "
    >
      <div style="display: flex" class="span-2">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="saleReturn.customer_id"
              outlined
              dense
              flat
              :rules="[required]"
              label="Customer *"
              :items="customers"
              item-text="name"
              persistent-hint
              :item-value="(item) => item.id"
              :readonly="isUpdate"
              @change="getSaleOrders"
            >
            </v-autocomplete>
            <v-autocomplete
              v-if="!isUpdate"
              v-model="saleReturn.sale_order_id"
              outlined
              dense
              flat
              :rules="[required]"
              :value-comparator="(a, b) => a && b && a.id === b.id"
              label="Sale Order #"
              :items="orders"
              item-text="invoice_id"
              persistent-hint
              :item-value="(item) => item"
              :readonly="isUpdate"
              @change="(item) => showOrderDetail(item)"
            >
              <template v-slot:no-data>
                <p style="margin: 0;text-align: center">
                  {{
                    saleReturn.customer_id
                      ? 'No Orders Found'
                      : 'Please Select Customer First'
                  }}
                </p>
              </template>
            </v-autocomplete>
            <div v-if="showDetail">
              <p>
                Invoice Id: <span style="color: #bc282b">{{ invoiceId }}</span>
              </p>
              <p>
                Invoice Date:
                <span style="color: #bc282b">{{ invoiceDate }}</span>
              </p>
              <p>
                Branch Name:
                <span style="color: #bc282b">{{ branch.name }}</span>
              </p>
              <p>
                Total: <span style="color: #bc282b">{{ 'Rs. ' + amount }}</span>
              </p>
              <p>
                Balance:
                <span style="color: #bc282b">{{
                  balance ? 'Rs. ' + balance : 'Rs. 0.0'
                }}</span>
              </p>
            </div>
          </div>
        </div>
        <v-spacer />
        <div class="sale-order-customer-invoice">
          <div style="display: flex">
            <label style="width: 50%">Invoice Number</label>
            <v-text-field
              v-model="saleReturn.invoice_id"
              readonly
              style="margin: 0"
              dense
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Invoice Date</label>
            <v-text-field
              v-model="saleReturn.invoice_date"
              :readonly="isUpdate"
              :rules="[required]"
              style="margin: 0"
              dense
              type="date"
            />
          </div>
          <v-switch
            v-model="saleReturn.payment_type"
            :label="saleReturn.payment_type ? 'Credit' : 'Cash'"
          ></v-switch>
          <div style="display: flex">
            <label style="width: 50%">Total</label>
            <v-text-field
              v-model="saleReturn.total"
              readonly
              :rules="[required]"
              style="margin: 0"
              dense
              outlined
              type="number"
            />
          </div>
          <div v-if="saleReturn.payment_type" style="display: flex">
            <label style="width: 50%">Paid</label>
            <v-text-field
              v-model="saleReturn.paid"
              style="margin: 0"
              dense
              outlined
              type="number"
              @change="paid"
            />
          </div>
          <div v-if="saleReturn.payment_type" style="display: flex">
            <label style="width: 50%">Balance</label>
            <v-text-field
              v-model="saleReturn.balance"
              readonly
              style="margin: 0"
              dense
              outlined
              type="number"
            />
          </div>
        </div>
      </div>
    </SimpleForm>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'
import SimpleForm from '@/common/ui/widgets/SimpleForm'
import { Return } from '@/models/return'

export default {
  name: 'SaleReturnForm',
  components: {
    SimpleForm
  },
  props: {
    title: {
      type: String,
      default: 'Add Sale Return'
    },
    saleReturn: {
      type: [Object, Return],
      default: () => new Return()
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      customers: [],
      orders: [],
      showDetail: false,
      invoiceId: null,
      invoiceDate: null,
      branch: null,
      amount: null,
      balance: null
    }
  },
  mounted() {
    this.getCustomers()
    if (!this.isUpdate) {
      this.getReceiptId()
    } else {
      this.getOrderInfo()
    }
  },
  methods: {
    required,
    getOrderInfo() {
      this.showDetail = true
      this.invoiceId = this.saleReturn.sale_order.invoice_id
      this.invoiceDate = this.saleReturn.sale_order.invoice_date
      this.branch = this.saleReturn.sale_order.branch.name
      this.amount = this.saleReturn.sale_order.amount
      this.balance = this.saleReturn.sale_order.balance
      if (this.saleReturn.payment_type === 'Cash') {
        this.saleReturn.payment_type = false
      } else {
        this.saleReturn.payment_type = true
      }
    },
    async getCustomers() {
      this.customers = await this.$axios.$get('customer')
    },
    async getReceiptId() {
      this.saleReturn.invoice_id = await this.$axios.$get(
        '/saleReturn/getInvoice'
      )
    },
    async getSaleOrders() {
      this.showDetail = false
      if (this.$auth.user.type === 'Sub Admin') {
        this.orders = await this.$axios.$get(
          'saleOrder/customer/' +
            this.saleReturn.customer_id +
            '/' +
            this.$auth.user.branch_id
        )
      } else {
        this.orders = await this.$axios.$get(
          'saleOrder/customer/' + this.saleReturn.customer_id + '/-1'
        )
      }
    },
    paid() {
      this.saleReturn.balance = this.saleReturn.total - this.saleReturn.paid
    },
    showOrderDetail(item) {
      this.showDetail = true
      this.invoiceId = item.invoice_id
      this.invoiceDate = item.invoice_date
      this.branch = item.branch
      this.amount = item.amount
      this.balance = item.balance_due
      this.saleReturn.total = item.amount
    },
    formData() {
      if (this.isUpdate) {
        const formData = new FormData()
        formData.append('sale_order_id', this.saleReturn.sale_order_id)
        if (!this.saleReturn.payment_type) {
          formData.append('paid', this.saleReturn.total)
          formData.append('balance', 0)
        } else {
          formData.append('paid', this.saleReturn.paid)
          formData.append('balance', this.saleReturn.balance)
        }
        formData.append(
          'paymentType',
          this.saleReturn.payment_type ? 'Credit' : 'Cash'
        )
        return formData
      } else {
        const formData = new FormData()
        formData.append('sale_order_id', this.saleReturn.sale_order_id.id)
        formData.append('invoiceId', this.saleReturn.invoice_id)
        formData.append('invoiceDate', this.saleReturn.invoice_date)
        if (!this.saleReturn.payment_type) {
          formData.append('paid', this.saleReturn.total)
          formData.append('balance', 0)
        } else {
          formData.append('paid', this.saleReturn.paid)
          formData.append('balance', this.saleReturn.balance)
        }
        formData.append(
          'paymentType',
          this.saleReturn.payment_type ? 'Credit' : 'Cash'
        )
        // formData.forEach((item) => console.log(item))
        return formData
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
