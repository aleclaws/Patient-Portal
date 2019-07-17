
import FHIRUserAuthz from './FHIRUserAuthz'



import FHIRApi from './api/FHIRAPI'


const Medications = {

	fetchList
}

function fetchList() {

	const access = FHIRUserAuthz.getGrantedPermission("medications")
	if(!access) { return Promise.reject("no access") }


	return new Promise(function(resolve, reject) {

		FHIRApi.resourceRequest(access.resource_location, access.token)
		.then(result => {
			if(result.status !== 200) { reject("bad authz") }
			resolve(result.data)
		},
		(error) => reject(error))
	})
}

export default Medications