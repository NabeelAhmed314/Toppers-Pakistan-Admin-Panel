<template>
  <div class="entity-list-main">
    <v-data-table
      :height="variant || $auth.user.type === 'Sub Admin' ? '78vh' : '68vh'"
      :headers="dataColumns"
      :items="data"
      :search="searchText"
      class="elevation-1 my-table"
      disable-pagination
      hide-default-footer
      dense
      @click:row="changeDetailItem"
    >
      <template v-slot:top>
        <v-toolbar
          v-if="variant || $auth.user.type === 'Sub Admin'"
          flat
          color="white"
        >
          <div style="width: 100%">
            <v-text-field
              v-model="searchText"
              placeholder="Search"
              aria-hidden="true"
              prepend-inner-icon="mdi-magnify"
              outlined
              hide-details
              dense
            >
            </v-text-field>
          </div>
        </v-toolbar>
        <v-toolbar
          v-if="!variant && $auth.user.type === 'Main Admin'"
          flat
          color="white"
        >
          <v-avatar
            v-if="!search"
            color="rgba(233,233,233)"
            size="40"
            aria-hidden="true"
            @click="search = !search"
            ><v-icon aria-hidden="true">mdi-magnify</v-icon></v-avatar
          >
          <v-spacer v-if="!search"></v-spacer>
          <v-btn
            v-if="!search"
            style="margin-bottom: 0 !important;"
            color="primary"
            dark
            elevation="0"
            class="mb-2"
            aria-hidden="true"
            @click="handleCreateEvent"
            ><v-icon left>mdi-plus</v-icon>New Item</v-btn
          >
          <div v-if="search" style="width: 100%">
            <v-text-field
              v-model="searchText"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              append-icon="mdi-close-circle"
              outlined
              aria-hidden="true"
              hide-details
              dense
              @click:append="closeSearch"
            >
            </v-text-field>
          </div>
        </v-toolbar>
        <v-toolbar v-if="!variant && $auth.user.type === 'Main Admin'" flat>
          <v-select
            v-model="branchId"
            outlined
            dense
            :items="branches"
            item-text="name"
            item-value="id"
            placeholder="Filter"
            aria-hidden="true"
            @change="
              (item) => {
                filterProduct(item)
              }
            "
          ></v-select>
        </v-toolbar>
      </template>
      <template v-if="!variant" v-slot:item.actions="{ item }">
        <v-icon
          v-if="$auth.user.type === 'Main Admin'"
          small
          class="mr-2"
          color="green"
          aria-hidden="true"
          @click.stop.prevent="handleUpdateEvent(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="$auth.user.type === 'Main Admin'"
          color="red"
          small
          aria-hidden="true"
          @click.stop.prevent="removeItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="showError" width="50%" style="padding: 20px">
      <v-card style="padding: 20px">
        <p style="margin: 0">Error: {{ error }}</p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ItemList',
  props: {
    createRoute: {
      type: String,
      default: null
    },
    updateRoute: {
      type: String,
      default: null
    },
    deleteRoute: {
      type: String,
      default: null
    },
    data: {
      type: Array,
      default: () => []
    },
    dataColumns: {
      type: Array,
      default: () => []
    },
    variant: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      search: false,
      searchText: '',
      error: '',
      showError: false,
      branches: [],
      branchId: '-1'
    }
  },
  mounted() {
    this.getBranches()
  },
  methods: {
    closeSearch() {
      this.search = !this.search
      this.searchText = ''
    },
    async getBranches() {
      this.branches = [
        { name: 'All', id: '-1' },
        ...(await this.$axios.$get('/branch'))
      ]
    },
    changeDetailItem(item) {
      this.$emit('itemChange', item)
    },
    handleCreateEvent() {
      this.$router.push(this.createRoute)
    },
    handleUpdateEvent(item) {
      this.$router.push(this.updateRoute.replace('$id', item.id))
    },
    async removeItem(item) {
      window.console.log(item)
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
    },
    filterProduct(item) {
      this.$emit('filterItem', item)
    }
  }
}
</script>

<style scoped>
.entity-list-main {
}
</style>
