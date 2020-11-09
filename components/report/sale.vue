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
            type="date"
            aria-hidden="true"
            outlined
            label="From"
            @change="getCustom"
          />
          <v-text-field
            v-if="type === 'Custom'"
            v-model="dates.to"
            :rules="[required]"
            aria-hidden="true"
            dense
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
          <v-icon aria-hidden="true" right>mdi-equal</v-icon>
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
                aria-hidden="true"
                prepend-inner-icon="mdi-magnify"
                outlined
                hide-details
                dense
                clearable
              >
              </v-text-field>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="data.length > 0"
              style="margin-bottom: 0 !important;"
              color="primary"
              dark
              elevation="0"
              class="mb-2"
              aria-hidden="true"
              @click="printReport"
              ><v-icon left>mdi-printer</v-icon>Print</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.amount="{ item }">
          <p style="margin: 0">Rs. {{ item.amount }}</p>
        </template>
        <template v-slot:item.balance_due="{ item }">
          <p style="margin: 0">
            Rs. {{ item.balance_due ? item.balance_due : '0.0' }}
          </p>
        </template>
        <template v-slot:item.delivery_status="{ item }">
          <p v-if="item.delivery > 0" style="margin: 0">
            {{ item.delivery_status }}
          </p>
        </template>
        <template v-slot:item.status="{ item }">
          <p style="margin: 0">
            {{ getStatus(item.amount, item.balance_due) }}
          </p>
        </template>
        <template v-slot:item.invoice_date="{ item }">
          <slot name="invoice_date" :item="item" />
          {{ date(item.invoice_date) }}
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { required } from '@/common/lib/validator'

export default {
  name: 'SaleReport',
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
        { text: 'Customer Name', value: 'customer.name' },
        { text: 'Branch', value: 'branch.name' },
        { text: 'Origin', value: 'origin' },
        { text: 'Payment Type', value: 'payment_type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Discount', value: 'discount' },
        { text: 'Balance Due', value: 'balance_due' },
        { text: 'Status', value: 'status' },
        { text: 'Delivery Status', value: 'delivery_status' }
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
        '/saleOrderItems/saleOrder/' + item.id
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
      if (this.$auth.user.type === 'Sub Admin') {
        response = await this.$axios.$get(
          '/saleOrder/summary/' + id + '/' + this.$auth.user.branch_id
        )
      } else {
        response = await this.$axios.$get('/saleOrder/summary/' + id + '/-1')
      }
      this.paid = response.paid
      this.unpaid = response.unpaid
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
      if (this.$auth.user.type === 'Sub Admin') {
        this.data = await this.$axios.$get(
          'saleOrder/filter/' + id + '/' + this.$auth.user.branch_id
        )
      } else {
        this.data = await this.$axios.$get('saleOrder/filter/' + id + '/-1')
      }
      await this.getSummary()
    },
    async getCustom() {
      if (this.$refs.form.validate()) {
        if (this.$auth.user.type === 'Sub Admin') {
          this.data = await this.$axios.$post(
            'saleOrder/filter/' + this.$auth.user.branch_id,
            this.dates
          )
        } else {
          this.data = await this.$axios.$post('saleOrder/filter/-1', this.dates)
        }
      }
      let response
      if (this.$auth.user.type === 'Sub Admin') {
        response = await this.$axios.$post(
          '/saleOrder/summary/' + this.$auth.user.branch_id,
          this.dates
        )
      } else {
        response = await this.$axios.$post('/saleOrder/summary/-1', this.dates)
      }
      this.paid = response.paid
      this.unpaid = response.unpaid
    },
    date: (date) => moment(date).format('MM/DD/YY'),
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
    },
    printReport() {
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
      } else if (this.type === 'Custom') {
        id = 5
      }
      console.log(id)
      if (this.$auth.user.type === 'Sub Admin') {
        if (id === 5) {
          if (this.dates.from && this.dates.to) {
            window.open(
              this.$axios.defaults.baseURL +
                'saleOrder/printReport/' +
                id +
                '/' +
                this.$auth.user.branch.id +
                '?from=' +
                this.dates.from +
                '$to=' +
                this.dates.to
            )
          } else {
            window.open(
              this.$axios.defaults.baseURL +
                'saleOrder/printReport/' +
                id +
                '/' +
                this.$auth.user.branch.id
            )
          }
        } else {
          window.open(
            this.$axios.defaults.baseURL +
              'saleOrder/printReport/' +
              id +
              '/' +
              this.$auth.user.branch.id
          )
        }
      } else if (id === 5) {
        if (this.dates.from && this.dates.to) {
          window.open(
            this.$axios.defaults.baseURL +
              'saleOrder/printReport/' +
              id +
              '/-1?from=' +
              this.dates.from +
              '&to=' +
              this.dates.to
          )
        } else {
          window.open(
            this.$axios.defaults.baseURL + 'saleOrder/printReport/' + id + '/-1'
          )
        }
      } else {
        window.open(
          this.$axios.defaults.baseURL + 'saleOrder/printReport/' + id + '/-1'
        )
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
