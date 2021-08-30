<template>
  <b-container v-if="!isBusy">
      <div class="error-message" v-if="showError">
        <b-alert show variant="warning">{{ errorMessage }}</b-alert>
      </div>
      <div class="error-message-nodata" v-if="buttonState">
        <b-alert show variant="success">{{ successMsg }}</b-alert>
      </div>
      <h2>Edit Order</h2>
      <div>
        <b-form class="m-3" v-if="order.booking">
          <b-form-group id="do" :label-cols="2" label="DO:">
            <p class="m-2">{{ order.DO }}</p>
          </b-form-group>

          <b-form-group id="orderDate" :label-cols="2" label="Order Date:">
            <p class="m-2">{{ order.orderDate }}</p>
          </b-form-group>

          <b-form-group
            id="deliveryDate"
            :label-cols="2"
            label="Delivery Date:"
          >
            <p class="m-2">{{ order.booking[0].deliveryDate }}</p>
          </b-form-group>

          <b-form-group id="remarks" :label-cols="2" label="Remarks:">
            <p class="m-2">{{ order.remarks }}</p>
          </b-form-group>

          <b-table
            striped
            hover
            fixed
            :items="order.booking[0].itemOrdered"
            :fields="column"
            class="text-center"
          >
            <template v-slot:cell(action)="row">
              <b-form-input type="number" step="0.1" min="0" v-model="row.item.actualWeight"></b-form-input>
            </template>
          </b-table>
        </b-form>
        <div class="button">
          <b-btn size="sm" @click.stop="confirmWeight()" variant="success" class="mr-3"
            >Confirm</b-btn>
          <b-overlay
            :show="busy"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="warning"
            class="d-inline-block"
          >
            <b-btn
              v-if="buttonState"
              size="sm"
              variant="warning"
              @click.stop="generateDO()"
              >Generate DO</b-btn
            >
          </b-overlay>
        </div>
      </div>
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      column: [
        { key: 'name', label: 'Items' },
        { key: 'bookingWeight', label: 'Booking Weight (kg)' },
        { key: 'action', label: 'Actual Weight (kg)' }
      ],
      order: {},
      buttonState: false,
      successMsg: '',
      showError: false,
      errorMessage: 'Error',
      isBusy: true
    }
  },

  methods: {
    async getOrder(orderId) {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/order/get/id/${orderId}`)
      try {
        if(x.data._id){
          this.order = x.data
          this.isBusy=false
        }

      } 
      
      catch (err) {
        console.log(err.message)
      }
    },

    async confirmWeight() {
      const x= await axios.put(`${process.env.VUE_APP_ROOT_API}/order/update/${this.$route.params.id}`,this.order)
        try{
          this.buttonState = true
          this.successMsg = x.data.message
          console.log(x.data.message)
        }
        catch(err){
          this.showError = true
          console.log(err.message)
        }
    },

    generateDO() {
      this.busy = true
      axios({
        url:
          `${process.env.VUE_APP_ROOT_API}/order/create/DO/` +
          this.$route.params.id,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.busy = false
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'DO.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },

  mounted() {
    //get the order using id
    this.getOrder(this.$route.params.id)
  }
}
</script>
>

<style scoped>
.no-margin {
  margin-left: 0px;
  margin-right: 0px;
}

.button {
  text-align: center;
  margin: auto;
}

</style>
