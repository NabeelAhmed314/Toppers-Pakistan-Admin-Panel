<template>
  <div>
    <v-tabs v-model="tab" background-color="#313F53" color="#ff974d" dark>
      <v-tab>Categories</v-tab>
      <v-tab>Sub Categories</v-tab>
      <v-tab>Units</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <div class="product-main">
          <div>
            <entity-list
              :data-columns="nonProductHeader"
              :data="categories"
              create-route="product/category/add"
              update-route="product/category/edit/$id"
              delete-route="/category/delete/$id"
              @categoryChange="updateCategory"
              @update="updateCategories"
            />
          </div>
          <div>
            <entity-detail
              v-if="category"
              :item="category"
              detail-title="Sub Categories"
              :data-columns="categorySubCategoryHeader"
              :data="categorySubCategories"
              @openSubCategory="openSub"
            />
          </div>
        </div>
        <v-dialog v-model="subCategoryBool" width="50%">
          <v-card v-if="subCategoryDetail" style="padding: 25px;">
            <div style="display: flex;justify-content: center">
              <v-card-title>Sub Category Detail</v-card-title>
            </div>
            <v-text-field
              class="textfieldStyle"
              outlined
              readonly
              dense
              hide-details
              label="Sub Category Name"
              :value="subCategoryDetail.name"
            />
            <div>
              <img
                alt="subCategory"
                width="100%"
                :src="
                  $axios.defaults.baseURL.replace('api/', '') +
                    'images/subCategory/' +
                    subCategoryDetail.image
                "
              />
            </div>
          </v-card>
        </v-dialog>
      </v-tab-item>
      <v-tab-item>
        <div class="product-main">
          <div>
            <entity-list
              :data-columns="nonProductHeader"
              :data="subcategories"
              create-route="product/subcategory/add"
              update-route="product/subcategory/edit/$id"
              delete-route="/subcategory/delete/$id"
              @subCategoryChange="updateSubCategory"
              @update="updateSubCategories"
            />
          </div>
          <div>
            <entity-detail
              v-if="subCategory"
              :item="subCategory"
              detail-title="Products"
              :data-columns="detailProductHeader"
              :data="subCategoryProducts"
              @openProduct="openProduct"
            />
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="product-main">
          <div>
            <entity-list
              :data-columns="nonProductHeader"
              :data="units"
              create-route="product/unit/add"
              update-route="product/unit/edit/$id"
              delete-route="/unit/delete/$id"
              @unitChange="updateUnit"
              @update="updateUnits"
            />
          </div>
          <div>
            <entity-detail
              v-if="unit"
              :item="unit"
              detail-title="Products"
              :data-columns="detailProductHeader"
              :data="unitProducts"
              @openProduct="openProduct"
            />
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="productBool" width="50%">
      <v-card v-if="productDetail" style="padding: 25px;">
        <div style="display: flex;justify-content: center">
          <v-card-title>Product Detail</v-card-title>
        </div>
        <v-text-field
          class="textfieldStyle"
          outlined
          readonly
          dense
          hide-details
          label="Product Name"
          :value="productDetail.name"
        />
        <div style="display: flex">
          <v-text-field
            class="textfieldStyle textfieldStyleSmall"
            outlined
            readonly
            dense
            hide-details
            label="Sale Price"
            :value="productDetail.sale_price"
          />
          <v-text-field
            class="textfieldStyle textfieldStyleSmall"
            outlined
            readonly
            dense
            hide-details
            label="Purchase Price"
            :value="productDetail.purchase_price"
          />
        </div>
        <div style="display: flex">
          <v-text-field
            class="textfieldStyle textfieldStyleSmall"
            outlined
            readonly
            dense
            hide-details
            label="Stock"
            :value="productDetail.stock"
          />
          <v-text-field
            class="textfieldStyle textfieldStyleSmall"
            outlined
            readonly
            dense
            hide-details
            label="Stock Value"
            :value="productDetail.stock_value"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EntityList from './entity-list'
