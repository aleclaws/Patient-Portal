
import FHIRUserAuthz from './FHIRUserAuthz'



import FHIRApi from './api/FHIRAPI'


const FHIRResource = {

	getImmunizations,
	getLabResults
}


/**
	medications, immunization, lab_results
*/
function getImmunizations() {

	const access = FHIRUserAuthz.getGrantedPermission("immunization")
	if(!access) { return Promise.reject("no access") }


	return new Promise(function(resolve, reject) {

		FHIRApi.resourceRequest(access.resource_location, access.token)
		.then(result => {
			if(result.status !== 200) { reject("bad authz") }

	        const resources = result.data.entry.map(x => x.resource)

            const immz = resources.filter(x => x.resourceType === "Immunization")
            const patient = resources.filter(x => x.resourceType === "Patient")[0]

			resolve({immunizations: immz, patient: patient})
		},
		(error) => reject(error))
	})
}

function getLabResults() {

	const access = FHIRUserAuthz.getGrantedPermission("lab_results")
	if(!access) { return Promise.reject("no access") }


	return new Promise(function(resolve, reject) {

		FHIRApi.resourceRequest(access.resource_location, access.token)
		.then(result => {
			if(result.status !== 200) { reject("bad authz") }

	        const resources = result.data.entry.map(x => x.resource)

            const immz = resources.filter(x => x.resourceType === "DiagnosticReport")
            const patient = resources.filter(x => x.resourceType === "Patient")[0]

			resolve({labResults: immz, patient: patient})
		},
		(error) => reject(error))
	})
}

export default FHIRResource