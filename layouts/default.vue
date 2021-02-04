<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" app color="#212934">
      <v-list dense style="padding: 0">
        <v-list-item
          to="/settings/account"
          two-line
          style="padding: 0 10px;height: 64px"
        >
          <v-list-item-avatar>
            <img
              v-if="!$auth.user.image"
              alt="default-person"
              style="object-fit: cover"
              src="~/assets/images/ApnaPos.png"
            />
            <img
              v-else
              style="object-fit: cover"
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
              $auth.user.type === 'Main Admin'
                ? 'Admin'
                : $auth.user.type === 'Sub Admin'
                ? 'Sub Admin'
                : 'Branch Manager'
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider style="border-color: #191f26;" />
        <v-divider style="border-color: #e0e0e0;" />
        <v-list-item
          to="/"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#aaacb1">mdi-home</v-icon>
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
            <v-icon color="#aaacb1">mdi-play-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Carousal</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-if="
            $auth.user.type === 'Main Admin' ||
              $auth.user.type === 'Branch Manager'
          "
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
          no-action
        >
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#aaacb1">mdi-account-multiple</v-icon>
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
            <v-icon color="#aaacb1">mdi-store</v-icon>
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
            <v-icon color="#aaacb1">mdi-tag-multiple</v-icon>
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
            <v-icon color="#aaacb1">mdi-shopping</v-icon>
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
              <v-icon color="#aaacb1">mdi-clipboard</v-icon>
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
            v-if="
              $auth.user.type === 'Main Admin' ||
                $auth.user.type === 'Branch Manager'
            "
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
          v-if="
            $auth.user.type === 'Main Admin' ||
              $auth.user.type === 'Branch Manager'
          "
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
          no-action
        >
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#aaacb1">mdi-cart</v-icon>
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
          to="/expense"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#aaacb1">mdi-cash-usd</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Expenses</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-divider style="border-color: #191f26;" />
        <v-divider style="border-color: #e0e0e0;" />
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/notification"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#aaacb1">mdi-bell</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Manage Notification</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-if="
            $auth.user.type === 'Main Admin' ||
              $auth.user.type === 'Branch Manager'
          "
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
          no-action
        >
          <v-list-item slot="activator" style="padding: 0">
            <v-list-item-action>
              <v-icon color="#aaacb1">mdi-file-chart</v-icon>
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
          <v-list-item
            to="/report/dayClose"
            active-class="drawer-menu-item-active"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Day Close</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/report/monthClose"
            active-class="drawer-menu-item-active"
            style="padding-left: 20px"
          >
            <v-list-item-content>
              <v-list-item-title class="drawer-menu-item-title"
                >Month Close</v-list-item-title
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
              <v-icon color="#aaacb1">mdi-cog</v-icon>
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
        <v-divider style="border-color: #191f26;" />
        <v-divider style="border-color: #e0e0e0;" />
        <v-list-item
          v-if="$auth.user.type === 'Main Admin'"
          to="/auth/signup"
          active-class="drawer-menu-item-active"
          class="drawer-menu-item"
        >
          <v-list-item-action>
            <v-icon color="#aaacb1">mdi-account-plus</v-icon>
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
            <v-icon color="#aaacb1">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-menu-item-title"
              >Logout</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="#fff" elevation="1" fixed app>
      <v-btn
        style="color: #B5D75A;margin-right: 30px;text-align: center"
        icon
        aria-hidden="true"
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <nuxt-link to="/" style="margin-right: 30px;text-decoration: none">
        <v-icon color="#b5d75a">mdi-home</v-icon>
      </nuxt-link>
      <h3
        v-if="$auth.user.branch"
        style="text-align: center;color: #B5D75A;font-size: 32px"
      >
        Welcome to {{ $auth.user.branch.name }}
      </h3>
      <h3 v-else style="text-align: center;color: #B5D75A;font-size: 32px">
        Welcome Admin
      </h3>
      <v-spacer />
      <v-btn
        style="margin: 0 10px;color:white;"
        rounded
        color="#e35959"
        large
        primary
        to="/sale/saleOrder/add"
        ><v-icon>mdi-plus-circle</v-icon> Add Sale</v-btn
      >
      <v-btn
        style="margin: 0 10px;color:white;"
        rounded
        color="#3cb9aa"
        large
        primary
        to="/purchase/purchaseOrder/add"
        ><v-icon>mdi-plus-circle</v-icon> Add Purchase</v-btn
      >
      <a
        href="https://wa.me/923001300533"
        target="_blank"
        style="margin-right: 30px;text-align: center;text-decoration: none"
        aria-hidden="true"
      >
        <v-icon color="#b5d75a">mdi-whatsapp</v-icon>
      </a>
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
  color: #191f26;
  border: none;
}
.drawer-menu-item .v-icon {
  color: #aaacb1;
}
.drawer-menu-item-title {
  color: #aaacb1;
}
.drawer-menu-item:hover {
  background-color: #191f26;
  border-left: 1px solid red;
}
.drawer-menu-item:active {
  background-color: #191f26;
}
.drawer-menu-item:hover .v-icon {
  color: #fff !important;
}
.drawer-menu-item-active .v-icon {
  color: #fff !important;
}
.drawer-menu-item:hover .drawer-menu-item-title {
  color: #fff;
}
.drawer-menu-item-active {
  background-color: #191f26;
  border-left: 1px solid red;
}
/*.drawer-menu-item-active .v-icon {*/
/*  color: #313f53;*/
/*}*/
.drawer-menu-item-active .drawer-menu-item-title {
  color: #fff;
}
</style>
