<template>
  <v-container style="display:flex;justify-content: center;align-items: center">
    <SimpleForm
      :method="isUpdate ? 'patch' : 'post'"
      :data="formData"
      :endpoint="'/item/store'"
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
        <v-card style="padding:20px;margin-bottom:20px">
          <v-card-title>Product Information</v-card-title>
          <v-text-field
            v-model="extraProduct.name"
            class="my-text"
            :rules="[required]"
            outlined
            label="Name"
            :value="extraProduct.name"
            dense
          ></v-text-field>
          <v-autocomplete
            class="my-text"
            :value="extraProduct.subCategory_id"
            :items="subCategories"
            :rules="[required]"
            item-text="name"
            outlined
            item-value="id"
            label="Sub Category"
            placeholder="Search Sub Category"
            return-object
            dense
            @change="
              (item) => {
                extraProduct.subCategory_id = item.id
              }
            "
          ></v-autocomplete>
          <v-autocomplete
            class="my-text"
            :value="extraProduct.branch_id"
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
              (item) => {
                extraProduct.branch_id = item.id
              }
            "
          ></v-autocomplete>
        </v-card>
        <v-card style="padding:20px;margin-bottom:20px">
          <v-card-title>Pricing</v-card-title>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 10px"
          >
            <v-text-field
              v-if="!allowVariants"
              v-model="extraProduct.sale_price"
              :rules="[required, priceWZ]"
              type="number"
              outlined
              label="Sale Price"
              dense
            ></v-text-field>
            <v-text-field
              v-if="!allowVariants"
              v-model="extraProduct.purchase_price"
              :rules="[required, priceWZ]"
              type="number"
              outlined
              label="Purchase Price"
              dense
            ></v-text-field>
          </div>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 10px"
          >
            <v-text-field
              v-if="!allowVariants"
              v-model="extraProduct.stock"
              :rules="[required, priceWZ]"
              type="number"
              outlined
              label="Stock"
              dense
            ></v-text-field>
            <v-autocomplete
              :items="units"
              :rules="[required]"
              :value="extraProduct.unit_id"
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
                  extraProduct.unit_id = item.id
                }
              "
            ></v-autocomplete>
          </div>
          <v-checkbox
            v-model="allowVariants"
            label="This product has multiple variants"
          ></v-checkbox>
          <v-card v-if="allowVariants" style="padding: 20px">
            <v-card-title>Variations</v-card-title>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" md="9" sm="9">
                <v-card-title>Options</v-card-title>
              </v-col>
              <v-col
                v-if="options.length < 3"
                cols="12"
                md="3"
                sm="3"
                style="display: flex; align-items: center"
              >
                <v-btn
                  color="#FF974D"
                  style="color:#ffffff"
                  @click="addOption()"
                  >Add Option
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-for="(option, i) of options" :key="i">
              <v-col cols="12" md="3" sm="3">
                <v-text-field
                  v-model="option.name"
                  :rules="[required]"
                  :label="'Option ' + (i + 1)"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="8" sm="8">
                <v-text-field
                  v-model="option.values"
                  :rules="[required]"
                  dense
                  outlined
                  label="Separate options with comma."
                  @focusout="generateVariants()"
                />
              </v-col>
              <v-col cols="12" md="1" sm="1">
                <v-btn icon @click="removeOption(i)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="variants"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:item.variantSalePrice="{ item }">
                <v-text-field
                  v-model="item.variantSalePrice"
                  :rules="[required, priceWZ]"
                  type="number"
                  style="align-items: center !important;"
                  outlined
                  label="Sale Price"
                  dense
                  hide-details
                ></v-text-field>
              </template>
              <template v-slot:item.variantPurchasePrice="{ item }">
                <v-text-field
                  v-model="item.variantPurchasePrice"
                  :rules="[required, priceWZ]"
                  type="number"
                  style="align-items: center !important;"
                  outlined
                  label="Purchase Price"
                  dense
                  hide-details
                ></v-text-field>
              </template>
              <template v-slot:item.variantStock="{ item }">
                <v-text-field
                  v-model="item.variantStock"
                  :rules="[required, priceWZ]"
                  type="number"
                  style="align-items: center !important;"
                  outlined
                  label="Stock"
                  dense
                  hide-details
                ></v-text-field>
              </template>
            </v-data-table>
          </v-card>
        </v-card>
        <v-card style="padding:20px;margin-bottom:20px">
          <div class="my-text">
            <v-card-title>Media</v-card-title>
            <vue-upload-multiple-image
              :data-images="images"
              @upload-success="uploadImageSuccess"
              @before-remove="beforeRemove"
              @edit-image="editImage"
            />
          </div>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import SimpleForm from '@/common/ui/widgets/SimpleForm'
