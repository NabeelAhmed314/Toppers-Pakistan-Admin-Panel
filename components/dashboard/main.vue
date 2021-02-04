<template>
  <div>
    <div style="display: flex;padding-top: 5px">
      <v-spacer />
      <v-btn
        style="margin: 0 10px;color: white"
        color="green"
        primary
        @click="dayClose"
        >Day Close</v-btn
      >
      <v-btn
        style="margin: 0 10px;color: white"
        color="blue"
        primary
        @click="dialog = !dialog"
        >Month Close</v-btn
      >
    </div>
    <div class="my-dashboard-main">
      <div>
        <p style="font-weight: bold">Sale</p>
        <div class="my-dashboard-card">
          <DashboardCard
            endpoint="/filterSale"
            to="/sale/saleOrder"
            title="Sale"
            :has-filter="false"
            :value="dashboard.sale"
          />
          <DashboardCard
            endpoint="/filterToRecieve"
            to="/sale/paymentIn"
            title="To Recieve"
            :has-filter="false"
            :value="dashboard.toReceive"
          />
        </div>
      </div>
      <div></div>
    </div>
    <div class="my-dashboard-main-two">
      <div>
        <p style="font-weight: bold">Purchase</p>
        <div class="my-dashboard-card-three">
          <DashboardCard
            endpoint="/filterPurchase"
            to="/purchase/purchaseOrder"
            title="Purchase"
            red-color
            :has-filter="false"
            :value="dashboard.purchase"
          />
          <DashboardCard
            endpoint="/filterToPay"
            to="/purchase/paymentOut"
            title="To Pay"
            red-color
            :has-filter="false"
            :value="dashboard.toPay"
          />
          <DashboardCard
            endpoint="/filterExpense"
            to="/expense"
            title="Expense"
            :has-filter="false"
            :value="dashboard.expense"
          />
        </div>
      </div>
      <div>
        <p style="font-weight: bold">Stock Inventory</p>
        <DashboardCard
          :has-filter="false"
          to="/item"
          title="Stock Value"
          :value="dashboard.stockValue"
        />
      </div>
    </div>
    <div class="my-dashboard-main-one">
      <div>
        <p style="font-weight: bold">Cash</p>
        <DashboardCard
          :has-filter="false"
          title="Cash In Hand"
          :value="dashboard.cash"
        />
      </div>
    </div>
    <v-dialog v-model="dialog" width="25%">
      <v-card>
        <v-card-title>
          Month Close
        </v-card-title>
        <v-form ref="form">
          <div class="my-range-picker-date">
            <v-text-field
              v-model="from"
              :rules="[required]"
              dense
              type="date"
              aria-hidden="true"
              outlined
              label="From"
            />
            <v-text-field
              v-model="to"
              :rules="[required]"
              aria-hidden="true"
              dense
              type="date"
              outlined
              label="To"
            >
              To
            </v-text-field>
          </div>
          <v-btn
            style="color: white;margin: 0 16px 16px 16px"
            color="blue"
            primary
            @click="monthClose"
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'
import DashboardCard from '@/components/dashboard/dashboardCard'
export default {
  name: 'DashboardMain',
  components: { DashboardCard },
  props: {
    dashboard: {
      type: Object,
      default: () => {}
    }
  },
  data: () => {
    return {
      dialog: false,
      from: null,
      to: null
    }
  },
  methods: {
    required,
    async dayClose() {
      console.log(this.dashboard)
      if (
        confirm("This will Close Today's Sales Calculations! Are you sure?")
      ) {
        if (this.$auth.user.type === 'Main Admin') {
          await this.$axios.$post('dayClose/store/0', this.dashboard)
        } else {
          await this.$axios.$post(
            'dayClose/store/' + this.$auth.user.branch_id,
            this.dashboard
          )
        }
        await this.$router.push('/report/dayClose')
      }
    },
    async monthClose() {
      if (this.$refs.form.validate()) {
        console.log(this.from)
        console.log(this.to)
        const data = {
          from: this.from,
          to: this.to
        }
        if (this.$auth.user.type === 'Main Admin') {
          await this.$axios.$post('monthClose/store/0', data)
        } else {
          await this.$axios.$post(
            'monthClose/store/' + this.$auth.user.branch_id,
            data
          )
        }
        console.log(data)
        await this.$router.push('/report/monthClose')
      }
    }
  }
}
</script>

<style scoped>
.my-dashboard-main {
  display: grid;
  grid-template-columns: calc(50% - 10px) calc(50% - 10px);
  grid-column-gap: 20px;
  grid-row-gap: 5px;
  padding: 10px;
}
.my-dashboard-main-one {
  display: grid;
  grid-template-columns: calc(25% - 10px) calc(75% - 10px);
  grid-column-gap: 20px;
  grid-row-gap: 5px;
  padding: 10px;
}
.my-dashboard-main-two {
  display: grid;
  grid-template-columns: calc(75% - 10px) calc(25% - 10px);
  grid-column-gap: 20px;
  grid-row-gap: 5px;
  padding: 10px;
}
.my-dashboard-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
}
.my-dashboard-card-three {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 10px;
}
.my-range-picker-date {
  display: flex;
  grid-column-gap: 15px;
  padding: 0 16px;
}
</style>
