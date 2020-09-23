<template>
  <div style="padding: 20px">
    <div>
      <v-data-table
        height="58vh"
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
          <div
            style="display: grid;grid-template-columns: 1fr 1fr;width: 60%;grid-column-gap: 15px;padding: 10px 20px"
          >
            <v-text-field
              hide-details
              dense
              type="date"
              outlined
              label="From"
            />
            <v-text-field hide-details dense type="date" outlined label="To" />
          </div>
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
              ><v-icon left>mdi-plus</v-icon>New Payment In</v-btn
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
  name: 'PaymentIn',
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
        { text: 'Ref No.', value: 'date' },
        { text: 'Name', value: 'date' },
        { text: 'Total', value: 'date' },
        { text: 'Received', value: 'date' },
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
      this.$router.push('/sale/paymentIn/add')
    },
    handleUpdateEvent(item) {
      this.$router.push('/sale/paymentIn/edit/' + item.id)
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

<style scoped></style>