import { required, priceWZ } from '@/common/lib/validator'
import { Item } from '@/models/item'
export default {
  name: 'ProductAddVariant',
  components: {
    SimpleForm,
    VueUploadMultipleImage
  },
  props: {
    title: {
      type: String,
      default: 'Add Product Variant Wise'
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    endpoint: {
      type: String,
      default: 'product-add'
    },
    extraProduct: {
      type: Item,
      default: () => new Item()
    }
  },

  data: () => ({
    variants: [],
    options: [{}],
    allowVariants: false,
    optionValues: [],
    optionCount: 0,
    headers: [
      {
        text: 'Variant Name',
        align: 'start',
        sortable: false,
        value: 'variantName'
      },
      { text: 'Sale Price', value: 'variantSalePrice', sortable: false },
      {
        text: 'Purchase Price',
        value: 'variantPurchasePrice',
        sortable: false
      },
      { text: 'Stock', value: 'variantStock', sortable: false }
    ],
    variantCheck: false,
    branches: [],
    subCategories: [],
    units: [],
    error: null,
    images: []
  }),

  beforeMount() {},
  mounted() {
    this.getSubCategories()
    this.getUnits()
    this.getBranches()
  },
  methods: {
    priceWZ,
    required,
    returnBack() {
      this.$router.back()
    },
    // _parseOptions(options) {
    //   return options.map((option) => ({
    //     optionName: option.optionName,
    //     optionValues: option.optionValues
    //   }))
    // },
    // _parseVariants(variants) {
    //   const _variants = []
    //   for (const variant of variants) {
    //     const obj = { variantName: [] }
    //     for (const key of Object.keys(variant)) {
    //       if (key === 'price') {
    //         obj.variantPrice = variant[key]
    //       } else {
    //         obj.variantName.push(variant[key])
    //       }
    //     }
    //     obj.variantName = obj.variantName.join('/')
    //     _variants.push(obj)
    //   }
    //   return _variants
    // },
    _combine(index = 0, prevData = []) {
      const variant = []
      if (!this.options[index].values && !this.options[index].name) return []
      const values = this.options[index].values.split(',')
      for (const value of values) {
        if (index === this.options.length - 1) {
          variant.push([...prevData, value.trim()].join('/'))
        } else {
          variant.push(...this._combine(index + 1, [...prevData, value.trim()]))
        }
      }
      return variant
    },
    generateVariants() {
      this.variants = this._combine().map((item) => ({
        variantName: item,
        variantSalePrice: 0,
        variantPurchasePrice: 0,
        variantStock: 0
      }))
    },
    removeOption(i) {
      this.options.splice(i, 1)
      if (this.options.length <= 0) {
        this.allowVariants = false
        this.options.push({})
      }
      if (this.options.length > 0) {
        this.generateVariants()
      }
    },
    addOption() {
      if (this.options.length > 0) {
        this.optionCount++
        this.options.push({})
      }
    },
    formData() {
      const myObj = {}
      if (this.allowVariants) {
        myObj.allowVariant = true
        myObj.product = this.extraProduct
        myObj.options = this.options
        myObj.variants = this.variants
      } else {
        myObj.allowVariant = false
        myObj.product = this.extraProduct
      }
      return myObj
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
    uploadImageSuccess(formData, index, fileList) {
      // Upload image api
      // axios.post('http://your-url-upload', formData).then(response => {
      //   console.log(response)
      // })
    },
    beforeRemove(index, done, fileList) {
      const r = confirm('remove image')
      if (r === true) {
        done()
      } else {
      }
    },
    editImage(formData, index, fileList) {}
  }
}
</script>

<style>
.form {
  width: 800px !important;
}
</style>
