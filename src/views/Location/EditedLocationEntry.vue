<template>
  <b-container>
    <h1 class="mb-3 mt-4">Location Entry</h1>
    <b-alert dismissible variant="success" :show="showAlert">
      {{feedbackMessage}}
    </b-alert>
    <b-btn class="btn-success m-2" to="/locationList" size="md" type="submit">Location List</b-btn>
    <hr />
    <h5>Location Details</h5>
    <br />
    <b-row>
      <b-col lg="3"><b>Location Name:</b></b-col>
      <b-col lg="6">{{ currentLocation.location }}</b-col> </b-row
    ><br />

    <b-row>
      <b-col lg="3"><b>Alert Subscription:</b></b-col>
      <b-col lg="6"
        >{{ currentLocation.isSubscribe ? 'Subscribed' : 'Unsubscribe' }}
      </b-col> </b-row
    ><br />

    <b-row>
      <b-col lg="3"><b>Subscription Mail:</b></b-col>
      <b-col lg="6">{{ currentLocation.subscriptionMail }} </b-col> </b-row
    ><br />

    <b-row>
      <b-col lg="3"><b>Minimum Seed Packet Quantity:</b></b-col>
      <b-col lg="6">{{ currentLocation.alert }} packets</b-col> </b-row
    ><br />
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      currentLocation: {},
      feedbackMessage: '',
      showAlert: false
    }
  },

  methods: {
    async getLocation(id) {
      // console.log(id)
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/locations/${id}`
      )

      try{
        if (x.data.data){
          this.currentLocation = x.data.data
          this.showAlert= true
        }
      }

      catch(err){
        console.log(err.message)
      }

    },
  },

  mounted() {
    this.feedbackMessage = this.$route.params.msg
    this.getLocation(this.$route.params.data.id)
  },
}
</script>

<style>
</style>