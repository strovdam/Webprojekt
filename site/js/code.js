function init() {
	document.getElementById("input").addEventListener("input", inputChanged);
}

function normalizeInput(inp) {
	inp = inp.replace("-", "+ -");
	inp = inp.replace("- ", "-")
	return inp;
}

function inputChanged() {
	var i = document.getElementById("input");
	var s = normalizeInput(i.value);
	solve(s);
}

function solve(inp) {
	inp = inp.split("=")[1];
	var sums = inp.split("+");
	var grades = [];
	var maxGrade = 0;
	for(var i = 0; i < sums.length; i++) {
		sums[i] = sums[i].trim();
		grades.push(findGrade(sums[i]));
		if(grades[i] > maxGrade) {
			maxGrade = grades[i];
		}
	}
	if(maxGrade == 0) {
		setSolution([]);
	}
	else if(maxGrade == 1) {
		var s2 = 0;
		var s1 = findCoefficient(sums[0]);
		if(sums.length > 1)
			s2 = findCoefficient(sums[1]);
		if(grades[0] == 1) {
			solveLinear(s1, s2);
		} else {
			solveLinear(s2, s1);
		}
	}
	else if(maxGrade == 2) {
		var a, b = 0, c = 0;
		for(var i = 0; i < grades.length; i++) {
			if(grades[i] == 2)
				a = findCoefficient(sums[i]);
			if(grades[i] == 1)
				b = findCoefficient(sums[i]);
			if(grades[i] == 0)
				c = findCoefficient(sums[i]);
		}
		solveSquare(a,b,c);
	}
}

function findGrade(summand) {
	for(var i = 0; i < summand.length; i++) {
		if(summand[i] == "x") {
			if(i < summand.length - 1 && summand[i+1] == "^") {
				return parseInt(summand[i+2]);
			} else {
				return 1;
			}
		}
	}
	return 0;
}

function findCoefficient(summand) {
	//alert(summand);
	for(var i = 0; i < summand.length; i++) {
		if(summand[i] == "x") {
			if(i > 0) {
				var p = summand.substring(0, i);
				return parseInt(p);
			} else {
				return 1;
			}
		}
	}
	return parseInt(summand);
}

function solveLinear(k, d) {
	//alert(k + " " + d);
	var x = [ -d / k ];
	setSolution(x);
}

function solveSquare(a, b, c) {
	//alert(a + " " + b + " " + c);
	var dis = b*b - 4*a*c;
	var x = [];
	if(dis == 0) {
		var x1 = -b / (2*a);
		x.push(x1);
	} else if(dis > 0) {
		var d = Math.sqrt(dis);
		var x1 = (-b + d) / (2*a);
		var x2 = (-b - d) / (2*a);
		x.push(x1);
		x.push(x2);
	}
	setSolution(x);
}

function solveBrute(x) {
	var cX = 0;
	var oldX = 0;
	var s = 0;
	var oldS = 0;
	
	for(var i = 1; i < x.length; i++) {
		s += Math.pow(cX, x.length - i)*x[i-1];
	}
	if(s > -0.0001 && s < 0.0001) {
		setSolution(cX);
	}
	if(s >= 0.0001) {
		var diff = cX - oldX;
		if(oldS <= s) {
			cX += diff;
		} else {
			cX -= diff;
		}
		oldS = s;
	}
	if(s <= -0.0001) {
		
	}
}

function setSolution(x) {
	var s = "x = {";
	for(var i = 0; i < x.length; i++) {
		s += " " + x[i] + ",";
	}
	if(x.length != 0)
		s = s.substring(0, s.length - 1);
	s += " }";
	document.getElementById("output").value = s;
}