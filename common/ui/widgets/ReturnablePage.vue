<template>
  <v-app class="page-background">
    <v-app-bar app dense dark elevate-on-scroll color="primary">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <slot />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'ReturnablePage',

  data: () => ({
    from: null
  }),

  methods: {
    goBack() {
      this.$router.push({
        name: this.from?.name ?? 'dashboard'
      })
    }
  },

  beforeRouteEnter(_, from, next) {
    next((vm) => {
      vm.from = from
    })
  }
}
</script>

<style scoped></style>
