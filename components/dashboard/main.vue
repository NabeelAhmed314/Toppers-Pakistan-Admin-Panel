<template>
  <div>
    <div class="my-dashboard-main">
      <nuxt-link to="/sale/saleOrder" style="text-decoration: none">
        <div>
          <p>Sale</p>
          <div class="my-dashboard-card">
            <v-card style="padding: 5px;">
              <p>Sale:</p>
              <p style="text-align: center;color:#2E7F73;margin: 40px 0">
                Rs {{ dashboard.sale }}
              </p>
            </v-card>
            <v-card style="padding: 5px">
              <p>To Receive:</p>
              <p style="text-align: center;color:#2E7F73;margin: 40px 0">
                Rs {{ dashboard.toReceive }}
              </p>
            </v-card>
          </div>
        </div>
      </nuxt-link>
      <nuxt-link to="/item" style="text-decoration: none">
        <div>
          <p>Stock</p>
          <div class="my-dashboard-card">
            <v-card style="padding: 5px">
              <p>Total Stock:</p>
              <p style="text-align: center;color:#2E7F73;margin: 40px 0">
                {{ dashboard.stock }}
              </p>
            </v-card>
            <v-card style="padding: 5px">
              <p>Stock Value:</p>
              <p style="text-align: center;color:#2E7F73;margin: 40px 0">
                Rs {{ dashboard.stockValue }}
              </p>
            </v-card>
          </div>
        </div>
      </nuxt-link>
      <nuxt-link to="/purchase/purchaseOrder" style="text-decoration: none">
        <div>
          <p>Purchase</p>
          <div class="my-dashboard-card">
            <v-card style="padding: 5px">
              <p>Purchase:</p>
              <p style="text-align: center;color:#2E7F73;margin: 40px 0">
                Rs {{ dashboard.purchase }}
              </p>
            </v-card>
            <v-card style="padding: 5px">
              <p>To Pay:</p>
              <p style="text-align: center;color:#EB0000;margin: 40px 0">
                Rs {{ dashboard.toPay }}
              </p>
            </v-card>
          </div>
        </div>
      </nuxt-link>
      <nuxt-link to="/expense" style="text-decoration: none">
        <div>
          <p>Cash & Expense</p>
          <div class="my-dashboard-card">
            <v-card style="padding: 5px">
              <p>Cash in hand:</p>
              <p style="text-align: center;color:#2E7F73;margin: 40px 0">
                Rs {{ dashboard.cash }}
              </p>
            </v-card>
            <v-card style="padding: 5px">
              <p>Expense:</p>
              <p style="text-align: center;color: #EB0000;margin: 40px 0">
                Rs {{ dashboard.expense }}
              </p>
            </v-card>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardMain',
  props: {
    dashboard: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.my-dashboard-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 10px;
  padding: 20px;
}
.my-dashboard-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
}
</style>
