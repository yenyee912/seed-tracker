<template>
  <b-container v-if="currentSeed.verify===false">
    <h1 class="mt-4 mb-3">Update Seed
    <b-btn variant="danger" class=" m-2" @click.prevent="deleteSeed" type="submit">Delete Entry</b-btn>
    </h1>
    <hr />
    <h5>Seed Details</h5>
    <br />
    <b-img v-if="currentSeed.imageName" class="image-seed mb-2" :src="prefix+currentSeed.imageName"/><br>

    <b-form class="col-xs-12 col-lg-8 col-md-12">
      <b-form-group label="Seed ID" label-cols-lg="3" label-for="brand">
        <b-form-input
          type="text"
          id="brand"
          readonly
          v-model="currentSeed.seedId"
        />
      </b-form-group>

      <b-form-group label="*Brand" label-cols-lg="3" label-for="brand">
        <b-form-input
          type="text"
          id="brand"
          placeholder="Seed Brand"
          v-model="brandName"
        />
        <p v-if="$v.currentSeed.brand.$error" class="error">
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
        <p v-if="$v.currentSeed.scientificName.$error" class="error">
          Scientific name is required. Enter at least one character.
        </p>
      </b-form-group>

      <b-form-group label="*Cultivar" label-cols-lg="3" label-for="cultivar">
        <b-form-select
          id="cultivar"
          :options="cultivarOptions"
          v-model="currentSeed.cultivarId"
        />
        <p v-if="$v.currentSeed.cultivarId.$error" class="error">
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
          class="col-sm-12 col-lg-3"
          inline
          id="quantity"
          step="1"
          min="1"
          v-model="currentSeed.quantity"
        ></b-form-input>
        <p v-if="!$v.currentSeed.quantity.minQuantity" class="error">
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
          id="description"
          placeholder="Seed Description"
          v-model="currentSeed.description"
        />
        <p v-if="!$v.currentSeed.description.maxLength" class="error">
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
          v-model="currentSeed.url"
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
            v-model="currentSeed.height"
          />
          <p v-if="!$v.currentSeed.height.minHeight" class="error">
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
            v-model="currentSeed.width"
          />
          <p v-if="!$v.currentSeed.width.minWidth" class="error">
            Please enter a positive value.
          </p>
        </b-form-group>

      <b-form-group label-cols-lg="3" label-for="file" label="Packaging Image">
        <b-form-file
          id="file"
          name="file"
          @change="check"
          accept=".jpg, .png, .gif, .jpeg, .webp"
          placeholder="JPEG, JPG, GIF, PNG or WEBP file only."
          v-model="newImage"
        />
        <template v-if="previewImage"> 
          <b-img class="image-seed mt-2" :src="previewImage" /><br>
          <b-btn class="xs btn-danger mt-2" @click.prevent="deletePreviewImage" type="submit">X</b-btn>
        </template>

      </b-form-group>
      </b-collapse>
      <div class="text-right">
      <b-btn @click.prevent="updateEntry" class="btn btn-success"
        >Update</b-btn
      ></div>
    </b-form>
  </b-container>
</template>

<script>
import { required, minValue, maxLength } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "editSeed",
  data() {
    return {
      cultivarOptions: [],
      toggle: false,
      prefix:'',

      //**seed parameters needed to be identical with db name
      currentSeed: {},
      newImage:null,
      
      previewImage: null,
      submitted: false,

      alert: ""
    };
  },

  props:{
    
  },

  validations: {
    currentSeed: {
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
    async deletePreviewImage() {
      // for display only
      this.previewImage = null;
      this.newImage = null;

    },

    check(e) {
      const file = e.target.files[0];
      this.previewImage = URL.createObjectURL(file);
    },

    async deleteSeed() {
      const x= axios.delete(`${process.env.VUE_APP_ROOT_API}/seeds/${this.currentSeed.seedId}`)
      try{
        this.$router.push({
          name:'SeedList',
          params: {x}
        });
      }
      catch(err){
        console.log(err.message);
      }
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

    async getSeed(id) {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/seeds/${id}`);
      try {
        this.currentSeed = x.data.data;
        if (this.currentSeed.image== null || this.currentSeed.image== 'null'){
          this.currentSeed.image=''
        }
      } 
      catch (err) {
        console.log(err.message);
      }
    },

    async updateEntry() {
      this.$v.currentSeed.$touch();

      if (this.$v.currentSeed.$error) return;
      const formData = new FormData();

      formData.append("scientificName",this.currentSeed.scientificName
      );
      formData.append("brand", this.currentSeed.brand);
      formData.append("cultivarId", this.currentSeed.cultivarId);
      formData.append("description", this.currentSeed.description);
      formData.append("quantity", this.currentSeed.quantity);
      formData.append("url", this.currentSeed.url);
      formData.append("width", this.currentSeed.width);
      formData.append("height", this.currentSeed.height);
      
      if (this.newImage!=null){
          formData.append("image", this.newImage);
      }
      else{
          formData.append("imagePath", this.currentSeed.imagePath);
          formData.append("imageName", this.currentSeed.imageName);
      }
  
      const x = await axios.put(`${process.env.VUE_APP_ROOT_API}/seeds/${this.currentSeed.seedId}`,formData);
      try {
        if(x.data.data){
          this.$router.push(
          {name: 'EditedSeedEntry',
          params: {
            id:x.data.data.seedId,
            msg: x.data.msg,
             }
          })
        // console.log(x.data)
        }

        else{
          this.$router.push(
          {name: 'EditedSeedEntry',
          params: {
            id:this.currentSeed.seedId,
            msg: 'No changes applied to this entry.',
             }
          })
        }
        // console.log(x.data)
      } 
      catch (err) {
        console.log(err);
        this.alert = "Seed details not updated. Please try again.";
        this.showMsgBoxOne();
      }
    },

    async callAPI(){
      await Promise.all([
        this.getCultivar(),
        this.getSeed(this.$route.params.id)
      ]);
    }
  },

  computed:{
    sciName:{ //caps first
      get () {
         return this.currentSeed.scientificName;
      },
      set (value) {
        var splitStr = value.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
        let final= splitStr.join(' '); 
        this.currentSeed.scientificName = final; 
       }
    },

    brandName:{ //all CAPS
      get () {
         return this.currentSeed.brand; 
      },
      set (value) {
         this.currentSeed.brand = value.toUpperCase(); 
       }
    },



  },

  mounted() {
    this.prefix = `${process.env.VUE_APP_API_URL}/image/`
    this.callAPI()
  }
};
</script>

<style>
.error {
  color: red;
}

.image-seed {
  width: 150px;
  height: 150px;
  max-width: 100%;
  border: 1px solid rgba(85, 85, 85, 0.795);
  margin-top: 10px;
}

.image2 {
  width: 150px;
  height: 150px;
  max-width: 100%;
  margin-top: 2px;
}
</style>
