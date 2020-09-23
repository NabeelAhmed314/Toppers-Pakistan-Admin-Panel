<template>
  <div style="padding: 20px">
    <div style="padding: 20px;margin-bottom: 10px" class="elevation-1">
      <div class="my-range-picker">
        <v-select v-model="type" :items="items" dense outlined></v-select>
        <v-text-field
          v-if="type == 'Custom'"
          dense
          type="date"
          outlined
          label="From"
        />
        <v-text-field
          v-if="type == 'Custom'"
          dense
          type="date"
          outlined
          label="To"
        >
          To
        </v-text-field>
      </div>
      <div class="cards-payment">
        <div style="display: flex;">
          <v-card style="padding: 0 10px;width: 90%">
            <p style="margin: 0">Paid</p>
            <h2>Rs {{ paid }}</h2>
          </v-card>
          <v-icon right>mdi-plus</v-icon>
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
        @click:row="openDetail"
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
              class="mb-2"
              @click="handleCreateEvent"
              ><v-icon left>mdi-plus</v-icon>New Sale</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            color="green"
            small
            class="mr-2"
            @click.stop.prevent="update(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon color="red" small @click.stop.prevent="removeItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.action_type="{ item }">
          <p style="margin: 0">
            {{ getType(item.action_type) }}
          </p>
        </template>
        <template v-slot:item.value="{ item }">
          <p style="margin: 0">Rs. {{ item.value }}</p>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaleOrder',
  data: () => {
    return {
      paid: 1000,
      unpaid: 0,
      type: 'All',
      items: [
        'All',
        'This Month',
        'Last Month',
        'This Quarter',
        'This Year',
        'Custom'
      ],
      dataColumns: [
        { text: 'Date', value: 'date' },
        { text: 'Invoice No.', value: 'date' },
        { text: 'Party Name', value: 'date' },
        { text: 'Payment Type', value: 'date' },
        { text: 'Amount', value: 'date' },
        { text: 'Balance Due', value: 'date' },
        { text: '', value: 'actions' }
      ]
    }
  },
  computed: {
    total() {
      return this.unpaid + this.paid
    }
  },
  methods: {
    handleCreateEvent() {
      this.$router.push('/sale/saleOrder/add')
    },
    handleUpdateEvent(item) {
      this.$router.push('/sale/saleOrder/edit/' + item.id)
    },
    async removeItem(item) {
      window.console.log(item)
      console.log(this.deleteRoute)
      if (confirm('Are you sure?')) {
        const response = await this.$axios.$delete(
          this.deleteRoute.replace('$id', item.id)
        )
        if (response.error) {
          this.showError = true
          this.error = response.error
        } else {
          this.$emit('update')
        }
      }
    }
  }
}
</script>

<style scoped>
.my-range-picker {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 70%;
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
