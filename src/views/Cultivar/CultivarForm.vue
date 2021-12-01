<template>
  <b-container v-if="this.$store.state.user.roles[0] == 'user'">
    <div v-if="isBusy==false">
    <h1 class="mb-3 mt-4">New Cultivar</h1>
    <b-row class="mb-3">
      <b-col cols="12" md="auto"> <b>ID: </b> {{ cultivar.id }} </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col cols="12" md="auto">
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          breakpoint="md"
          label="Enter Cultivar Name"
        >
          <b-form-input v-model="cultivar.name"></b-form-input>
        </b-form-group>
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          breakpoint="md"
          label="Enter Short Code"
        >
          <b-form-input v-model="cultivar.shortcode"></b-form-input>
        </b-form-group>
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          breakpoint="md"
          label="Average weight in kg (optional)"
          description="Average weight is needed for ordering system. "
        >
          <b-form-input
            type="number"
            v-model="cultivar.aveWeight"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          breakpoint="md"
          label="Price per kg (optional)"
          description="Price is needed for ordering system. "
        >
          <b-form-input type="number" v-model="cultivar.price"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3" v-if="cultivar.shortcode != '' && cultivar.name != ''">
      <form @submit.prevent="onSubmit">
        <b-btn @click="onSubmit" variant="warning">Submit</b-btn>
      </form>
    </b-row>
    <b-row class="mb-3">
      <div class="text-center" variant="danger">
        <b-alert
          v-for="(error, index) in errors"
          :key="index"
          :show="errors.length > 0"
          fade
          variant="danger"
          dismissible
          >{{ error.msg }}</b-alert
        >
      </div>
      <b-alert
        v-if="success"
        :show="dismissCountDown"
        fade
        variant="success"
        dismissible
        >{{ success }}</b-alert
      >
    </b-row>
    </div>
  </b-container>
  <h4 v-else class="error m-4">No access. Please check your role.</h4>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NewHarvest',
  data() {
    return {
      isBusy: true,
      dismissCountDown: 5,
      success: '',
      errors: [],
      cultivar: {
        lastEdit: '',
        editBy: this.$store.state.user.name,
        name: '',
        shortcode: '',
        aveWeight: '',
        id: '',
        price: '',
      },
    }
  },
  created() {
    this.getCultivar()
  },

  methods: {
    showAlert() {
      this.dismissCountDown = 5
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_ROOT_API}/cultivars`, this.cultivar)
        .then((response) => {
          this.success = response.data.msg
          setTimeout(function () {
            location.reload()
          }, 1000)

          // this.success = this.$router.push({
          //   name: "NewHarvestEntry",
          //   params: { response }
          // })
        })
        .catch((error) => {
          if (error.response) {
            this.errors.push({
              msg: 'Unable to submit. Please contact developer.',
            })
          } else if (error.request) {
            this.errors.push({ msg: error.request })
          } else {
            this.errors.push({ msg: error.message })
          }
        })
    },
    getCultivar() {
      axios
        .get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
        .then((response) => {
          //get latest cultivar ID
          this.cultivar.id = Math.max.apply(
            Math,
            response.data.data.map(function (o) {
              return o.id
            })
          )

          this.cultivar.id += 1 //to add 1 to latest ID\
          this.isBusy= false
        })
        .catch((e) => {
          this.errors.push(e)
        })
    },
  },
}
</script>

<style></style>
