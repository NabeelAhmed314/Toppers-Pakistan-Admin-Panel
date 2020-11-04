<template>
  <v-container style="display:flex;justify-content: center;align-items: center">
    <SimpleForm
      :method="'post'"
      :data="formData"
      :endpoint="isUpdate ? '/expense/update/' + expense.id : '/expense/store'"
      return
    >
      <template v-slot:header>
        <v-row>
          <v-col
            style="display: flex ; align-items: center; justify-content: center"
            cols="12"
            md="1"
            sm="1"
          >
            <v-btn aria-hidden="true" icon @click="returnBack">
              <v-icon>mdi-keyboard-backspace</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="11" sm="11">
            <v-card-title>{{ title }}</v-card-title>
          </v-col>
        </v-row>
      </template>
      <div class="span-2">
        <v-card style="padding:20px;margin-bottom:20px">
          <v-card-title>Product Information</v-card-title>
          <v-text-field
            v-model="expense.title"
            class="my-text"
            :rules="[required]"
            outlined
            label="Title"
            :value="expense.name"
            dense
          ></v-text-field>
          <v-textarea
            v-model="expense.description"
            class="my-text"
            :rules="[required]"
            outlined
            label="Description"
            :value="expense.description"
            dense
          ></v-textarea>
          <v-autocomplete
            class="my-text"
            :readonly="isUpdate"
            :value="expense.branch_id"
            :items="branches"
            :rules="[required]"
            item-text="name"
            outlined
            item-value="id"
            label="Branch"
            placeholder="Search Branch"
            return-object
            dense
            @change="
              (data) => {
                expense.branch_id = data.id
              }
            "
          ></v-autocomplete>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 10px"
          >
            <v-select
              v-model="expense.type"
              outlined
              dense
              :items="types"
              label="Type"
            />
            <v-text-field
              v-model="expense.total"
              :rules="[required, priceWZ]"
              type="number"
              outlined
              label="Total Expense"
              dense
              @change="total"
            ></v-text-field>
          </div>
          <div
            v-if="expense.type === 'Credit'"
            style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 10px"
          >
            <v-text-field
              v-model="expense.paid"
              type="number"
              outlined
              label="Paid"
              dense
              @change="total"
            ></v-text-field>
            <v-text-field
              v-model="expense.balance"
              readonly
              type="number"
              outlined
              label="Balance"
              dense
            ></v-text-field>
          </div>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import SimpleForm from '@/common/ui/widgets/SimpleForm'
import { required, priceWZ } from '@/common/lib/validator'
import { Expense } from '@/models/expense'
export default {
  name: 'ExpenseForm',
  components: {
    SimpleForm
  },
  props: {
    title: {
      type: String,
      default: 'Add Expense'
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    endpoint: {
      type: String,
      default: 'product-add'
    },
    expense: {
      type: Expense,
      default: () => new Expense()
    }
  },
  data: () => ({
    branches: [],
    types: ['Cash', 'Credit']
  }),
  mounted() {
    this.getBranches()
  },
  methods: {
    priceWZ,
    required,
    returnBack() {
      this.$router.back()
    },
    formData() {
      console.log(this.expense)
      return this.expense
    },
    total() {
      if (this.expense.type === 'Credit' && this.expense.paid) {
        this.expense.balance = this.expense.total - this.expense.paid
      }
    },
    async getBranches() {
      this.branches = await this.$axios.$get('/branch')
    },
    async getUnits() {
      this.units = await this.$axios.$get('/unit')
    }
  }
}
</script>

<style>
.form {
  width: 800px !important;
}
.image-overlay {
  top: 0;
  left: 0;
  z-index: 5;
  opacity: 0;
  width: 100%;
  height: 100%;
  display: flex;
  border-right: 4px;
  position: absolute !important;
  transition: all 0.2s;
  align-items: center;
  margin: 0 !important;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
}
.image-carousal {
  margin-bottom: 10px;
  padding: 10px 5px;
  height: 200px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}
.image-carousal::-webkit-scrollbar {
  display: block !important;
}
.image-carousal::-webkit-scrollbar {
  background-color: #fff;
  width: 16px;
}
.image-carousal::-webkit-scrollbar-track {
  background-color: #fff;
}
.image-carousal::-webkit-scrollbar-track:hover {
  background-color: #f4f4f4;
}
.image-carousal::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  border: 5px solid #fff;
}
.image-carousal::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a5;
  border: 4px solid #f4f4f4;
}
.image-carousal div {
  margin: 0 5px;
  position: relative;
}
.image-carousal div img {
  top: 0;
  /*position: absolute;*/
}
.image-carousal div:hover .image-overlay {
  transform: scale(1);
  opacity: 1;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