import EntityDetail from './entity-detail'
export default {
  name: 'ProductMain',
  components: { EntityDetail, EntityList },
  data: () => ({
    tab: null,
    // tab 1
    branchId: '-1',
    products: [],
    product: null,
    productHeader: [
      { text: 'Name', value: 'name', width: '50%' },
      { text: 'Quantity', value: 'stock', width: '50%' },
      { text: '', value: 'actions', width: '10px', sortable: false }
    ],
    productTransactions: [],
    productTransactionHeader: [
      { text: 'Type', value: 'action_type' },
      { text: 'Name', value: 'name' },
      { text: 'Date', value: 'date' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price/Unit', value: 'value' },
      { text: 'Status', value: 'status' },
      { text: '', value: 'product-actions', width: '10px', sortable: false }
    ],
    // tab 2
    categories: [],
    category: null,
    categorySubCategories: [],
    categorySubCategoryHeader: [{ text: 'Name', value: 'name' }],
    // tab 3
    subcategories: [],
    subCategory: null,
    subCategoryProducts: [],
    // tab 4
    units: [],
    unit: null,
    unitProducts: [],
    nonProductHeader: [
      { text: 'Name', value: 'name', width: '100%' },
      { text: '', value: 'actions', sortable: false }
    ],
    detailProductHeader: [
      { text: 'Name', value: 'name' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price', value: 'unit_price' },
      { text: 'Stock', value: 'orderNo' }
    ],
    adjustBool: false,
    adjust: null,
    subCategoryBool: false,
    subCategoryDetail: null,
    productBool: false,
    productDetail: null,
    adjustItems: ['Add Stock', 'Reduce Stock', 'Opening Stock']
  }),
  async mounted() {
    await this.getProducts()
    await this.getCategories()
    await this.getSubCategories()
    await this.getUnits()
  },
  methods: {
    async getProductTransactions() {
      this.productTransactions = await this.$axios.$get(
        'productHistory/product/' + this.product.id
      )
    },
    async getCategorySubs() {
      this.categorySubCategories = await this.$axios.$get(
        'category/' + this.category.id + '/subCategories'
      )
    },
    async getSubProducts() {
      this.subCategoryProducts = await this.$axios.$get(
        'subCategory/' + this.subCategory.id + '/products'
      )
    },
    async getUnitProducts() {
      this.unitProducts = await this.$axios.$get(
        'unit/' + this.unit.id + '/products'
      )
    },
    updateProduct(item) {
      this.product = item
      this.getProductTransactions()
    },
    updateCategory(item) {
      this.category = item
      this.getCategorySubs()
    },
    updateSubCategory(item) {
      this.subCategory = item
      this.getSubProducts()
    },
    updateUnit(item) {
      this.unit = item
      this.getUnitProducts()
    },
    async getProducts() {
      this.products = await this.$axios.$get('/product/filter/' + this.branchId)
      if (this.products.length > 0) {
        this.product = this.products[0]
        await this.getProductTransactions()
      } else {
        this.product = null
      }
    },
    async getCategories() {
      this.categories = await this.$axios.$get('/category')
      if (this.categories.length > 0) {
        this.category = this.categories[0]
        await this.getCategorySubs()
      } else {
        this.category = null
      }
    },
    async getSubCategories() {
      this.subcategories = await this.$axios.$get('/subCategory')
      if (this.subcategories.length > 0) {
        this.subCategory = this.subcategories[0]
        await this.getSubProducts()
      } else {
        this.subCategory = null
      }
    },
    async getUnits() {
      this.units = await this.$axios.$get('/unit')
      if (this.units.length > 0) {
        this.unit = this.units[0]
        await this.getUnitProducts()
      } else {
        this.unit = null
      }
    },
    openAdjust(item) {
      if (item.action_type < 3) {
        this.adjustBool = true
        this.adjust = item
      }
    },
    openSub(item) {
      this.subCategoryBool = true
      this.subCategoryDetail = item
    },
    openProduct(item) {
      this.productBool = true
      this.productDetail = item
    },
    updateProducts() {
      this.getProducts()
    },
    updateCategories() {
      this.getCategories()
    },
    updateSubCategories() {
      this.getSubCategories()
    },
    updateUnits() {
      this.getUnits()
    },
    getType(item) {
      switch (item) {
        case 0:
          return 'Add Stock'
        case 1:
          return 'Reduce Stock'
        case 2:
          return 'Opening Stock'
      }
    },
    async filterProducts(item) {
      this.branchId = item
      await this.getProducts()
    }
  }
}
</script>

<style scoped>
.product-main {
  display: grid;
  grid-template-columns: calc(25% - 5px) calc(75% - 5px);
  grid-column-gap: 10px;
  padding: 10px;
}
.textfieldStyle {
  margin: 20px;
}
.textfieldStyleSmall {
  width: 50%;
}
</style>
