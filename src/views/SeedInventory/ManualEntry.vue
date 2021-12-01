<template>
  <div class="container">
     <h1 class="title-font">Manual Entry</h1>
    <b-form class="details-font">
      <p class="staff" style="margin-top: 30px;">Staff</p>
      <p class="staff-details">Name: {{ scan.staffName }}</p>
      <p class="staff-details">E-mail: {{ scan.staffEmail }}</p>

    <b-row class="mb-3 itemBg">

      <b-col cols="6" style="display: inline">
        
      <b-form-group class="entry-details" label="Action*">
      <b-form-select
      class="col-lg-6 drop-style"
      style="border-radius: 20px; padding-left: 15px; width: 300px;"
        v-model="scan.action"
        :options="actionOpt" size="md"
      ></b-form-select>
       <!-- <p v-if="$v.scan.action.$error" style="color:red">
          Scan status required.
        </p> -->
      
      </b-form-group>
      </b-col>

    <b-col cols="6" style="display: inline">
      <b-form-group class="entry-details" label="Location*" >
      <b-form-select class="col-lg-6" 
      style="border-radius: 20px; padding-left: 15px; width: 300px;"
      :options="locationOpts" v-model="scan.scanLocation" size="md"></b-form-select>
      <!-- <p v-if="$v.scan.location.$error" style="color:red">
          Scan location required.
        </p> -->
      </b-form-group>
    </b-col>
    </b-row>

    <b-card class="entry-card">
      <b-row v-for="(item,index) in scan.scanList" v-bind:key="item.index">
       
         <b-col cols="6" style="margin-top: 15px;">
           <p>
           Entry {{index}}
           </p>
         </b-col>
         <b-col cols="6" style="text-align: right; margin-top: 15px; padding-right: 25px;">
            <b-icon class="delete" variant=danger icon="trash-fill" @click.prevent="removeRow(index)"></b-icon>
          </b-col>

    <b-row>
        <b-col cols="3" style="display: inline;">
        <b-form-group class="card-details" label="Brand" >
      <b-form-select 
      style="border-radius: 20px; padding-left: 15px;"
      :options="seedOpt" v-model="item.seedId" size="md"></b-form-select>
      </b-form-group>
        </b-col>

        <b-col cols="3" style="display: inline">
      <b-form-group class="card-details" label="Seed" >
      <b-form-select 
      style="border-radius: 20px; padding-left: 15px;"
      :options="cultivarOpt" v-model="item.cultivarId" size="md"></b-form-select>
      </b-form-group>
        </b-col>
    <!-- </b-row>

    <b-row> -->
        
      <b-col cols="3" style="display: inline">
      <b-form-group class="card-details" label="Quantity" >
      <b-form-input 
      style="border-radius: 20px; padding-left: 15px;"
      type="number" v-model="item.quantity" min="1" size="md"></b-form-input>
      </b-form-group>
        </b-col>

        <b-col cols="3" style="display: inline">
      <b-form-group class="card-details" label="Expiry Year" >
      <b-form-input
      style="border-radius: 20px; padding-left: 15px;"
      type="number" v-model="item.expiry" min="2020" size="md"></b-form-input>
      </b-form-group>

        </b-col>
      
    </b-row>

      </b-row>

      <b-row>
          <b-col cols=12 style="text-align: center; margin-top: 15px;">
          <b-btn class="add-btn" style="padding-top: 4px;" @click="addRow" variant="warning" size="md">+</b-btn>
          </b-col>
        </b-row>
      </b-card>
     
    </b-form>

    <div style="text-align: center; margin-top: 40px;">
      <b-btn class="xs btn-success mt-2 button-scan" @click.prevent="submitScanList">SUBMIT</b-btn> 
      </div>

  </div>
</template>

<script>
import axios from 'axios';
// import VueLodash from 'vue-lodash'
// import lodash from 'lodash';
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {

      locationOpts: [

      ],

      actionOpt: [

      ],

      cultivarOpt: [

      ],

      seedOpt: [

      ],

      scan: {
        scanLocation:'',
        action:'',
        staffEmail: localStorage.email,
        staffName: localStorage.email,

        scanList: [
          {
          // seedId: '',
          // cultivarId: '',
          // expiry: '',
          // quantity: '',
          // {seedId: "5f79ae1c51a17d14ed4ebf09", quantity: 10}, 
          // {seedId:"5f79ae1c51a17d14ed4ebf0a", quantity:20}
          }
        ],
      },
    }
    },

