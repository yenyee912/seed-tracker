<template>
  <b-container v-if="busy==false">
    <h4 class="mt-4 mb-3">Add New Seed  
      <b-btn class="btn-info m-2" to="/seed/list" type="submit">Seed List</b-btn>
  </h4>
<b-alert dismissible variant="danger" :show="insertFailAlert!=''">{{insertFailAlert}}</b-alert>
    <hr />
    
    <!-- <seedForm /> -->
    <h5>Seed Details</h5>
    <br />
    <b-form class="col-xs-12 col-lg-8 col-md-12">
      <b-form-group label="*Brand" label-cols-lg="3" label-for="brand">
        <b-form-input
          type="text"
          id="brand"
          placeholder="Seed Brand"
          v-model="brandName"
        />
        <p v-if="$v.seed.brand.$error" class="error">
          Seed brand required.
        </p>
      </b-form-group>

      <b-form-group
        label="*Scientific Name"
        label-cols-lg="3"
        label-for="scientificName"
      >
        <b-form-input
          type="text"
          id="scientificName"
          placeholder="Plant Scientific Name"
          v-model="sciName"
        />
        <p v-if="$v.seed.scientificName.$error" class="error">
          Scientific name is required. Enter at least one character.
        </p>
      </b-form-group>

      <b-form-group label="*Cultivar" label-cols-lg="3" label-for="cultivar">
        <b-form-select
          id="cultivar"
          :options="cultivarOptions"
          v-model="seed.cultivarId"
        />
        <p v-if="$v.seed.cultivarId.$error" class="error">
          Please select a cultivar.
        </p>
      </b-form-group>

      <b-form-group
        label="*Quantity per packet (est)"
        label-cols-lg="3"
        label-for="quantity"
        description="Quantity of seed in a single packet (at least 1 pcs)."
      >
        <b-form-input
          type="number"
          class="col-3"
          inline
          id="quantity"
          step="1"
          min="1"
          v-model="seed.quantity"
        ></b-form-input>
        <p v-if="!$v.seed.quantity.required" class="error">
          Seed quantity is required.
        </p>
        <p v-if="!$v.seed.quantity.minQuantity" class="error">
          At least 1 pcs.
        </p>
      </b-form-group>

      <b-form-group
        label-cols-lg="3"
        label-for="description"
        label="Description"
        description
      >
        <b-form-textarea
          type="text"
          rows="3"
          max-rows="3"
          id="brand"
          placeholder="Seed Description (250 characters)"
          v-model="seed.description"
        />
        <p v-if="!$v.seed.description.maxLength" class="error">
          Characters limit: 250.
        </p>
      </b-form-group>

       <b-form-group label="URL" label-cols-lg="3" 
       label-for="url"
       description="Link to purchase seed."
      >
        <b-form-input
          type="text"
          id="url"
          placeholder="example: https://www.wellgrow.com"
          v-model="seed.url"
        />
      </b-form-group>

      <hr />
      <div v-b-toggle.collapse-1>
      <h5 >      
        <b-icon icon="chevron-double-down"></b-icon>    
        Seed Packaging Details</h5>
      <p>Add seed packaging information.</p></div>
      <b-collapse id="collapse-1" class="mt-2">
        <b-form-group
          label-cols-lg="3"
          label-for="height"
          label="Packaging Height (cm)"
        >
          <b-form-input
            class="col-3"
            type="number"
            step="0.01"
            min="0"
            id="height"
            v-model="seed.height"
          />
          <p v-if="!$v.seed.height.minHeight" class="error">
            Please enter a positive value.
          </p>
        </b-form-group>

        <b-form-group
          label-cols-lg="3"
          label-for="width"
          label="Packaging Width (cm)"
        >
          <b-form-input
            class="col-3"
            type="number"
            step="0.01"
            min="0"
            id="width"
            v-model="seed.width"
          />
          <p v-if="!$v.seed.width.minWidth" class="error">
            Please enter a positive value.
          </p>
        </b-form-group>

        <b-form-group
          label="Seed Packaging Image"
          label-cols-lg="3"
          label-for="width"
        >
          <b-form-file
            id="file"
            name="file"
            @change="check"
            accept=".jpg, .png, .gif, .jpeg, .webp"
            placeholder="JPEG, JPG, GIF, PNG or WEBP file only."
            v-model="seed.imageFile"
          />
            <template v-if="previewImage" > 
              <b-img class="image-seed mt-2" :src="previewImage"/><br>
              <b-btn class="xs btn-danger mt-2" @click="deleteImage"
                type="submit">X</b-btn>
            </template> 
        </b-form-group>
        </b-collapse>
      <b-btn @click.prevent="submitEntry" class="btn btn-success"
        >Submit</b-btn
      >
    </b-form>
  </b-container >
