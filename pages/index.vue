<template>
  <dashboard-main :dashboard="dashboard" />
</template>

<script>
import DashboardMain from '@/components/dashboard/main'
export default {
  components: { DashboardMain },
  async asyncData({ $axios, route, $auth }) {
    let dashboard = null
    if ($auth.user.type === 'Main Admin') {
      dashboard = await $axios.$get('dashboard/0')
      console.log(dashboard)
    } else {
      dashboard = await $axios.$get('dashboard/' + $auth.user.branch_id)
    }
    return {
      dashboard
    }
  }
}
</script>
