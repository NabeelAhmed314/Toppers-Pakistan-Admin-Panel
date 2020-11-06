<template>
  <div style="padding: 20px">
    <div>
      <v-data-table
        height="63vh"
        :items="data"
        :headers="dataColumns"
        class="elevation-1"
        disable-pagination
        hide-default-footer
        dense
      >
        <template v-slot:top>
          <v-form ref="form">
            <div
              style="display: grid;grid-template-columns: 1fr 1fr;width: 60%;grid-column-gap: 15px;padding: 10px 20px"
            >
              <v-text-field
                v-model="from"
                dense
                :rules="[required]"
                type="date"
                outlined
                label="From"
                @change="filterData"
              />
              <v-text-field
                v-model="to"
                :rules="[required]"
                dense
                type="date"
                outlined
                label="To"
                @change="filterData"
              />
            </div>
          </v-form>
          <v-toolbar dense flat>
            <p style="margin: 0">Transactions</p>
          </v-toolbar>
          <v-toolbar flat color="white">
            <div style="width: 250px">
              <v-text-field
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
            @click="handleUpdateEvent(item)"
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
        <template v-slot:item.received="{ item }">
          <p style="margin: 0">Rs. {{ item.received }}</p>
        </template>
      </v-data-table>
    </div>
    <v-dialog v-model="showError">
      <v-card>
        <v-card-title> Error: {{ error }} </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'
export default {
  name: 'PaymentIn',
  data: () => {
    return {
      to: null,
      from: null,
      data: [],
      error: null,
      showError: false,
      dataColumns: [
        { text: 'Date', value: 'receipt_date' },
        { text: 'Ref No.', value: 'receipt_id' },
        { text: 'Name', value: 'customer.name' },
        { text: 'Branch', value: 'branch.name' },
        { text: 'Received', value: 'received' },
        { text: 'Description', value: 'description' },
        { text: '', value: 'actions' }
      ]
    }
  },
  computed: {
    total() {
      return this.unpaid + this.paid
    }
  },
  mounted() {
    this.getPaymentIn()
  },
  methods: {
    required,
    async filterData() {
      if (this.$refs.form.validate()) {
        const data = {}
        data.to = this.to
        data.from = this.from
        if (this.$auth.user.type === 'Sub Admin') {
          this.data = await this.$axios.$post(
            '/paymentIn/filter/' + this.$auth.user.branch_id,
            data
          )
        } else {
          this.data = await this.$axios.$post('/paymentIn/filter/-1', data)
        }
      }
    },
    async getPaymentIn() {
      if (this.$auth.user.type === 'Sub Admin') {
        this.data = await this.$axios.$get(
          '/paymentIn/branch/' + this.$auth.user.branch_id
        )
      } else {
        this.data = await this.$axios.$get('/paymentIn/branch/-1')
      }
    },
    handleCreateEvent() {
      this.$router.push('/sale/paymentIn/add')
    },
    handleUpdateEvent(item) {
      this.$router.push('/sale/paymentIn/edit/' + item.id)
    },
    async removeItem(item) {
      window.console.log(item)
      if (confirm('Are you sure?')) {
        const response = await this.$axios.$delete(
          '/paymentIn/delete/' + item.id
        )
        if (response.error) {
          this.showError = true
          this.error = response.error
        } else {
          await this.getPaymentIn()
        }
      }
    }
  }
}
</script>

<style scoped></style>
