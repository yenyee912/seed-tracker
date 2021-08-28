<template>
  <header>
    <b-navbar
      toggleable
      class="navbar navbar-expand-md navbar-dark font-weight-bold"
      style="background-color: #2bb573;"
    >
      <b-navbar-brand v-if="!loggedIn" to="/home">
        <div class="logo-image">
          <img src="../assets/logo.png" class="img-fluid" />
        </div>
      </b-navbar-brand>
      <b-navbar-brand v-if="loggedIn" to="/">
        <div class="logo-image">
          <img src="../assets/logo.png" class="img-fluid" />
        </div>
      </b-navbar-brand>
      <b-navbar-toggle target="navbar-toggle-collapse">
        <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon> </template
        >/
      </b-navbar-toggle>
      <b-collapse id="navbar-toggle-collapse" is-nav>
        <ul class="navbar-nav ml-auto">
          <b-nav-item v-if="!loggedIn" to="/home">
            Home
            <span class="sr-only">(current)</span>
          </b-nav-item>
          <b-nav-item v-if="loggedIn" to="/">
            Home
            <span class="sr-only">(current)</span>
          </b-nav-item>
          <b-nav-item v-if="!loggedIn" to="/about">About</b-nav-item>

          <b-nav-item-dropdown v-if="loggedIn" text="Seed" class="dropdown w-25" right>
            <b-dropdown-item to="/seed/list">Seed List</b-dropdown-item>
            <b-dropdown-item to="/seed/new">Add Seed</b-dropdown-item>
            <b-dropdown-item to="/seed/inventory/hq/scan">HQ Scanner</b-dropdown-item>
            <b-dropdown-item to="/seed/inventory/farm/scan">Farm Scanner</b-dropdown-item>
            <b-dropdown-item to="/seed/inventory/scan/list">Scan History</b-dropdown-item>
            <b-dropdown-item to="/seed/inventory/hq/list">HQ Seed Inventory</b-dropdown-item>
            <b-dropdown-item to="/seed/inventory/farm/list">Farm Seed Inventory</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="loggedIn" class="dropdown w-25" right>
            <template v-slot:button-content>
              <b>{{ usernameFunction }}</b>
            </template>
            <b-dropdown-item @click="logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
          
          <b-nav-item-dropdown v-if="!loggedIn" class="dropdown w-25" right text="User">
            <b-dropdown-item to="/login">Login</b-dropdown-item>
            <b-dropdown-item to="/register">Register</b-dropdown-item>
          </b-nav-item-dropdown>
        </ul>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import { authComputed } from '../store/helpers.js'
export default {
  computed: {
    ...authComputed,
    usernameFunction: function() {
      return this.$store.state.user.name
    }
  },
  methods: {
    logout() {
      console.log('logout')
      // this.$store.dispatch('logout')
      this.$store.commit('logout')
      this.$keycloak.logout({redirectUri: process.env.VUE_APP_BASE_URL})
    }
  }
}
</script>

<style>
.navbar {
  padding: 0px auto;
  margin: 0px auto;
}

.logo-image {
  width: 80px;
  height: 40px;

  overflow: hidden;
}

.navbar-nav {
  font-size: 18px;
}
</style>
