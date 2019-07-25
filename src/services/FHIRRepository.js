
import FHIRUserAuthz from './FHIRUserAuthz'



import FHIRApi from './api/FHIRAPI'
import { SessionStorage } from './store/BrowserStorage'


const FHIRRepository = {

	getImmunizations,
	getMedications,
	getLabResults,
	getPatient,

	resolveReference,
}


const CachedResources = {

	cacheResources: function(resourceType, resources) {
		if(!resources.length) { return }

		const key = "FHIRRepository.CachedResources." + resourceType

		const encoded = SessionStorage.get(key)
		var cached = encoded ? JSON.parse(encoded) : {}
			

		resources.forEach(res => {
			cached[res.id] = res
		})

		SessionStorage.set(key, JSON.stringify(cached))
	},

	cached: function(resourceType) {
		const key = "FHIRRepository.CachedResources." + resourceType
		const encoded = SessionStorage.get(key)
		return encoded ? JSON.parse(encoded) : {}
	}
}

function parseResources(data) {
    const resources = data.entry.map(x => x.resource)

    const types = ["Immunization", "Patient", "DiagnosticReport", "Observation", "MedicationRequest", "Medication"]

    var found = {}

    types.forEach(type => {

    	const ofType = resources.filter(x => x.resourceType === type)

    	found[type] = ofType

    	CachedResources.cacheResources(type, ofType)
    })


 //    const immz = resources.filter(x => x.resourceType === "Immunization")
 //    const patients = resources.filter(x => x.resourceType === "Patient")
	// const diag_report = resources.filter(x => x.resourceType === "DiagnosticReport")
	// const obsv = resources.filter(x => x.resourceType === "Observation")

	return found
}

function FHIRAPIRequest(permission) {

	const access = FHIRUserAuthz.getGrantedPermission(permission)
	if(!access) { return Promise.reject("no access") }


	return new Promise(function(resolve, reject) {

		FHIRApi.resourceRequest(access.resource_location, access.token)
		.then(result => {
			if(result.status !== 200) { reject("bad authz") }

			const returned = parseResources(result.data)

			resolve(returned)
		},
		(error) => {
			if(error.response.status == 401) {
				return reject("bad authz")
			}
			reject(error)
		})
	})

}


function anyResources(resourceType) {

return FHIRAPIRequest(resourceType)
		.catch(error => {
			
			var meta = {offline: true}
			if(error === "bad authz") { 
				meta.needsLogin = true
			}

			const cached = Object.values(CachedResources.cached(resourceType))

			var res = {}	
			res[resourceType] = cached
			res.meta = meta
			return Promise.resolve(res)	  
		})

}

/**
	medications, immunization, lab_results
*/
function getImmunizations() {
	return anyResources("Immunization")
}

function getLabResults() {
	return anyResources("DiagnosticReport")
}

function getMedications() {
	return anyResources("MedicationRequest")
}

function getPatient() {
	return anyResources("Patient")
}

function resolveReference(reference) {
      if(!reference) { return null }


      const parts = reference.split('/', 2);
	  const resid = parts[1]
	  const resourceType = parts[0]

      const resourcesOfType = CachedResources.cached(resourceType)

      for (const [key, value] of Object.entries(resourcesOfType)) {
      	if(key === resid) {
      		return value
      	}
      }

      return results.length ? results[0] : null
}


export default FHIRRepository