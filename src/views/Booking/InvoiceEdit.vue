<template>
  <b-container>
      <div class="error-message" v-if="showError">
        <b-alert show variant="warning">{{ errorMessage }}</b-alert>
      </div>
      <div class="error-message-nodata" v-if="buttonState">
        <b-alert show variant="success">{{ successMsg }}</b-alert>
      </div>
      <div>
        <h2 col="6">Invoice Details</h2>
      </div>
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
                  <b-form-input
                    type="number"
                    step="0.1"
                    min="0"
                    v-model="row.item.receivedWeight"
                  ></b-form-input>
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
              @click.stop="generateInvoice()"
              >Generate Invoice</b-btn
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
        { key: 'actualWeight', label: 'Actual Weight (kg)' },
        { key: 'price' },
        { key: 'action', label: 'Received Weight (kg)' }
      ],
      order: {},
      buttonState: false,
      successMsg: '',
      showError: false,
      errorMessage: 'Error',
      busy: false
    }
  },

  methods: {
    async getOrder() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/order/get/do/${this.$route.params.id}`)
      try {
        this.order = x.data
      } 
      
      catch (err) {
        console.log(err.message)
      }
    },

    async confirmWeight() {
      this.buttonState= false
      const x= await axios.put(`${process.env.VUE_APP_ROOT_API}/order/update/DO/${this.$route.params.id}`,
          this.order)
        
      try{
        if(x.data.data){
          this.buttonState = true
          this.successMsg = x.data.message
        }   
      }
      
      catch(err) {
        this.showError = true
        console.log(err.message)
      }
    },

    generateInvoice() {
      this.busy = true
      axios({
        url:
          `${process.env.VUE_APP_ROOT_API}/order/create/invoice/` +
          this.$route.params.id,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.busy = false
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Invoice.pdf')
        console.log("fileLink", fileLink)
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },

  mounted() {
    this.getOrder()
  }
}
</script>

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
