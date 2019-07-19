<template>
  <div class="container">
    <br>
    <h1><font-awesome-icon icon="prescription-bottle-alt"></font-awesome-icon> Medications</h1>
    <table class="table" v-if="hasMedications">
      <thead>
        <tr>
          <!-- <th>Medication ID</th> -->
          <th>Medication Name</th>
          <th>Dosage</th>
          <th>Perscription Date</th>
          <th>Expiry Date</th>
          <th># of Renewals Left</th>
          <th>
            <button class="btn btn-primary" v-on:click="getAllMedications()">
              <font-awesome-icon icon="sync-alt"/>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in medicationRequests" :key="request.id">
          <td>{{ requestMedName(request) }}</td>
          <td>{{ requestMedDosage(request) }}</td>
          <td>{{ request.authoredOn }}</td>
          <td>N/A</td>
          <td>{{ requestRenewalsLeft(request) }}</td>
          <!-- <td> -->
            <b-btn @click="openModal(request)" class="btn btn-light btn-sm">DETAILS</b-btn>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <h1>Looks like you don't have any medications perscribed. Would you like to request one?</h1>
    </div>
    <div>
      <medicaiton-modal></medicaiton-modal>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MedicationModal from "@/components/MedicationModal.vue";
import FHIRRepository from '@/services/FHIRRepository'


export default {
  name: "Medications",
  data: () => {
    return {
      hasMedications: true,
      medicationRequests: [],
      medications: [],
      patient: {}
    };
  },
  components: {
    "medicaiton-modal": MedicationModal
  },
  methods: {
    requestMedName(request) {
      return this.medicationForRef(request.medicationReference.reference).code.text
    },
    requestRenewalsLeft(request) {
      if(!request.dispenseRequest) { return "0" }
      return request.dispenseRequest.numberOfRepeatsAllowed
    },
    requestMedDosage(request) {
      if (request.dosageInstruction) {
        const instructions = request.dosageInstruction[0]

        if(instructions.asNeededBoolean) { 
          return "As Needed"
        }
        if(instructions.timing) {
          const quantity = instructions.doseQuantity.value
          const repeat = instructions.timing.repeat

          if(repeat.frequency === 1) {
          return "Take " + quantity + " every " + repeat.period + repeat.periodUnit

          }

          return "Take " + quantity + " dose " + repeat.frequency + " times per " + repeat.period + repeat.periodUnit

        }
        
        return request.dosageInstruction[0]
      }
      return "N/A"
    },    
    getAllMedications() {

      FHIRRepository.getMedications()
      .then(response => {

        console.log(response)

        this.patient = response.Patient
        this.medicationRequests = response.MedicationRequest
        this.medications = response.Medication
      })

    },
    openModal(request) {
      console.log(request)
    },
    medicationForRef(ref) {
      if(!ref) { return null }

      const search_id = ref.slice("Medication/".length);

      const results = this.medications.filter(x => x.id === search_id)

      return results.length ? results[0] : null
    },    
  },

  beforeMount() {
    this.getAllMedications();
  }
};
</script>

<style scoped>
.container {
  text-align: left;
}
</style>