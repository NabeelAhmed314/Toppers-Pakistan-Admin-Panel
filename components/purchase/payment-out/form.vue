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
              :items="suppliers"
              item-text="name"
              persistent-hint
              :item-value="(item) => item.id"
              :readonly="isUpdate"
            >
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
              :readonly="isUpdate || $auth.user.type === 'Sub Admin'"
            >
            </v-autocomplete>
          </div>
          <div class="sale-order-customer-address">
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
            <label style="width: 50%">Received</label>
            <v-text-field
              v-model="paymentOut.received"
              :rules="[required]"
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
      suppliers: []
    }
  },
  mounted() {
    this.getSuppliers()
    this.getBranches()
    if (this.$auth.user.type === 'Sub Admin') {
      this.paymentOut.branch_id = this.$auth.user.branch_id
    }
    if (!this.isUpdate) {
      this.getReceiptId()
    }
  },
  methods: {
    required,
    async getSuppliers() {
      this.suppliers = await this.$axios.$get('supplier')
    },
    async getBranches() {
      this.branches = await this.$axios.$get('branch')
    },
    async getReceiptId() {
      this.paymentOut.receipt_id = await this.$axios.$get(
        '/paymentOut/getReceipt'
      )
    },
    formData() {
      return this.paymentOut
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
