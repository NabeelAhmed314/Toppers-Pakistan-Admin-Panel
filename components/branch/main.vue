<template>
  <div>
    <div class="product-main">
      <div>
        <BranchList
          :data="branches"
          :data-columns="branchHeader"
          create-route="/branch/add"
          update-route="/branch/edit/$id"
          delete-route="/branch/delete/$id"
          @branchChange="updateBranch"
          @update="getBranches"
        />
      </div>
      <div>
        <BranchDetail
          :branch="branch"
          detail-title="Managers"
          :data="branchManagers"
          :data-columns="branchManagerHeader"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BranchList from '@/components/branch/branchlist'
import BranchDetail from '@/components/branch/branchdetail'
export default {
  name: 'Main',
  components: { BranchDetail, BranchList },
  data: () => ({
    branches: [],
    branch: null,
    branchHeader: [
      { text: 'Name', value: 'name', width: '50%' },
      {
        text: '',
        value: 'actions',
        width: '10px',
        sortable: false,
        align: 'right'
      }
    ],
    branchManagers: [],
    branchManagerHeader: [
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' }
    ]
  }),
  async mounted() {
    await this.getBranches()
    await this.getBranch()
    await this.getBranchManagers()
  },
  methods: {
    getBranch() {
      this.branch = this.branches[0]
      console.log(this.branch)
    },
    async getBranchManagers() {
      this.branchManagers = await this.$axios.$get(
        'branch/managers/' + this.branch.id
      )
    },
    updateBranch(item) {
      this.branch = item
      this.getBranchManagers()
    },
    async getBranches() {
      this.branches = await this.$axios.$get('/branch')
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
</style>
