<template>
  <b-container v-if="this.$store.state.user.roles[0]=='user'">

  </b-container>
  
  <h4 v-else class="error m-4">No access. Please check your role.</h4>

</template>

<script>
export default {

}
</script>

<style>

</style>