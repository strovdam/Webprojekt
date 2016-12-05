function randomEq() {
	var g = Math.round(Math.random()*4);
	var eq = "";
	for(var i = g; i >= 0; i--) {
		var c = Math.round(Math.random()*8) + 1;
		if(c != 1 || i == 0)
			eq += c+"";
		if(i == 1) {
			eq+= "x";
		} else if(i > 1) {
			eq += "x^"+i;
		}
		if(i != 0)
			eq += " + ";
	}
	return "0 = " + eq;
}

function setRandom() {
	var eq = randomEq();
	document.getElementById("rand").innerHTML = eq;
}