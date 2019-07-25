<template>
  <div class="profile container">
    <h1 class="title">Profile</h1>
    <b-row>
      <b-col>
        <img src="./../assets/woman.png" alt="illustration of woman" width="200" height="200" border="1" class="profile-image"/>
      </b-col>
      <b-col cols="9">
        <h2>{{ patientName }}</h2>
        <h3>1234 Vancouver Street</h3>
        <h3>PHN: 9*****6204</h3> 
        <h3>DOB: 1981 FEB 19</h3>
        <p>If this profile information is incorrect, go <a href="#">here</a></p>
      </b-col>
    </b-row>
    <button class="btn btn-primary" v-on:click="logout()">
      Logout
    </button>    
    <h2 class="title">Connections</h2>
    <p>Enjoy all the benefits and value that third-party health apps provide by
      connecting them to your health data</p>
    <h4 class="apps-connected">You have 3 connected apps</h4>
    <b-row>
      <b-col cols="4" class="app-connected">
        <div class="inner">
          <img src="https://images.ctfassets.net/1izjqx4qtt8c/1NogrRoCWomi6Ksecqm6KS/0a863bb2d152c76713626ec4fc1ee9d9/THB_logo_hor_pur_RGB.png" height="30"/>
          <p>Connected with Babylon to share all your health data</p>
          <strong><a href="#">[Disconnect Babylon]</a></strong>
        </div>
       </b-col>
      <b-col cols="4" class="app-connected">
        <div class="inner">
          <img src="https://support.apple.com/library/content/dam/edam/applecare/images/en_US/ios/built_in/ios9-health-app-icon.png" height="30"/>
          <p>Connected with Apple Health to share all your health data to view progress</p>
          <strong><a href="#">[Disconnect Apple Health]</a></strong>
        </div>
       </b-col>
      <b-col cols="4" class="app-connected">
        <div class="inner">
          <img src="https://careteam.tech/wp-content/uploads/2018/04/ctm_logo.png" height="30"/>
          <p>Connected with Care Team to share all your health data to provide complex care insights</p>
          <strong><a href="#">[Disconnect Care Team]</a></strong>
        </div>
       </b-col>
    </b-row>
    <h2 class="title">Delegation</h2>
    <p>Allow others to view your health data by granting.</p>
    <p class="end-sentence"><strong>You have not delegated access to anyone</strong></p>
  </div>
</template>
<script>
// @ is an alias to /src
import FHIRRepository from '@/services/FHIRRepository'
import FHIRPatient from '@/services/Patient'
import FHIRUserAuthz from '@/services/FHIRUserAuthz'

export default {
  name: "Profile",
  data: () => {
    return {
      patient: {},
      images: {
        profile: require('./../assets/profile.jpg')
      }
    };
  },
  methods: {
    getCurrentUserInfo() {
      FHIRRepository.getPatient()
        .then(response => {
          this.patient = response.Patient[0]
        });
    },
    logout() {
      FHIRUserAuthz.logout()
      this.$router.push('/login')
    }
  },
  computed: {
    patientName: function() {
      return FHIRPatient.displayName(this.patient)
    }
  },  
  beforeMount() {
    this.getCurrentUserInfo();
  }
};
</script>
<style scoped>
.container {
  text-align: left;
}
</style>
