<template>
  <div style="padding: 20px">
    <div style="padding: 20px;margin-bottom: 10px" class="elevation-1">
      <div class="my-range-picker">
        <v-select
          v-model="type"
          :items="items"
          aria-hidden="true"
          dense
          outlined
          @change="getData"
        ></v-select>
        <v-form ref="form" class="my-range-picker-date">
          <v-text-field
            v-if="type === 'Custom'"
            v-model="dates.from"
            :rules="[required]"
            dense
            aria-hidden="true"
            type="date"
            outlined
            label="From"
            @change="getCustom"
          />
          <v-text-field
            v-if="type === 'Custom'"
            v-model="dates.to"
            :rules="[required]"
            dense
            aria-hidden="true"
            type="date"
            outlined
            label="To"
            @change="getCustom"
          >
            To
          </v-text-field>
        </v-form>
      </div>
      <div class="cards-payment">
        <div style="display: flex;">
          <v-card style="padding: 0 10px;width: 90%">
            <p style="margin: 0">Paid</p>
            <h2>Rs {{ paid }}</h2>
          </v-card>
          <v-icon aria-hidden="true" right>mdi-plus</v-icon>
        </div>
        <div style="display: flex">
          <v-card style="padding: 0 10px;width: 90%">
            <p style="margin: 0">Unpaid</p>
            <h2>Rs {{ unpaid }}</h2>
          </v-card>
          <v-icon right>mdi-equal</v-icon>
        </div>
        <v-card style="padding: 0 10px;width: 90%">
          <p style="margin: 0">Total</p>
          <h2>Rs {{ total }}</h2>
        </v-card>
      </div>
    </div>
    <div>
      <v-data-table
        height="40vh"
        :headers="dataColumns"
        :items="data"
        :search="search"
        class="elevation-1"
        disable-pagination
        hide-default-footer
        dense
        @click:row="getDetail"
      >
        <template v-slot:top>
          <v-toolbar dense flat>
            <p style="margin: 0">Transactions</p>
          </v-toolbar>
          <v-toolbar flat color="white">
            <div style="width: 250px">
              <v-text-field
                v-model="search"
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                aria-hidden="true"
                outlined
                hide-details
                dense
                clearable
              >
              </v-text-field>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              style="margin-bottom: 0 !important;"
              color="primary"
              dark
              elevation="0"
              aria-hidden="true"
              class="mb-2"
              @click="handleCreateEvent"
              ><v-icon left>mdi-plus</v-icon>New Purchase</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="green"
            small
            class="mr-2 action-btn"
            aria-hidden="true"
            @click.stop.prevent="handleUpdateEvent(item)"
          >
            Edit
          </v-btn>
          <v-btn
            aria-hidden="true"
            class="mr-2 action-btn"
            color="red"
            small
            @click.stop.prevent="removeItem(item)"
          >
            Delete
          </v-btn>
        </template>
        <template v-slot:item.amount="{ item }">
          <p style="margin: 0">Rs. {{ item.amount }}</p>
        </template>
        <template v-slot:item.balance_due="{ item }">
          <p style="margin: 0">
            Rs. {{ item.balance_due ? item.balance_due : '0.0' }}
          </p>
        </template>
        <template v-slot:item.status="{ item }">
          <p style="margin: 0">
            {{ getStatus(item.amount, item.balance_due) }}
          </p>
        </template>
      </v-data-table>
    </div>
    <v-dialog v-model="showDetail" width="70%">
      <v-card v-if="detail" style="padding: 20px">
        <v-card-title>Sale Order Detail</v-card-title>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Customer Name:&nbsp;&nbsp;</p>
          <p style="color: #116199">
            {{ detail.customer ? detail.customer.name : 'No Customer' }}
          </p>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Invoice Id:&nbsp;&nbsp;</p>
          <p style="color: #116199">{{ detail.invoice_id }}</p>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Invoice Date:&nbsp;&nbsp;</p>
          <p style="color: #116199">{{ detail.invoice_date }}</p>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Payment Type:&nbsp;&nbsp;</p>
          <p style="color: #116199">{{ detail.payment_type }}</p>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Total Bill:&nbsp;&nbsp;</p>
          <p style="color: #116199">Rs. {{ detail.amount }}</p>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Total Paid:&nbsp;&nbsp;</p>
          <p style="color: #116199">
            Rs. {{ detail.amount - detail.balance_due }}
          </p>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr">
          <p style="font-weight: 700">Total Balance:&nbsp;&nbsp;</p>
          <p style="color: #116199">
            Rs. {{ detail.balance_due ? detail.balance_due : '0.0' }}
          </p>
        </div>
        <p style="font-weight: 700">Sale Order Items:`</p>
        <v-data-table
          v-if="detailItems"
          :items="detailItems"
          :headers="detailColumns"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.total="{ item }">
            <p style="margin: 0">
              Rs. {{ item.qty * item.product.sale_price }}
            </p>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showError" width="70%">
      <v-card>
        <v-card-title>Error: {{ error }}</v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'

export default {
  name: 'PurchaseOrder',
  data: () => {
    return {
      error: null,
      showError: false,
      showDetail: false,
      detail: null,
      detailItems: null,
      dates: {
        from: null,
        to: null
      },
      paid: 0,
      unpaid: 0,
      type: 'All',
      search: '',
      data: [],
      items: [
        'All',
        'This Month',
        'Last Month',
        'This Quarter',
        'This Year',
        'Custom'
      ],
      filters: {
        status: []
      },
      dataColumns: [
        { text: 'Date', value: 'invoice_date' },
        { text: 'Invoice No.', value: 'invoice_id' },
        { text: 'Supplier Name', value: 'supplier.name' },
        { text: 'Branch', value: 'branch.name' },
        { text: 'Payment Type', value: 'payment_type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Balance Due', value: 'balance_due' },
        { text: 'Status', value: 'status' },
        { text: '', value: 'actions', sortable: false }
      ],
      detailColumns: [
        { text: 'Name', value: 'product.name' },
        { text: 'Quantity', value: 'qty' },
        { text: 'Unit', value: 'product.unit.name' },
        { text: 'Total', value: 'total' }
      ]
    }
  },
  computed: {
    total() {
      return this.unpaid + this.paid
    },
    filteredSaleOrders() {
      return this.data.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    }
  },
  mounted() {
    this.getData()
    this.getSummary()
  },
  methods: {
    required,
    async getDetail(item) {
      this.showDetail = true
      this.detail = item
      this.detailItems = await this.$axios.$get(
        '/purchaseOrderItems/purchaseOrder/' + item.id
      )
    },
    async getSummary() {
      let id = 4
      if (this.type === 'All') {
        id = 4
      } else if (this.type === 'This Month') {
        id = 0
      } else if (this.type === 'Last Month') {
        id = 1
      } else if (this.type === 'This Quarter') {
        id = 2
      } else if (this.type === 'This Year') {
        id = 3
      }
      let response
      if (
        this.$auth.user.type === 'Sub Admin' ||
        this.$auth.user.type === 'branch Manager'
      ) {
        response = await this.$axios.$get(
          '/purchaseOrder/summary/' + id + '/' + this.$auth.user.branch_id
        )
      } else {
        response = await this.$axios.$get(
          '/purchaseOrder/summary/' + id + '/-1'
        )
      }
      this.paid = response.paid
      this.unpaid = response.unpaid
    },
    handleCreateEvent() {
      this.$router.push('/purchase/purchaseOrder/add')
    },
    handleUpdateEvent(item) {
      this.$router.push('/purchase/purchaseOrder/edit/' + item.id)
    },
    async removeItem(item) {
      if (confirm('Are you sure?')) {
        const response = await this.$axios.$delete(
          '/purchaseOrder/delete/' + item.id
        )
        if (response.error) {
          this.showError = true
          this.error = response.error
        } else {
          await this.getData()
        }
      }
    },
    async getData() {
      let id = 4
      if (this.type === 'All') {
        id = 4
      } else if (this.type === 'This Month') {
        id = 0
      } else if (this.type === 'Last Month') {
        id = 1
      } else if (this.type === 'This Quarter') {
        id = 2
      } else if (this.type === 'This Year') {
        id = 3
      }
      if (
        this.$auth.user.type === 'Sub Admin' ||
        this.$auth.user.type === 'Branch Manager'
      ) {
        this.data = await this.$axios.$get(
          'purchaseOrder/filter/' + id + '/' + this.$auth.user.branch_id
        )
      } else {
        this.data = await this.$axios.$get('purchaseOrder/filter/' + id + '/-1')
      }
      await this.getSummary()
    },
    async getCustom() {
      if (this.$refs.form.validate()) {
        if (this.$auth.user.type === 'Sub Admin') {
          this.data = await this.$axios.$post(
            'purchaseOrder/filter/' + this.$auth.user.branch_id,
            this.dates
          )
        } else {
          this.data = await this.$axios.$post(
            'purchaseOrder/filter/-1',
            this.dates
          )
        }
        let response
        if (this.$auth.user.type === 'Sub Admin') {
          response = await this.$axios.$post(
            '/purchaseOrder/summary/' + this.$auth.user.branch_id,
            this.dates
          )
        } else {
          response = await this.$axios.$post(
            '/purchaseOrder/summary/-1',
            this.dates
          )
        }
        this.paid = response.paid
        this.unpaid = response.unpaid
      }
    },
    getStatus(total, due) {
      if (due) {
        if (due === total) {
          return 'Unpaid'
        } else if (due === '0') {
          return 'Paid'
        } else if (due < 0) {
          return 'Extra'
        } else {
          return 'Partial'
        }
      } else {
        return 'Paid'
      }
    }
  }
}
</script>

<style scoped>
.my-range-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 70%;
  grid-column-gap: 15px;
}
.my-range-picker-date {
  display: flex;
  grid-column-gap: 15px;
}
.cards-payment {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 70%;
  grid-column-gap: 15px;
}
@media (max-width: 799px) {
  .cards-payment {
    width: 100%;
  }
  .my-range-picker {
    width: 100%;
  }
}
</style>
