<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      return
      :show-error="false"
      :endpoint="isUpdate ? '/product/update/' + product.id : '/product/store'"
    >
      <template v-slot:header>
        <v-row>
          <v-col
            style="display: flex ; align-items: center; justify-content: center"
            cols="12"
            md="1"
            sm="1"
          >
            <v-btn icon @click="returnBack">
              <v-icon>mdi-keyboard-backspace</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="11" sm="11">
            <v-card-title>{{ title }}</v-card-title>
          </v-col>
        </v-row>
      </template>
      <div class="span-2">
        <v-card style="padding: 20px;margin-bottom: 30px;box-shadow: none">
          <v-card-title>Product Information</v-card-title>
          <v-text-field
            v-model="product.name"
            class="my-text"
            :rules="[required]"
            outlined
            label="Name"
            :value="product.name"
            dense
          ></v-text-field>
          <v-autocomplete
            class="my-text"
            :value="product.subCategory_id"
            :rules="[required]"
            :items="subCategories"
            :loading="isLoading"
            :search-input.sync="searchSub"
            item-text="name"
            outlined
            item-value="id"
            label="Sub Category"
            placeholder="Search Sub Category"
            return-object
            dense
            @change="
              (item) => {
                product.subCategory_id = item.id
              }
            "
          ></v-autocomplete>
          <v-autocomplete
            class="my-text"
            :value="product.branch_id"
            :rules="[required, quantity]"
            :items="branches"
            :loading="isLoading"
            :search-input.sync="searchBranch"
            item-text="name"
            outlined
            item-value="id"
            label="Branch"
            placeholder="Search Branch"
            return-object
            dense
            @change="
              (item) => {
                product.branch_id = item.id
              }
            "
          ></v-autocomplete>
          <div style="display: flex">
            <v-text-field
              v-model="product.sale_price"
              :rules="[required, price]"
              class="my-text my-text-small"
              outlined
              type="number"
              label="Sale Price"
              :value="product.sale_price"
              dense
            ></v-text-field>
            <v-text-field
              v-model="product.purchase_price"
              :rules="[required, price]"
              class="my-text my-text-small"
              outlined
              type="number"
              label="Purchase Price"
              :value="product.purchase_price"
              dense
            ></v-text-field>
          </div>
          <div style="display: flex">
            <v-text-field
              v-model="product.stock"
              class="my-text my-text-small"
              type="number"
              :rules="[required]"
              :readonly="isUpdate"
              outlined
              label="Stock"
              :value="product.stock"
              dense
            ></v-text-field>
            <v-autocomplete
              :items="units"
              :loading="isLoading"
              :rules="[required]"
              :search-input.sync="searchUnit"
              :value="product.unit_id"
              class="my-text my-text-small"
              dense
              item-text="name"
              item-value="id"
              label="Unit"
              outlined
              placeholder="Search Unit"
              return-object
              @change="
                (item) => {
                  product.unit_id = item.id
                }
              "
            ></v-autocomplete>
          </div>
          <p class="my-text">Media</p>
          <p v-if="error" class="my-text" style="color:red">
            {{ error }}
          </p>
          <div class="my-text">
            <ImageSelector
              v-model="imageFile"
              :image="product"
              route="products"
              @input="sendImage = $event"
            />
          </div>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import SimpleForm from '../../common/ui/widgets/SimpleForm'
import ImageSelector from '../misc/image-selector'
import { Product } from '@/models/product'
import {
  emailValidator,
  required,
  phoneValidator,
  quantity,
  price
} from '@/common/lib/validator'
export default {
  name: 'ProductForm',
  components: {
    SimpleForm,
    ImageSelector
  },
  props: {
    product: {
      type: [Object, Product],
      default: () => new Product()
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Form'
    }
  },
  data: () => ({
    imageFile: null,
    sendImage: null,
    isLoading: false,
    searchSub: null,
    searchBranch: null,
    searchUnit: null,
    branches: [],
    subCategories: [],
    units: [],
    error: null
  }),
  mounted() {
    this.getSubCategories()
    this.getUnits()
    this.getBranches()
  },
  methods: {
    quantity,
    price,
    emailValidator,
    required,
    phoneValidator,
    returnBack() {
      this.$router.back()
    },
    async getSubCategories() {
      this.subCategories = await this.$axios.$get('/subCategory')
    },
    async getBranches() {
      this.branches = await this.$axios.$get('/branch')
    },
    async getUnits() {
      this.units = await this.$axios.$get('/unit')
    },
    formData() {
      const formData = new FormData()
      for (const key of Object.keys(this.product)) {
        if (key === 'id') {
        } else if (key === 'image') {
        } else if (key === 'subCategory_id') {
          formData.append(key, this.product[key])
        } else if (key === 'unit_id') {
          formData.append(key, this.product[key])
        } else {
          formData.append(key, this.product[key])
        }
      }
      if (this.sendImage) {
        formData.append('image', this.sendImage)
      } else if (!this.sendImage && !this.isUpdate) {
        this.error = 'Please Provide Image'
        return null
      }
      formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>

<style scoped>
.my-text-small {
  width: 50%;
}
.my-text {
  margin: 0 20px;
}
</style>
