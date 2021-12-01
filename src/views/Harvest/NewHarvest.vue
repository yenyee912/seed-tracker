<template>
  <div class="content container">
    <h1 class="mb-3 mt-4">Transplant Form</h1>
    <div class="container-fluid">
      <!-- {{harvest}} -->
      <b-row class="mb-3">
        <b-col cols="12" md="auto">
          <b-form-group label="Farm Location">
            <b-form-radio v-model="harvest.location" value="langkawi"
              >Langkawi</b-form-radio
            >
            <b-form-radio v-model="harvest.location" value="melawati"
              >Melawati</b-form-radio
            >
          </b-form-group>
        </b-col>
        <b-col cols="12" md="auto">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Rack No"
          >
            <b-form-select
              v-if="harvest.location == 'langkawi'"
              v-model="harvest.rackNo"
              :options="rackNoLangkawi"
            ></b-form-select>
            <b-form-select
              v-if="harvest.location == 'melawati'"
              v-model="harvest.rackNo"
              :options="rackNoMelawati"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="auto">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Tier No"
          >
            <b-form-select
              v-if="harvest.location == 'langkawi'"
              v-model="harvest.tier"
              :options="tierNoLangkawi"
            ></b-form-select>
            <b-form-select
              v-if="harvest.location == 'melawati'"
              v-model="harvest.tier"
              :options="tierNoMelawati"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="auto"></b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12" md="auto">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Germination Date"
          >
            <b-form-spinbutton
              id="sb-inline"
              v-model="germinationDay"
              inline
            ></b-form-spinbutton>
            <p>{{ germinationDatefunc }}</p>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="auto">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Transplant Date"
          >
            <b-form-datepicker
              placeholder="Transplant Date"
              v-model="tDate"
              local="en"
              required
            ></b-form-datepicker>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="auto">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Harvest Date"
          >
            <b-form-spinbutton
              id="sb-inline"
              v-model="harvestDay"
              inline
            ></b-form-spinbutton>
            <p>{{ harvestDatefunc }}</p>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-form-group id="fieldsetHorizontal" horizontal breakpoint="md">
          <h2>Cultivar</h2>
          <b-row
            v-for="(item, index) in harvest.cultivar"
            v-bind:key="item.index"
          >
            <b-col>
              <b-form-select
                v-model="item.id"
                v-bind:name="item.name"
                :options="cultivarOptions"
              ></b-form-select>
            </b-col>
            <b-col cols="auto">
              <!-- <b-form-spinbutton id="sb-inline" v-model="item.quantity" inline required></b-form-spinbutton> -->
              <b-form-select
                v-model="item.quantity"
                :options="generateArrayfunc"
              ></b-form-select>
            </b-col>
            <b-col cols="auto">
              <p>
                <b-btn @click="removeRow(index)" variant="danger"
                  >X</b-btn
                >
              </p>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col cols="12" md="auto">
              <p>
                <b-btn @click="addRow" variant="outline-warning">+</b-btn>
              </p>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col cols="12" md="auto">
              <b-form-checkbox
                id="checkbox-1"
                v-model="harvest.experiment"
                name="checkbox-1"
                value="1"
                unchecked-value="0"
                >Experiment (Not For Sale)</b-form-checkbox
              >
            </b-col>
          </b-row>
        </b-form-group>
      </b-row>
      <b-row class="mb-3">
        <h3>Total :{{ calcQuantity }}</h3>
      </b-row>
      <b-row
        class="mb-3"
        v-if="
          (harvest.location == 'langkawi' && calcQuantity == 40) ||
            (harvest.location == 'melawati' &&
              (harvest.rackNo == 5 || harvest.rackNo == 6) &&
              calcQuantity == 32) ||
            (harvest.location == 'melawati' &&
              !(harvest.rackNo == 5 || harvest.rackNo == 6) &&
              calcQuantity == 48)
        "
      >
        <form @submit.prevent="onSubmit">
          <b-btn @click="onSubmit" variant="warning">Submit</b-btn>
        </form>
      </b-row>
      <b-row
        class="mb-3"
        v-else-if="harvest.location == 'langkawi' && calcQuantity != 40"
      >
        <h3>
          <p>Warning: Total cultivar not equal to 40</p>
        </h3>
      </b-row>
      <b-row
        class="mb-3"
        v-else-if="
          harvest.location == 'melawati' &&
            (harvest.rackNo == 5 || harvest.rackNo == 6) &&
            calcQuantity != 32
        "
      >
        <h3>
          <p>Warning: Total cultivar not equal to 32</p>
        </h3>
      </b-row>
      <b-row
        class="mb-3"
        v-else-if="
          harvest.location == 'melawati' &&
            !(harvest.rackNo == 5 || harvest.rackNo == 6) &&
            calcQuantity != 48
        "
      >
        <h3>
          <p>Warning: Total cultivar not equal to 48</p>
        </h3>
      </b-row>
      <b-row class="mb-3">
        <div class="text-center" variant="danger">
          <b-alert
            v-for="(error, index) in errors"
            :key="index"
            :show="dismissCountDown"
            fade
            variant="danger"
            dismissible
            >{{ error.msg }}</b-alert
          >
        </div>
        {{ success }}
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'NewHarvest',
  data() {
    return {
      dismissCountDown: 5,
      success: '',
      errors: [],
      harvest: {
        lastEdited: '',
        editedBy: this.$store.state.user.name,
        name: '',
        location: 'langkawi',
        harvest: 1,
        rackNo: 1,
        tier: 1,
        experiment: 0,
        transplantDate: '',
        germinationDate: '',
        harvestDate: '',
        cultivar: [
          {
            id: 0,
            name: '',
            quantity: 0,
            nonSaleable: 0
          }
        ]
      },
      name: [
        0,
        'rack1',
        'rack2',
        'rack3',
        'rack4',
        'rack5',
        'rack6',
        'rack7',
        'rack8',
        'rack9',
        'rack10',
        'rack11',
        'rack12',
        'rack13',
        'rack14',
        'rack15'
      ],
      rackNoLangkawi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      tierNoLangkawi: [1, 2, 3, 4, 5, 6],
      rackNoMelawati: [1, 2, 3, 4, 5, 6],
      tierNoMelawati: [1, 2, 3, 4, 5],
      quantity: [],
      germinationDay: 14,
      harvestDay: 21,
      tDate: '',
      cultivarOptions: []
    }
  },
  computed: {
    germinationDatefunc: function() {
      var day = moment(this.tDate)
        .subtract(this.germinationDay, 'day')
        .format('MM-DD-YYYY')
      return day
    },
    harvestDatefunc: function() {
      var day = moment(this.tDate)
        .add(this.harvestDay, 'day')
        .format('MM-DD-YYYY')
      return day
    },
    generateArrayfunc: function() {
      var quantity = []
      var i
      for (i = 1; i <= 40; i++) {
        quantity.push(i)
      }
      return quantity
    },

    calcQuantity: function() {
      var i,
        total = 0
      for (i in this.harvest.cultivar) {
        total += this.harvest.cultivar[i].quantity
      }
      return total
    }
  },
  methods: {
    async getAllCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try {
        x.data.data.splice(0, 1, { id: 0, name: 'Please select a cultivar.' })
        x.data.data.forEach(element => {
          this.cultivarOptions.push({ value: element.id, text: element.name })
        })
      } catch (err) {
        this.errors.push(err.message)
      }
    },

    showAlert() {
      this.dismissCountDown = 5
    },
    convertDateFormat(date) {
      return moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD')
    },
    addRow() {
      this.harvest.cultivar.push({
        id: '',
        name: '',
        quantity: 0,
        nonSaleable: 0
      })
    },
    removeRow(index) {
      this.harvest.cultivar.splice(index, 1)
    },

    convertDateFormatToYMD(date) {
      return moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY')
    },

    onSubmit() {
      if (this.harvest.location == '') {
        this.errors.push({
          msg: 'Please key in location.'
        })
      } else if (this.tDate == '' || this.tDate == null) {
        this.errors.push({
          msg: 'Please key in transplant date.'
        })
      } else if (
        this.harvest.cultivar.length == 0 ||
        this.harvest.cultivar[0].id == '' ||
        this.harvest.cultivar[0].id == 0 ||
        this.harvest.cultivar[0].quantity == 0
      ) {
        this.errors.push({
          msg: 'Please key in cultivar and quantity.'
        })
      } else {
        var gDate = moment(this.tDate)
          .subtract(this.germinationDay, 'day')
          .format('MM-DD-YYYY')
        this.harvest.germinationDate = gDate
        var hDate = moment(this.tDate)
          .add(this.harvestDay, 'day')
          .format('MM-DD-YYYY')
        this.harvest.harvestDate = hDate
        this.harvest.transplantDate = this.convertDateFormatToYMD(this.tDate)
        var item, i, x
        for (item in this.harvest.cultivar) {
          for (i in this.cultivarOptions) {
            if (
              this.harvest.cultivar[item].id == this.cultivarOptions[i].value
            ) {
              this.harvest.cultivar[item].name = this.cultivarOptions[i].text
            }
          }
        }
        for (x in this.name) {
          if (this.harvest.rackNo == x) {
            this.harvest.name = this.name[x]
          }
        }

        this.harvest.lastEdit = Date.now()
        axios
          .post(
            `${process.env.VUE_APP_ROOT_API}/harvest/transplant`,
            this.harvest
          )
          .then(response => {
            console.log(response.data)
            this.$router.push({
              name: 'NewHarvestEntry',
              params: { id: response.data.data._id, msg: response.data.msg }
            })
            // console.log(response.data)
            // console.log(this.harvest)
          })
          .catch(error => {
            if (error.response) {
              // Request made and server responded
              // console.log(error.response.data)
              // console.log(error.response.status)
              // console.log(error.response.headers)
              this.errors.push({ msg: 'error' })
            } else if (error.request) {
              // The request was made but no response was received
              // console.log(error.request)
              this.errors.push({ msg: error.request })
            } else {
              // Something happened in setting up the request that triggered an Error
              // console.log('Error', error.message)
              this.errors.push({ msg: error.message })
            }
            // this.errors.push(error)
          })
      }
    }
  },

  mounted() {
    this.getAllCultivar()
  }
}
</script>

<style>
.Chart__container {
  margin-bottom: 100px;
}
</style>
