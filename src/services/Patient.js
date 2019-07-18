



const FHIRPatient = {
	displayName
}

function displayName(patient) {

  const names = patient.name
  if(!names) { return "" }

  var todisplay = names.filter(x => x.use === "official")[0]
  if(!todisplay) { todisplay = names[0] } 

  return todisplay.given[0] + " " + todisplay.family
}


export default FHIRPatient