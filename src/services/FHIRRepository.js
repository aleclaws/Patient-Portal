
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
		(error) => reject(error))
	})

}

/**
	medications, immunization, lab_results
*/
function getImmunizations() {
	return FHIRAPIRequest("immunization")
}

function getLabResults() {
	return FHIRAPIRequest("lab_results")
}


function getMedications() {
	return FHIRAPIRequest("medications")
}

function getPatient() {

	const availblePatients = CachedResources.cached("Patient")

	if(availblePatients) {
		return Promise.resolve({ Patient: Object.values(availblePatients) })
	}

	return Promise.reject("no patients")
}

function resolveReference(reference) {

}


export default FHIRRepository