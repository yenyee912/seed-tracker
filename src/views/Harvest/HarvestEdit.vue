<template>
  <div class="container">
    <b-row>
      <b-col cols="12">
        <h1 class="mb-3 mt-4">
          Edit Harvest
          <b-btn :to="'/list'" variant="info" class="m-3">Harvest List</b-btn>
        </h1>
        <b-form @submit="onSubmit">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Name"
          >
            <!-- <b-form-select v-model.trim="harvest.name" :options="name"></b-form-select> -->
            {{ harvest.name }}
          </b-form-group>

          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Location"
          >
            <b-form-select
              v-model.trim="harvest.location"
              :options="farmLocation"
            ></b-form-select>
          </b-form-group>

          <!-- <b-form-group
          id="fieldsetHorizontal"
          horizontal
          :label-cols="4"
          breakpoint="md"
          label="Enter Harvest"
        >
          <b-form-checkbox
            v-model.trim="harvest.harvest"
            :options="[0,1]"
            value="1"
            unchecked-value="0"
          ></b-form-checkbox>
          </b-form-group>-->
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Tier No"
          >
            <b-form-select
              v-model.trim="harvest.tier"
              :options="tierNo"
            ></b-form-select>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Rack No"
          >
            <b-form-select
              v-model.trim="harvest.rackNo"
              :options="rackNo"
            ></b-form-select>
          </b-form-group>
          <!-- <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Experiment"
          >
            <b-form-checkbox
              id="checkbox-1"
              v-model="harvest.experiment"
              name="checkbox-1"
              value="0"
              unchecked-value="1"
            ></b-form-checkbox>
          </b-form-group>-->
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Germination Date"
          >
            <b-form-datepicker
              v-model.trim="gDate"
              placeholder="Germination Date"
              local="en"
            ></b-form-datepicker>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Transplant Date"
          >
            <b-form-datepicker
              v-model.trim="tDate"
              placeholder="Transplant Date"
              local="en"
            ></b-form-datepicker>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter Harvest Date"
          >
            <b-form-datepicker
              v-model.trim="hDate"
              placeholder="Harvest Date"
              local="en"
            ></b-form-datepicker>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter cultivar"
          ></b-form-group>
          <b-form-group id="fieldsetHorizontal" horizontal breakpoint="md">
            <b-row class="mb-3 title-label">
              <b-col cols="4">Cultivar</b-col>
              <b-col cols="2">Transplant Quantity</b-col>
              <b-col>Non Saleable</b-col>
            </b-row>

            <b-row
              v-for="item in harvest.cultivar"
              v-bind:key="item.id"
              class="mb-3"
            >
              <b-col cols="4">
                <b-form-select
                  v-model="item.id"
                  v-bind:name="item.name"
                  :options="cultivarOptions"
                ></b-form-select>
              </b-col>
              <b-col cols="2">
                <b-form-spinbutton v-model="item.quantity"></b-form-spinbutton>
              </b-col>
              <b-col cols="2">
                <b-form-spinbutton
                  v-model="item.nonSaleable"
                ></b-form-spinbutton>
              </b-col>
            </b-row>
          </b-form-group>

          <b-btn type="submit" variant="success">Update</b-btn>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Editharvest',
  data() {
    return {
      harvest: {
        // cultivar: []
      },
      gDate: '',
      hDate: '',
      tDate: '',
      farmLocation: [],
      rackNo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      tierNo: [1, 2, 3, 4, 5, 6],
      cultivarOptions: []
    }
  },
  created() {
    this.callAPI()
  },

  methods: {
    async callAPI() {
      await this.getCurrentHarvest()
      await this.getCultivar()
      await this.getLocation()
    },

    async getCurrentHarvest() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/harvest/transplant/${this.$route.params.id}`
      )
      try {
        this.harvest = x.data.data
        this.gDate = this.convertDateFormat(this.harvest.germinationDate)
        this.hDate = this.convertDateFormat(this.harvest.harvestDate)
        this.tDate = this.convertDateFormat(this.harvest.transplantDate)
      } catch (e) {
        this.errors.push(e)
      }
    },

    async getCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try {
        if (x.data.data.length > 0) {
          x.data.data.splice(0, 1, { id: 0, name: `Please select a cultivar.` })

          x.data.data.forEach(el => {
            this.cultivarOptions.push({ value: el.id, text: el.name })
          })
        }
      } catch (e) {
        this.errors.push(e)
      }
    },

    async getLocation() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try {
        if (x.data.data.length > 0) {
          x.data.data.splice(0, 2)
          this.farmLocation.push({ text: 'Please select a farm.', value: 0 })

          // harvest save location name
          x.data.data.forEach(el => {
            this.farmLocation.push({
              text: el.location,
              value: el.location
            })
          })
        }
      } catch (err) {
        this.errors.push(err.message)
      }
    },

    onSubmit(evt) {
      evt.preventDefault()
      this.harvest.lastEdited = Date.now()
      this.harvest.editedBy = this.$store.state.user.name
      this.harvest.germinationDate = moment(this.gDate, 'YYYY-MM-DD').format(
        'MM-DD-YYYY'
      )
      this.harvest.harvestDate = moment(this.hDate, 'YYYY-MM-DD').format(
        'MM-DD-YYYY'
      )
      this.harvest.transplantDate = moment(this.tDate, 'YYYY-MM-DD').format(
        'MM-DD-YYYY'
      )
      var item
      var i
      for (item in this.harvest.cultivar) {
        for (i in this.cultivarOptions) {
          if (this.harvest.cultivar[item].id == this.cultivarOptions[i].value) {
            this.harvest.cultivar[item].name = this.cultivarOptions[i].text
          }
        }
      }

      axios
        .put(
          `${process.env.VUE_APP_ROOT_API}/harvest/transplant/${this.$route.params.id}`,
          this.harvest
        )
        .then(() => {
          this.$router.push({
            name: 'EditedHarvestEntry',
            params: { id: this.$route.params.id }
          })
        })
        .catch(e => {
          console.log(e)
          // this.errors.push(e)
        })
    },
    convertDateFormat(date) {
      return moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD')
    },
    convertDateFormatToYMD(date) {
      return moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY')
    }
  }
}
</script>

<style scoped>
.title-label {
  font-weight: bold;
}
</style>
