<template>
  <b-container>
    <div>
      <h1 class="mt-3">Delivery Note Upload</h1>
    </div>
    <!-- <b-form-group label="Farm Location">
      <b-form-radio v-model="location" value="langkawi">Langkawi</b-form-radio>
      <b-form-radio v-model="location" value="melawati">Melawati</b-form-radio>
    </b-form-group>-->
    <!-- <b-form-group label="Department"> -->
    <!-- <b-form-radio v-model="department" value="technical">Technical Team</b-form-radio> -->
    <!-- <b-form-radio v-model="department" value="agri">Agri Team</b-form-radio> -->
    <!-- <b-form-radio v-model="department" value="website">Dev Team</b-form-radio> -->
    <!-- </b-form-group> -->
    <!-- <b-form-group label="Issues">
      <b-form-select v-model="selectedIssue" :options="issues"></b-form-select>
    </b-form-group>
    <b-form-group class="mt-4" label="Description">
      <b-form-input class="mt-2" v-model="caption" placeholder="Enter issues/problems faced"></b-form-input>
      <b-form-file class="mt-3" v-model="selectedFile" type="files" ref="files" accept=".jpg, .png"></b-form-file>
    </b-form-group>-->
    <b-form @submit.stop.prevent="uploadImage">
      <b-form-group
        class="mt-4"
        label="Purchase Order Number"
        label-class="font-weight-bold pt-1"
        label-size="lg"
      >
        <b-form-input
          class="mt-2"
          v-model="$v.form.DO.$model"
          placeholder="Enter PO number"
          :state="validateState('DO')"
        ></b-form-input>
        <b-form-invalid-feedback id="input-1-live-feedback">
          This is a required field and must be 13 <b>numbers</b>.
        </b-form-invalid-feedback>
        <b-form-input
          class="mt-2"
          v-model="caption"
          placeholder="Enter the corrected weight (if any for eg. LB 5kg)"
          required
        ></b-form-input>
        <b-form-file
          class="mt-3"
          v-model="selectedFile"
          type="files"
          ref="files"
          accept=".jpg, .png"
          required
        ></b-form-file>
      </b-form-group>

      <!-- <div>Maximum number of attachment is 5. Allowed file types: jpg / jpeg / png.</div> -->
      <b-btn class="mt-3" type="submit" variant="warning">Upload</b-btn>
    </b-form>

    <b-progress
      class="mt-3"
      :value="progress"
      variant="success"
      striped
      :animated="true"
      show-value
    ></b-progress>

    <div v-if="this.state === true">
      <b-col>
        <b-row v-if="successUpload == true">
          <b>Uploaded image</b>
        </b-row>
        <b-col
          v-for="(image, i) of recentImage"
          :key="i"
          cols="10"
          sm="15"
          md="6"
        >
          <div class="card">
            <img
              :src="prefix + image"
              class="mt-3"
              width="100px"
              style="width:100%"
            />

            <!-- :src="`${process.env.VUE_APP_ROOT_API}+':'+${process.env.VUE_APP_ROOT_API_PORT}+'/image/image' + ${image}`" -->
            <div class="container">
              <h4>
                <b>{{ image.caption }}</b>
              </h4>
              <p>{{ image.createdAt }}</p>
            </div>
          </div>
        </b-col>
      </b-col>
    </div>

    <b-alert class="mt-3" v-model="showAlert" variant="warning">{{isExistMsg}}. Please upload a new image or change the file name.</b-alert>

  </b-container>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength,
  numeric
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data() {
    return {
      prefix: `${process.env.VUE_APP_ROOT_API}/image/get/image/id/`,
      location: 'langkawi',
      department: 'technical',
      issues: [
        'tip burn',
        'wilting',
        'mechanical injury',
        'morphology defect',
        'yellowing',
        'malnutrition'
      ],
      selectedIssue: 'tip burn',
      caption: null,
      
      selectedFile: null,
      progress: 0,
      recentImage: null,
      state: false,
      successUpload: false,
      files: [],
      form: {
        DO: null
      },
      isExistMsg:'',
      showAlert: false,
    }
  },
  validations: {
    form: {
      DO: {
        required,
        numeric,
        minLength: minLength(13),
        maxLength: maxLength(13)
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },

    onFileSelected(event) {
      if (event.target.files.length === 0) {
        return
      }
      console.log(event.target.files)
      for (var i = 0; i < event.target.files.length; i++) {
        this.selectedFile = event.target.files
      }
      this.selectedFile = event.target.files[0]
      // this.prefix = URL.createObjectURL(event.target.files[0])
    },

    async uploadImage() {
      this.isExistMsg=''
      var formData = new FormData()
      formData.append('DO', this.form.DO)
      formData.append('caption', this.caption)
      formData.append('file', this.selectedFile)
      // for (var i = 0; i < this.files.length; i++) {
      //   let file = this.files[i]
      //   formData.append('files[' + i + ']', file)
      // }
      // console.log(this.files)

      const x= await axios.post(`${process.env.VUE_APP_ROOT_API}/image/upload/one`,formData,
          {
            onUploadProgress: uploadEvent => {
              this.progress = Math.round(
                (uploadEvent.loaded / uploadEvent.total) * 100
              )
            }
          })

      try{
        if(x.data.success==true){
          await this.fetchRecent()
          this.state = true
          this.successUpload = true
        }

        else{
          this.isExistMsg= x.data.message
          this.state = false
          this.showAlert= true
        }
          
      }
  
      catch(err){
        alert('Error: ' + err.message)
      }
    },

    async fetchRecent() {
      const x= await axios.get(`${process.env.VUE_APP_ROOT_API}/image/get/recent`)
      try{
        this.recentImage = x.data.image.filename
      }

      catch(err){ 
        alert('Error: ' + err)
        }
    },

    // multiple files upload -- NOT IN USE
    handleFilesUpload() {
      this.files = this.$refs.files.files
    },
    
    submitFiles() {
      let formData = new FormData()
      /*
          Iteate over any file sent over appending the files
          to the form data.
        */
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]
        formData.append('file[' + i + ']', file)
      }
      console.log(formData)
      /*
          Make the request to the POST /multiple-files URL
        */
      axios
        .post(
          `${process.env.VUE_APP_ROOT_API}/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(function() {
          console.log('SUCCESS!!')
        })
        .catch(err => alert('Error: ' + err))
    }
  }
}
</script>

<style></style>