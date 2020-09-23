<template>
  <div class="my-dashboard-main">
    <div>
      <p>Sale</p>
      <div class="my-dashboard-card">
        <v-card style="padding: 5px;">
          <p>Sale:</p>
          <p style="text-align: center;color:#1FAF9D;margin: 40px 0">Rs 0.00</p>
        </v-card>
        <v-card style="padding: 5px">
          <p>To Receive:</p>
          <p style="text-align: center;color:#1FAF9D;margin: 40px 0">Rs 0.00</p>
        </v-card>
      </div>
    </div>
    <div>
      <p>Stock</p>
      <div class="my-dashboard-card">
        <v-card style="padding: 5px">
          <p>Total Stock:</p>
          <p style="text-align: center;color:#1FAF9D;margin: 40px 0">0.00</p>
        </v-card>
        <v-card style="padding: 5px">
          <p>Stock Value:</p>
          <p style="text-align: center;color:#1FAF9D;margin: 40px 0">Rs 0.00</p>
        </v-card>
      </div>
    </div>
    <div>
      <p>Purchase</p>
      <div class="my-dashboard-card">
        <v-card style="padding: 5px">
          <p>Purchase:</p>
          <p style="text-align: center;color:#1FAF9D;margin: 40px 0">Rs 0.00</p>
        </v-card>
        <v-card style="padding: 5px">
          <p>To Pay:</p>
          <p style="text-align: center;color:red;margin: 40px 0">Rs 0.00</p>
        </v-card>
      </div>
    </div>
    <div>
      <p>Cash & Expense</p>
      <div class="my-dashboard-card">
        <v-card style="padding: 5px">
          <p>Cash in hand:</p>
          <p style="text-align: center;color:#1FAF9D;margin: 40px 0">Rs 0.00</p>
        </v-card>
        <v-card style="padding: 5px">
          <p>Expense:</p>
          <p style="text-align: center;color: red;margin: 40px 0">Rs 0.00</p>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardMain'
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