validations: {
    scan: {
      scanLocation: { required },
      action: { required },    
    }
   },

 methods: {
    async callAPI() {
        await this.retrieveLocation()
        await this.retrieveAction()
        await this.retrieveCultivar()
        await this.retrieveSeed()
    },

    async submitScanList() {
      this.$v.scan.$touch();

      if (this.$v.scan.$error) return;
      const x= await axios.post(`${process.env.VUE_APP_ROOT_API}/scan/create/`, this.scan)
      try{
        console.log(x.data.msg)
         this.$router.push(
          {name:'NewScanEntry',
          params: {id:x.data.newScanRecord._id, msg: x.data.msg, 
           }
          })
      }
      
      catch(err){
        console.log(err.message, x)
      }
    },

    async retrieveLocation() {
    const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/location/getAll`)
      try {
          
        let tempArr = x.data
        for (var i in tempArr) {
          let location = tempArr[i].location
          let id = tempArr[i].id
          this.locationOpts.push({ value: id, text: location })
        }

      } catch (err) {
        console.log(err.message)
      }
    },

    async retrieveAction() {
    const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/action/getAll`)
      try {
          
        let tempArr = x.data
        this.actionOpt.push({ value: "", text: "Please select your action." })
        for (var i in tempArr) {
          let action = tempArr[i].action
          let id = tempArr[i].id
          this.actionOpt.push({ value: id, text: action })
        }

      } catch (err) {
        console.log(err.message)
      }
    },

    async retrieveCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivar/get`)
      try {
        let tempArr = x.data
        for (var i in tempArr) {
          var name = tempArr[i].name
          var id = tempArr[i].id
          this.cultivarOpt.push({ value: id, text: name })
        }
      } catch (err) {
        console.log(err.message)
      }
    },

    async retrieveSeed() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed/getAll`
      )
      try {
        let tempArr = x.data
        for (let i in tempArr) {
          for (let j in this.cultivarOpt) {
            if (tempArr[i].cultivarId == this.cultivarOpt[j].value) {
              tempArr[i].displayCultivar = this.cultivarOpt[j].text
            }
          }
        }

        //bind cultivar
        this.seedOpt.push({value:'',text:'Please select a seed from list.'})
        for (let a in tempArr) {
          let displayText =`${tempArr[a].brand}`
          let submitId = tempArr[a].seedId
          this.seedOpt.push({ value: submitId, text: displayText })
        }

      } catch (err) {
        console.log(err.message)
      }
    },
        // this.seedOpt.push({value:'',text:'Please select a seed from list.'})
        // let uniqBrandArr = _.uniqBy(tempArr,'brand')
        // console.log(uniqBrandArr)
        // for (let a in uniqBrandArr) {
          
        //   let displayBrand = uniqBrandArr[a]
          
        //   this.seedOpt.push({ value: a, text: displayBrand })
        //   console.log(this.seedOpt)
        // }

    //   } catch (err) {
    //     console.log(err.message)
    //   }
    // },

  addRow() {
      this.scan.scanList.push({
        seedId: '',
        cultivarId: '',
        expiry: '',
        quantity: '',
      })
      console.log(this.scan.scanList)
  },
    
    removeRow(index) {
      this.scan.scanList.splice(index, 1)
    },

 },
 
    mounted() {
            this.callAPI()
        },

}
</script>

<style>
.entry-details {
  font-family: Nunito, sans-serif;
  font-size: 14px;
  letter-spacing: 1px;
  color: gray;
}

.entry-card {
    padding-left: 15px;
    padding-right: 5px;
    margin-top: 30px;
    margin-bottom: 30px;
    border-color: transparent!important;
  border-radius: 10px!important;
  box-shadow: 0.01px 1.5px 12px rgb(0,0,0,0.12)!important;
}

.entry-title {
  font-family: Nunito, sans-serif;
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 600;
  color: gray;
  margin-top: 10px;
}

.card-details {
    margin-top: 0px;
    margin-bottom: 0px;
    color: gray;
    letter-spacing: 1px;
    padding-left: 15px;
}

/* .card-details2 {
    margin-top: 5px;
    margin-bottom: 70px;
    color: gray;
    letter-spacing: 1px;
    padding-left: 15px;
} */

.add-btn {
  border-radius: 40px!important;
  font-size: 20px!important;
  width: 125px;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>