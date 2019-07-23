<template>
  <div class="container">
    <br>

    <h1 class="lab-results-title"><font-awesome-icon icon="flask"></font-awesome-icon> Lab Results</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Test</th>
          <th>Results</th>
          <th>
            Date of Inspection
          </th>
          <th>
            <button class="btn btn-primary" @click="getAllLabResults()">
              <font-awesome-icon icon="sync-alt"/>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="report in reports">

          <tr :key="report.id" class="accordion-toggle">
            <td>{{ report.code.coding[0].display }}</td>
            <td>{{ report.result.length }}</td>
            <td>{{ report.effectiveDateTime }}</td>
            <td>
              <button
                class="btn btn-light btn-sm"
                @click="toggleReportResults(report.id)"
              >DETAILS</button>
            </td>
          </tr>

          <div class='sub-details' v-if="opened.includes(report.id)">

            <tr>
              <th>Result</th>
              <th>Value</th>
              <th>Unit</th>
            </tr>

            <tr v-for="result in report.result" :key="result.reference">
              <td>{{ result.display }}</td>
              <td>{{ observationForRef(result.reference).valueQuantity.value }}</td>
              <td>{{ observationForRef(result.reference).valueQuantity.unit }}</td>
            </tr>

          </div>

        </template>




        <tr class="details" v-if="this.isDetailsShowing == true">
          <td>
            <p>Observation: {{labResults[0].resource.component[0].code.text}}</p>
            <p>Observation: {{labResults[0].resource.component[1].code.text}}</p>
            <p>Observation: {{labResults[0].resource.component[2].code.text}}</p>
            <p>Observation: {{labResults[0].resource.component[3].code.text}}</p>
            <p>Observation: {{labResults[0].resource.component[4].code.text}}</p>
            <p>Observation: {{labResults[0].resource.component[5].code.text}}</p>
            <p>Observation: {{labResults[0].resource.component[6].code.text}}</p>
          </td>
          <td>
            <p>Result: {{labResults[0].resource.component[0].valueQuantity.value}} {{labResults[0].resource.component[0].valueQuantity.unit}}</p>
            <p>Result: {{labResults[0].resource.component[1].valueQuantity.value}} {{labResults[0].resource.component[1].valueQuantity.unit}}</p>
            <p>Result: {{labResults[0].resource.component[2].valueQuantity.value}} {{labResults[0].resource.component[2].valueQuantity.unit}}</p>
            <p>Result: {{labResults[0].resource.component[3].valueQuantity.value}} {{labResults[0].resource.component[3].valueQuantity.unit}}</p>
            <p>Result: {{labResults[0].resource.component[4].valueQuantity.value}} {{labResults[0].resource.component[4].valueQuantity.unit}}</p>
            <p>Result: {{labResults[0].resource.component[5].valueQuantity.value}} {{labResults[0].resource.component[5].valueQuantity.unit}}</p>
            <p>Result: {{labResults[0].resource.component[6].valueQuantity.value}} {{labResults[0].resource.component[6].valueQuantity.unit}}</p>
          </td>
          <td>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
            <p>Pass/Fail: <font-awesome-icon class="check-icon" icon="check"></font-awesome-icon></p>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
import FHIRRepository from '@/services/FHIRRepository'

export default {
  name: "LabResults",
  data: () => {
    return {
      labResults: [],
      isDetailsShowing: false,

      patient: {},
      reports: [],
      observations: [],
      opened: [],

    };
  },
  components: {},
  methods: {
    getAllLabResults() {
      FHIRRepository.getLabResults()
        .then(response => {
          console.log(response);
          this.labResults = response.labResults

          this.reports = response.DiagnosticReport
          this.observations = response.Observation
          this.patient = response.Patient
        });
    },
    toggleDetails() {
      this.isDetailsShowing = !this.isDetailsShowing
    },
    observationForRef(ref) {
      if(!ref) { return null }

      const search_id = ref.slice("Observation/".length);

      const results = this.observations.filter(x => x.id === search_id)

      return results.length ? results[0] : null
    },
    toggleReportResults(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1)
      } else {
        this.opened.push(id)
      }
    }    
  },
  beforeMount() {
    this.getAllLabResults();
  }
};
</script>

<style scoped>
.container {
  text-align: left;
}
.details {
  margin-left: 15px;
}
.check-icon {
  color: green
}
.sub-details {
  color: #777777;
  /*width: 100%;*/
  padding-left: 50px;
}
</style>