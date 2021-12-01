<template>
  <b-container v-if="this.$store.state.user.roles[0] == 'user'">
    <h1 class="mb-3 mt-4">Cultivar List</h1>
    <b-form-group label="Filter" label-cols-sm="1" content-cols-sm="3" label-align-sm="left">
      <b-form-input v-model="filter" type="search" placeholder="Search by keyword..."></b-form-input>
    </b-form-group>

    <b-table responsive hover :items="cultivars" :fields="fields" :filter="filter" :busy.sync="isBusy">
      <template v-slot:table-busy>
        <div class="text-center text-warning my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

      <template v-slot:cell(action)="row">
        <b-btn variant="warning" size="sm" disabled @click.stop="details(row.item)">Edit</b-btn>
      </template>
    </b-table>

  </b-container>

  <h4 v-else class="error m-4">No access. Please check your role.</h4>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isBusy: false,
      filter: '',      
      cultivars: [],
      errors: [],
      fields: [
        {
          key: 'id',
          sortable: true,
        },
        {
          key: 'name',
          sortable: false,
        },
        {
          key: 'shortcode',
          sortable: false,
        },
        {
          key: 'aveWeight',
          label: 'Average Weight (kg)',
          sortable: false,
        },
        {
          key: 'action',
          sortable: false,
        },
      ],

    }
  },
  created() {
    this.isBusy = true
    this.getCultivars()
  },
  methods: {
    // pass whole cultivar data
    details(cultivar) {
      this.$router.push({
        name: 'EditCultivar',
        params: { id: cultivar._id },
      })
    },

    async getCultivars() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try {
        this.cultivars = x.data.data

        this.isBusy = false
      } catch (err) {
        console.log(err.message)
      }
    },
  },
}
</script>
