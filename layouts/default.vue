<template>
  <v-app dark>
    <!--    <v-navigation-drawer app :mini-variant="drawer" color="#000">-->
    <!--    <v-navigation-drawer v-model="drawer" expand-on-hover app color="#000">-->
    <v-navigation-drawer v-model="drawer" app color="#000">
      <v-list dense>
        <v-list-item two-line style="padding-left: 10px">
          <v-list-item-avatar>
            <img
              v-if="!$auth.user.image"
              alt="default-person"
              src="~/assets/images/ToppersPakistanLogo.png"
            />
            <img
              v-else
              style="object-fit: contain"
              alt="main-person"
              :src="
                $axios.defaults.baseURL.replace('api/', '') +
                  'images/user/' +
                  $auth.user.image
              "
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title style="color:white">{{
              $auth.user.name
            }}</v-list-item-title>
            <v-list-item-subtitle style="color:white">{{
              $auth.user.type === 'Main Admin' ? 'Admin' : 'Branch Manager'
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          to="/"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Dashboard</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-if="$auth.user.type === 'Main Admin'"
          class="drawer-menu-item"
          no-action
        >
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#ce862a">mdi-account-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Parties</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/parties/customer" style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Customers</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/parties/supplier" style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Suppliers</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/branch"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-store</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Branches</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/product"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-shopping</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Products</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group class="drawer-menu-item" no-action>
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#ce862a">mdi-clipboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Sale</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/sale/saleOrder" style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Sale Order</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/sale/paymentIn" style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Payment In</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/sale/saleReturn" style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Sale Return</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-if="$auth.user.type === 'Main Admin'"
          class="drawer-menu-item"
          no-action
        >
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#ce862a">mdi-cart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Purchase</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Purchase Order</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Payment Out</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Purchase Return</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-bell</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Manage Notification</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-if="$auth.user.type === 'Main Admin'"
          class="drawer-menu-item"
          no-action
        >
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#ce862a">mdi-file-chart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Reports</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Order Report</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group class="drawer-menu-item" no-action>
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#ce862a">mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Settings</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/settings/account" style="padding-left: 20px">
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Account</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/settings/change-password"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Change Password</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/auth/signup"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Register Admin</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
          @click="logout"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Logout</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense color="white" fixed app>
      <v-app-bar-nav-icon
        style="color: #bc282b;margin-right: 30px;text-align: center"
        @click.stop="drawer = !drawer"
      />
      <nuxt-link to="/">
        <img
          style="margin: auto 0"
          alt="main-logo"
          class="mx-2"
          src="~/assets/images/ToppersPakistanLogo.png"
          width="40px"
          height="40px"
        />
      </nuxt-link>
      <v-spacer />
      <div v-if="$auth.user.type === 'Main Admin'" style="width: 250px">
        <v-text-field
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          outlined
          hide-details
          dense
          clearable
        >
        </v-text-field>
      </div>
    </v-app-bar>
    <v-main app>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
        location.reload()
      } catch (err) {}
    }
  }
}
</script>

<style>
/*.v-icon {*/
/*  color: aliceblue;*/
/*}*/
/*.drawer {*/
/*  border: none;*/
/*}*/
.drawer-menu-item {
  color: white;
  border: none;
}
.drawer-menu-item .v-icon {
  color: white;
}
.drawer-menu-item-title {
  color: white;
}
.drawer-menu-item:hover {
  background-color: white;
}
.drawer-menu-item:hover .v-icon {
  color: #313f53;
}
.drawer-menu-item:hover .drawer-menu-item-title {
  color: #313f53;
}
.drawer-menu-item-active {
  background-color: white;
}
/*.drawer-menu-item-active .v-icon {*/
/*  color: #313f53;*/
/*}*/
.drawer-menu-item-active .drawer-menu-item-title {
  color: #313f53;
}
</style>
