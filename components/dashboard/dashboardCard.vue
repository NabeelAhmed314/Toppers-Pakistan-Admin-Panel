<template>
  <v-card style="padding: 5px;display: grid; grid-template-columns: 1fr">
    <div style="display: grid; grid-template-columns: 50% 50%;padding: 10px;">
      <p style="font-weight: 400">{{ title }}</p>
      <v-select
        v-if="hasFilter"
        v-model="item"
        dense
        hide-details
        :items="items"
        @change="filter"
      ></v-select>
    </div>
    <div @click.prevent.stop="goto">
      <p :style="style">Rs {{ data }}</p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      default: 'Title Here'
    },
    value: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      default: null
    },
    endpoint: {
      type: String,
      default: ''
    },
    redColor: {
      type: Boolean,
      default: false
    },
    hasFilter: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    item: 'All',
    items: ['All', 'This Month', 'Last Month', 'This Quarter', 'This Year'],
    data: null
  }),
  computed: {
    style() {
      return {
        color: this.redColor ? '#e35959' : '#3cb9aa',
        'text-align': 'center',
        margin: '40px 0',
        'font-size': '19px',
        'font-weight': '700'
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.data = this.value
    },
    goto() {
      if (this.to) {
        this.$router.push(this.to)
      }
    },
    async filter() {
      let id = 0
      if (this.item === 'All') {
        id = 0
      } else if (this.item === 'This Month') {
        id = 1
      } else if (this.item === 'Last Month') {
        id = 2
      } else if (this.item === 'This Quarter') {
        id = 3
      } else if (this.item === 'This Year') {
        id = 4
      }
      console.log(id)
      let data
      if (this.$auth.user.type === 'Main Admin') {
        data = await this.$axios.$get(this.endpoint + '/' + id + '/-1')
      } else {
        data = await this.$axios.$get(
          this.endpoint + '/' + id + '/' + this.$auth.user.branch_id
        )
      }
      this.data = data
    }
  }
}
</script>

<style scoped>
.main-div-dashboard {
  position: absolute;
}
</style>
