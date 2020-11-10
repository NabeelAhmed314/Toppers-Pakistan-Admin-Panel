<template>
  <div style="padding: 25px">
    <div style="width: 100%">
      <div style="display: flex">
        <h1>Profit & Loss Report</h1>
        <v-spacer />
        <v-btn
          style="margin-bottom: 0 !important;"
          color="primary"
          dark
          elevation="0"
          class="mb-2"
          aria-hidden="true"
          @click="printReport"
          ><v-icon left>mdi-printer</v-icon>Print</v-btn
        >
      </div>
      <table style="width: 100%" cellspacing="0">
        <thead style="background-color: #efefef">
          <tr>
            <td style="background-color: #efefef">Particulars</td>
            <td style="background-color: #efefef;width: 120px">Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sale(+)</td>
            <td style="color: #42b983">Rs. {{ sale }}</td>
          </tr>
          <tr>
            <td>Credit Note(-)</td>
            <td style="color: #bc282b">Rs. {{ creditNote }}</td>
          </tr>
          <tr>
            <td>Purchase(-)</td>
            <td style="color: #bc282b">Rs. {{ purchase }}</td>
          </tr>
          <tr>
            <td>Debit Note(+)</td>
            <td style="color: #42b983">Rs. {{ debitNote }}</td>
          </tr>
          <tr>
            <td>Opening Stock(-)</td>
            <td style="color: #bc282b">Rs. {{ opening }}</td>
          </tr>
          <tr>
            <td>Closing Stock(+)</td>
            <td style="color: #42b983">Rs. {{ closing }}</td>
          </tr>
          <tr>
            <td
              style="border-bottom: 1px solid black;border-top: 1px solid black;"
            >
              Gross Profit
            </td>
            <td
              style="border-bottom: 1px solid black;border-top: 1px solid black;color: #42b983"
            >
              Rs. {{ gross }}
            </td>
          </tr>
          <tr>
            <td>Expenses(-)</td>
            <td style="color: #bc282b">Rs. {{ expense }}</td>
          </tr>
          <tr>
            <td
              style="border-bottom: 1px solid black;border-top: 1px solid black;"
            >
              Net Profit
            </td>
            <td
              style="border-bottom: 1px solid black;border-top: 1px solid black;color: #42b983"
            >
              Rs. {{ net }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'

export default {
  name: 'ProfitLossMain',
  data: () => {
    return {
      dates: {
        from: null,
        to: null
      },
      sale: 0,
      purchase: 0,
      creditNote: 0,
      debitNote: 0,
      opening: 0,
      closing: 0,
      expense: 0
    }
  },
  computed: {
    gross() {
      return (
        this.sale -
        this.creditNote -
        this.purchase +
        this.debitNote -
        this.opening +
        this.closing
      )
    },
    net() {
      return this.gross - this.expense
    }
  },
  mounted() {
    this.getReport()
  },
  methods: {
    required,
    async getReport() {
      let response
      if (this.$auth.user.type === 'Sub Admin') {
        response = await this.$axios.$get(
          'profitLoss/' + this.$auth.user.branch_id
        )
      } else {
        response = await this.$axios.$get('profitLoss/-1')
        console.log(response)
      }
      this.sale = response.sale
      this.creditNote = response.creditNote
      this.purchase = response.purchase
      this.debitNote = response.debitNote
      this.opening = response.openingStock
      this.closing = response.closingStock
      this.expense = response.expense
    },
    printReport() {
      if (this.$auth.user.type === 'Sub Admin') {
        window.open(
          this.$axios.defaults.baseURL +
            'profitLoss/print/' +
            this.$auth.user.branch_id
        )
      } else {
        window.open(this.$axios.defaults.baseURL + 'profitLoss/print/-1')
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
td {
  padding: 10px;
}
</style>