</template>

<script>
import { required, minValue, maxLength } from "vuelidate/lib/validators";
import axios from "axios";
// import seedForm from "../../components/SeedForm.vue";

export default {
  // components:{
  //   seedForm
  // },
  data() {
    return {
      busy:true,
      cultivarOptions: [],
      toggle: 0,
      prefix: '',
      insertFailAlert:'',

      //**seed parameters needed to be identical with db name
      seed: {
        brand: '',
        scientificName: '',
        cultivarId: 0,
        quantity: 1,
        description: '',
        height: 0,
        width: 0,
        imageFile: [],
        url:'',
        createdBy: localStorage.email
      },

      previewImage: "",
    };
  },

  validations: {
    seed: {
      scientificName: { required },
      brand: { required },
      cultivarId: { required },
      quantity: { required, minQuantity: minValue(1) },
      //------optional--------
      description: { maxLength: maxLength(250) },
      height: { minHeight: minValue(0) },
      width: { minWidth: minValue(0) }
    }
  },

  methods: {
    deleteImage() {
      // for display only
      this.previewImage = "";
      this.seed.imageFile = [];
    },

    async callAPI(){
      this.busy=true
      await this.getCultivar()
      this.busy=false
    },

    async getCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`);

      try {
        if(x.data.data.length>0){
          x.data.data.splice(0, 1, {id: 0, name: `Please select a cultivar.`})
          let cultivars= x.data.data
          cultivars.forEach(el => {
            this.cultivarOptions.push({ value: el.id, text: el.name });
            
          });
        }

      } catch (err) {
        console.log(err.message);
      }
    },

    async submitEntry() {
      this.$v.seed.$touch();

      if (this.$v.seed.$error) return; //no error
      const formData = new FormData();
      formData.append("scientificName", this.seed.scientificName);
      formData.append("brand", this.seed.brand);
      formData.append("cultivarId", this.seed.cultivarId);
      formData.append("quantity", this.seed.quantity);
      formData.append("description", this.seed.description);
      formData.append("url", this.seed.url);

      formData.append("width", this.seed.width);
      formData.append("height", this.seed.height);
      formData.append("image", this.seed.imageFile);
      formData.append("createdBy", this.seed.createdBy);


      const x = await axios.post(`${process.env.VUE_APP_ROOT_API}/seeds`,formData);
      try {
        // console.log(x.data)
           if (x.data.data){
            this.$router.push({
                name:'NewSeedEntry',
                params: {id:x.data.data.seedId,msg: x.data.msg }
              })
          }

          else{
            this.insertFailAlert=x.data.msg
          }
      } 
      
      catch (err) {
        console.log(err.message)
        this.insertFailAlert = "Seed details not inserted. Please try again.";
        //this is msg when db/API is not working
      }
    },

    check(e) {
      const file = e.target.files[0];
      this.previewImage = URL.createObjectURL(file);
    }
  },

   computed:{
    sciName:{
      get () {
         return this.seed.scientificName;
      },
      set (value) {
        var splitStr = value.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
        this.seed.scientificName = splitStr.join(' '); 
       }
    },

    brandName:{
      get () {
         return this.seed.brand; 
      },
      set (value) {
         this.seed.brand = value.toUpperCase(); 
       }
    },

  },

  mounted() {
    this.prefix=`${process.env.VUE_APP_API_URL}`
    this.callAPI();
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
