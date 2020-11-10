<template>
  <v-app dark>
    <!--    <v-navigation-drawer app :mini-variant="drawer" color="#000">-->
    <v-navigation-drawer v-model="drawer" expand-on-hover app color="#000">
      <!--    <v-navigation-drawer v-model="drawer" app color="#000">-->
      <v-list dense>
        <v-list-item to="/settings/account" two-line style="padding-left: 10px">
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
              width="100%"
              height="100%"
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
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/carousal"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-play-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Carousal</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-if="$auth.user.type === 'Main Admin'"
          active-class="drawer-menu-item-active"
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
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/parties/customer"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Customers</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/parties/supplier"
            style="padding-left: 20px"
          >
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
          to="/item"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-tag-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Items</v-list-item-title
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
              >Manage Shop</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
          no-action
        >
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
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/sale/saleOrder"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Sale Order</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/sale/paymentIn"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Payment In</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="$auth.user.type === 'Main Admin'"
            active-class="drawer-menu-item-active"
            to="/sale/saleReturn"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Sale Return</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-if="$auth.user.type === 'Main Admin'"
          active-class="drawer-menu-item-active"
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
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/purchase/purchaseOrder"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Purchase Order</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/purchase/paymentOut"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Payment Out</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/purchase/purchaseReturn"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Purchase Return</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/expense"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#ce862a">mdi-cash-usd</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Expenses</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/notification"
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
          active-class="drawer-menu-item-active"
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
          <v-list-item
            to="/report/sale"
            active-class="drawer-menu-item-active"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Sale Report</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/report/purchase"
            active-class="drawer-menu-item-active"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Purchase Report</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/report/profit-loss"
            active-class="drawer-menu-item-active"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Profit & Loss Report</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
          no-action
        >
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
          <v-list-item
            active-class="drawer-menu-item-active"
            to="/settings/account"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Account</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="drawer-menu-item-active"
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
      <v-btn
        style="color: #bc282b;margin-right: 30px;text-align: center"
        icon
        aria-hidden="true"
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <nuxt-link to="/" style="margin-right: 30px">
        <img
          style="margin: auto 0;max-width: 40px;max-height: 40px"
          alt="main-logo"
          class="mx-2"
          src="~/assets/images/ToppersPakistanLogo.png"
        />
      </nuxt-link>
      <h3 v-if="$auth.user.branch" style="text-align: center;color: #bc282b">
        Welcome to {{ $auth.user.branch.name }}
      </h3>
      <h3 v-else style="text-align: center;color: #bc282b">
        Welcome Admin
      </h3>
      <v-spacer />
      <div v-if="$auth.user.type === 'Main Admin'" style="width: 250px">
        <v-text-field
          aria-hidden="true"
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
        window.location.reload()
      } catch (err) {}
    }
  }
}
</script>

<style>
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
.drawer-menu-item:active {
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
