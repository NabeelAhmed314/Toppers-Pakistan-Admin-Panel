<template>
  <div class="entity-list-main">
    <v-data-table
      height="78vh"
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
        <v-toolbar flat color="white">
          <v-avatar
            v-if="!search"
            color="rgba(233,233,233)"
            size="40"
            @click="search = !search"
            ><v-icon>mdi-magnify</v-icon></v-avatar
          >
          <v-spacer v-if="!search"></v-spacer>
          <v-btn
            v-if="!search"
            style="margin-bottom: 0 !important;"
            color="primary"
            dark
            elevation="0"
            class="mb-2"
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
              hide-details
              dense
              @click:append="closeSearch"
            >
            </v-text-field>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          color="green"
          @click.stop.prevent="handleUpdateEvent(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon color="red" small @click.stop.prevent="removeItem(item)">
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
  name: 'BranchList',
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
    }
  },
  data: () => {
    return {
      search: false,
      searchText: '',
      error: '',
      showError: false
    }
  },
  methods: {
    closeSearch() {
      this.search = !this.search
      this.searchText = ''
    },
    changeDetailItem(item) {
      this.$emit('branchChange', item)
    },
    handleCreateEvent() {
      this.$router.push(this.createRoute)
    },
    handleUpdateEvent(item) {
      this.$router.push(this.updateRoute.replace('$id', item.id))
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
.entity-list-main {
}
</style>
