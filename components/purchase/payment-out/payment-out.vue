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
                outlined
                hide-details
                aria-hidden="true"
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
              aria-hidden="true"
              @click="handleCreateEvent"
              ><v-icon left>mdi-plus</v-icon>New Payment Out</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="green"
            small
            class="mr-2 action-btn"
            aria-hidden="true"
            @click="handleUpdateEvent(item)"
          >
            Edit
          </v-btn>
          <v-btn
            aria-hidden="true"
            color="red"
            small
            class="mr-2 action-btn"
            @click.stop.prevent="removeItem(item)"
          >
            Delete
          </v-btn>
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
  name: 'PaymentOut',
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
        { text: 'Name', value: 'supplier.name' },
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
        if (
          this.$auth.user.type === 'Sub Admin' ||
          this.$auth.user.type === 'Branch Manager'
        ) {
          this.data = await this.$axios.$post(
            '/paymentOut/filter/' + this.$auth.user.branch_id,
            data
          )
        } else {
          this.data = await this.$axios.$post('/paymentOut/filter/-1', data)
        }
      }
    },
    async getPaymentIn() {
      if (
        this.$auth.user.type === 'Sub Admin' ||
        this.$auth.user.type === 'Branch Manager'
      ) {
        this.data = await this.$axios.$get(
          '/paymentOut/branch/' + this.$auth.user.branch_id
        )
      } else {
        this.data = await this.$axios.$get('/paymentOut/branch/-1')
      }
    },
    handleCreateEvent() {
      this.$router.push('/purchase/paymentOut/add')
    },
    handleUpdateEvent(item) {
      this.$router.push('/purchase/paymentOut/edit/' + item.id)
    },
    async removeItem(item) {
      window.console.log(item)
      if (confirm('Are you sure?')) {
        const response = await this.$axios.$delete(
          '/paymentOut/delete/' + item.id
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
