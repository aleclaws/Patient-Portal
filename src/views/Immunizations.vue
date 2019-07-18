<template>
  <div class="container">
    <br>
    <h1><font-awesome-icon icon="syringe"></font-awesome-icon>&nbsp;Immunizations</h1>
    <div>
      <b-form-group>
        <div @click="this.getAllImmunizations" >
          {{ patientName }}
        </div>
      </b-form-group>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Immunization ID</th>
          <th>Immunization Name</th>
          <th>
            <button class="btn btn-light" @click="toggleImmunizationSort()">
              <font-awesome-icon icon="arrows-alt-v"/>
            </button>
            Most Recent Administration (YYYY-MM-DD)
          </th>
          <th>
            <a v-if="this.showCertificate" href="https://drive.google.com/open?id=14bmr-ABh0uJQNRqQvIynnVGAI1EodCJU">
              <button class="btn btn-primary">Download Certificate</button>
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="immunization in immunizations" :key="immunization.id" >
          <td>{{ immunization.id }}</td>
          <td>{{ immunization.vaccineCode.text }}</td>
          <td>{{ immunization.date }}</td>
          <td>
            <button class="btn btn-light btn-sm" @click="openImmunizationModal(immunization)">DETAILS</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FHIRResource from '@/services/FHIRResource'
import FHIRPatient from '@/services/Patient'


// @ is an alias to /src
export default {
  name: "Immunizations",
  data: () => {
    return {
      immunizations: [],
      sort: "new-to-old", 
      patient: {},
      showCertificate: false
    };
  },
  computed: {
    patientName: function() {
      return FHIRPatient.displayName(this.patient)
    }
  },
  methods: {
    getAllImmunizations() {
      FHIRResource.getImmunizations()
        .then(
          response => {
            console.log("RESPONSE:", response)

            this.immunizations = response.immunizations
            this.sortImmunizations()

            this.patient = response.patient

          },
          error => {
            console.error(error);
          }
        );
    },
    toggleImmunizationSort() {
      this.sort = this.sort === "new-to-old" ? "old-to-new" : "new-to-old"
      this.sortImmunizations()
    },
    sortImmunizations() {

      const sortType = this.sort
      const sorted = this.immunizations.sort(function(a,b){
        const diff = new Date(b.date) - new Date(a.date)
        return sortType === "new-to-old" ? diff : -diff;
      });

      this.immunizations = sorted
    },
    openImmunizationModal(immunizationRow) {
      console.log(immunizationRow);
    }
  },
  beforeMount() {
    this.getAllImmunizations();
  }
};
</script>

<style scoped>
.container {
  text-align: left;
}
</style>