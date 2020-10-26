<template>
  <div class="sale-order-main">
    <SimpleForm
      style="margin-top: 20px"
      :title="title"
      :data="formData"
      return
      :endpoint="
        isUpdate
          ? '/purchaseReturn/update/' + purchaseReturn.id
          : '/purchaseReturn/store'
      "
    >
      <div style="display: flex" class="span-2">
        <div class="sale-order-customer-form">
          <div class="sale-order-customer-name">
            <v-autocomplete
              v-model="purchaseReturn.supplier_id"
              outlined
              dense
              flat
              :rules="[required]"
              label="Supplier *"
              :items="suppliers"
              item-text="name"
              persistent-hint
              :item-value="(item) => item.id"
              :readonly="isUpdate"
              @change="getSaleOrders"
            >
            </v-autocomplete>
            <v-autocomplete
              v-if="!isUpdate"
              v-model="purchaseReturn.purchase_order_id"
              outlined
              dense
              flat
              :rules="[required]"
              :value-comparator="(a, b) => a && b && a.id === b.id"
              label="Purchase Order #"
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
                    purchaseReturn.supplier_id
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
              v-model="purchaseReturn.invoice_id"
              readonly
              style="margin: 0"
              dense
            />
          </div>
          <div style="display: flex">
            <label style="width: 50%">Invoice Date</label>
            <v-text-field
              v-model="purchaseReturn.invoice_date"
              :readonly="isUpdate"
              :rules="[required]"
              style="margin: 0"
              dense
              type="date"
            />
          </div>
          <v-switch
            v-model="purchaseReturn.payment_type"
            :label="purchaseReturn.payment_type ? 'Credit' : 'Cash'"
          ></v-switch>
          <div style="display: flex">
            <label style="width: 50%">Total</label>
            <v-text-field
              v-model="purchaseReturn.total"
              readonly
              :rules="[required]"
              style="margin: 0"
              dense
              outlined
              type="number"
            />
          </div>
          <div v-if="purchaseReturn.payment_type" style="display: flex">
            <label style="width: 50%">Paid</label>
            <v-text-field
              v-model="purchaseReturn.paid"
              style="margin: 0"
              dense
              outlined
              type="number"
              @change="paid"
            />
          </div>
          <div v-if="purchaseReturn.payment_type" style="display: flex">
            <label style="width: 50%">Balance</label>
            <v-text-field
              v-model="purchaseReturn.balance"
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
  name: 'PurchaseReturnForm',
  components: {
    SimpleForm
  },
  props: {
    title: {
      type: String,
      default: 'Add Purchase Return'
    },
    purchaseReturn: {
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
      suppliers: [],
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
      this.invoiceId = this.purchaseReturn.purchase_order.invoice_id
      this.invoiceDate = this.purchaseReturn.purchase_order.invoice_date
      this.branch = this.purchaseReturn.purchase_order.branch.name
      this.amount = this.purchaseReturn.purchase_order.amount
      this.balance = this.purchaseReturn.purchase_order.balance
      if (this.purchaseReturn.payment_type === 'Cash') {
        this.purchaseReturn.payment_type = false
      } else {
        this.purchaseReturn.payment_type = true
      }
    },
    async getCustomers() {
      this.suppliers = await this.$axios.$get('supplier')
    },
    async getReceiptId() {
      this.purchaseReturn.invoice_id = await this.$axios.$get(
        '/purchaseReturn/getInvoice'
      )
    },
    async getSaleOrders() {
      this.showDetail = false
      if (this.$auth.user.type === 'Sub Admin') {
        this.orders = await this.$axios.$get(
          'purchaseOrder/supplier/' +
            this.purchaseReturn.supplier_id +
            '/' +
            this.$auth.user.branch_id
        )
      } else {
        this.orders = await this.$axios.$get(
          'purchaseOrder/supplier/' + this.purchaseReturn.supplier_id + '/-1'
        )
      }
    },
    paid() {
      this.purchaseReturn.balance =
        this.purchaseReturn.total - this.purchaseReturn.paid
    },
    showOrderDetail(item) {
      this.showDetail = true
      this.invoiceId = item.invoice_id
      this.invoiceDate = item.invoice_date
      this.branch = item.branch
      this.amount = item.amount
      this.balance = item.balance_due
      this.purchaseReturn.total = item.amount
    },
    formData() {
      if (this.isUpdate) {
        const formData = new FormData()
        formData.append(
          'purchase_order_id',
          this.purchaseReturn.purchase_order_id
        )
        if (!this.purchaseReturn.payment_type) {
          formData.append('paid', this.purchaseReturn.total)
          formData.append('balance', 0)
        } else {
          formData.append('paid', this.purchaseReturn.paid)
          formData.append('balance', this.purchaseReturn.balance)
        }
        formData.append(
          'paymentType',
          this.purchaseReturn.payment_type ? 'Credit' : 'Cash'
        )
        return formData
      } else {
        const formData = new FormData()
        formData.append(
          'purchase_order_id',
          this.purchaseReturn.purchase_order_id.id
        )
        formData.append('invoiceId', this.purchaseReturn.invoice_id)
        formData.append('invoiceDate', this.purchaseReturn.invoice_date)
        if (!this.purchaseReturn.payment_type) {
          formData.append('paid', this.purchaseReturn.total)
          formData.append('balance', 0)
        } else {
          formData.append('paid', this.purchaseReturn.paid)
          formData.append('balance', this.purchaseReturn.balance)
        }
        formData.append(
          'paymentType',
          this.purchaseReturn.payment_type ? 'Credit' : 'Cash'
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
