<template>
  <v-container style="display:flex;justify-content: center;align-items: center">
    <SimpleForm
      :method="'post'"
      :data="formData"
      :endpoint="isUpdate ? '/item/update/' + item.id : '/item/store'"
      return
      @response="sendImages"
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
            v-model="item.name"
            class="my-text"
            :rules="[required]"
            outlined
            label="Name"
            :value="item.name"
            dense
          ></v-text-field>
          <v-textarea
            v-model="item.description"
            class="my-text"
            :rules="[required]"
            outlined
            label="Description"
            :value="item.description"
            dense
          ></v-textarea>
          <v-autocomplete
            class="my-text"
            :readonly="isUpdate"
            :value="item.subCategory_id"
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
              (data) => {
                item.subCategory_id = data.id
              }
            "
          ></v-autocomplete>
          <v-autocomplete
            class="my-text"
            :readonly="isUpdate"
            :value="item.branch_id"
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
                item.branch_id = data.id
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
              v-model="item.sale_price"
              :rules="[required, priceWZ]"
              type="number"
              outlined
              label="Sale Price"
              dense
            ></v-text-field>
            <v-text-field
              v-if="!allowVariants"
              v-model="item.purchase_price"
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
              v-model="item.stock"
              :rules="[required, priceWZ]"
              type="number"
              outlined
              label="Stock"
              dense
            ></v-text-field>
            <v-autocomplete
              :items="units"
              :rules="[required]"
              :value="item.unit_id"
              class="my-text my-text-small"
              dense
              item-text="name"
              item-value="id"
              label="Unit"
              outlined
              placeholder="Search Unit"
              return-object
              @change="
                (data) => {
                  item.unit_id = data.id
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
                  style="color:#494237"
                  aria-hidden="true"
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
                <v-btn aria-hidden="true" icon @click="removeOption(i)">
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
            <div v-if="isUpdate && uploadedImages.length > 0">
              <p>Uploaded Images</p>
              <div class="image-carousal">
                <div
                  v-for="(image, i) of uploadedImages"
                  :key="i"
                  style="width: 180px; height: 180px;cursor: pointer"
                >
                  <img
                    width="180"
                    height="180"
                    style="object-fit: cover;"
                    :src="
                      $axios.defaults.baseURL.replace('api/', '') +
                        'images/items/' +
                        image.name
                    "
                    alt="itemImage"
                  />
                  <div class="image-overlay">
                    <v-btn
                      icon
                      outlined
                      color="white"
                      aria-hidden="true"
                      style="margin-right: 10px"
                      @click="deleteImage(i)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      outlined
                      aria-hidden="true"
                      color="white"
                      @click="openImage(image.name)"
                    >
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <vue-upload-multiple-image
              :data-images="imageData"
              @upload-success="uploadImageSuccess"
              @before-remove="beforeRemove"
              @edit-image="editImage"
            />
          </div>
        </v-card>
      </div>
    </SimpleForm>
    <v-dialog v-model="imagePreview" width="50%" @click:outside="closePreview">
      <img
        alt="image-preview"
        :src="
          $axios.defaults.baseURL.replace('api/', '') + 'images/items/' + src
        "
      />
    </v-dialog>
  </v-container>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import SimpleForm from '@/common/ui/widgets/SimpleForm'
import { required, priceWZ } from '@/common/lib/validator'
import { Item } from '@/models/item'
export default {
  name: 'ItemForm',
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
    item: {
      type: Item,
      default: () => new Item()
    },
    variants: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => [{}]
    },
    uploadedImages: {
      type: Array,
      default: () => [{}]
    }
  },
  data: () => ({
    imagePreview: false,
    src: '',
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
    deletedImages: [],
    variantCheck: false,
    branches: [],
    subCategories: [],
    units: [],
    error: null,
    images: [],
    imageData: []
  }),

  beforeMount() {},
  mounted() {
    this.getSubCategories()
    this.getUnits()
    this.getBranches()
    if (this.isUpdate) {
      this.checkVariant()
      if (this.variants.length > 0 && this.options.length > 0) {
        this.options = this._parseOptions(this.options)
        this.variants = this._parseVariants(this.variants)
      } else {
        this.options = [{}]
        this.variants = []
      }
    }
  },
  methods: {
    priceWZ,
    required,
    returnBack() {
      this.$router.back()
    },
    closePreview() {
      this.imagePreview = false
    },
    openImage(i) {
      if (i) {
        this.src = i
        this.imagePreview = true
      }
    },
    _parseOptions(options) {
      return options.map((option) => ({
        name: option.name,
        values: option.values
      }))
    },
    _parseVariants(variants) {
      const _variants = []
      for (const variant of variants) {
        const obj = { variantName: [] }
        for (const key of Object.keys(variant)) {
          if (key === 'sale_price') {
            obj.variantSalePrice = variant[key]
          } else if (key === 'name') {
            obj.variantName.push(variant[key])
          } else if (key === 'purchase_price') {
            obj.variantPurchasePrice = variant[key]
          } else if (key === 'stock') {
            obj.variantStock = variant[key]
          }
        }
        obj.variantName = obj.variantName.join('/')
        _variants.push(obj)
      }
      return _variants
    },
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
    deleteImage(index) {
      this.deletedImages.push(this.uploadedImages[index].id)
      this.uploadedImages.splice(index, 1)
    },
    formData() {
      const myObj = {}
      if (this.allowVariants) {
        myObj.allowVariant = true
        myObj.product = this.item
        myObj.options = this.options
        myObj.variants = this.variants
      } else {
        myObj.allowVariant = false
        myObj.product = this.item
      }
      return myObj
    },
    async sendImages(item) {
      if (!this.isUpdate) {
        const formData = new FormData()
        for (const image of this.images) {
          formData.append('images[]', image)
        }
        await this.$axios.$post('/itemImages/store/' + item.data.id, formData)
      } else {
        const formData = new FormData()
        for (const image of this.images) {
          formData.append('images[]', image)
        }
        for (const deletedImage of this.deletedImages) {
          formData.append('deletedImages[]', deletedImage)
        }
        await this.$axios.$post('/itemImages/update/' + item.data.id, formData)
      }
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
    uploadImageSuccess(formData) {
      formData.forEach((item) => this.images.push(item))
    },
    beforeRemove(index, done) {
      const r = confirm('remove image')
      if (r === true) {
        done()
      } else {
      }
    },
    editImage(formData, index, fileList) {
      window.console.log('edit data', formData, index, fileList)
    },
    checkVariant() {
      this.allowVariants = this.variants.length > 0
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
