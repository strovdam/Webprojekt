String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};



function init() {
	document.getElementById("input").addEventListener("input", inputChanged);
	document.getElementById("startX").addEventListener("input", inputChanged);
}
function initDiff() {
	document.getElementById("input").addEventListener("input", inputChangedDiff);
	document.getElementById("startX").addEventListener("input", inputChangedDiff);
}
function initInte() {
	document.getElementById("input").addEventListener("input", inputChangedInte);
	document.getElementById("startX").addEventListener("input", inputChangedInte);
}

function normalize(inp) {
	inp = inp.split("=")[1];
	inp = inp.trim();
	inp = inp.replace("-", "+ -");
	inp = inp.replace("- ", "-");
	inp = inp.replace("," , ".");
	return inp;
}

function normalizeInput(inp) {
	inp = normalize(inp);

	var x = [];
	var i = 0;
	var parts = inp.split("+");
	for(var g = 0; g < parts.length; g++) {
		parts[g] = parts[g].trim();
		while(parts[g][0] == " ") {
			parts[g] = parts[g].substring(1, parts[g].length-1);
		}
	}
	while(i < parts.length) {
		var minIndex = -1;
		for(var g = 0; g < parts.length; g++) {
			if(minIndex == -1 || findGrade(parts[g]) < findGrade(parts[minIndex])) {
				minIndex = g;
			}
		}
		var el = { grade:findGrade(parts[minIndex]), coeff:findCoefficient(parts[minIndex]) };
		x.push(el);
		parts.splice(minIndex, 1);
	}
	var maxGrade = x[x.length -1].grade;
	for(var i = 0; i < Math.ceil(maxGrade); i++) {
		var ok = false;
		for(var g = 0; g < x.length; g++) {
			if(x[g].grade == i) {
				ok = true;
				break;
			}
		}
		if(!ok) {
			var el = { grade:i, coeff:0 };
			var ok = false;
			for(var g = x.length -1; g >= 0; g--) {
				if(i > x[g].grade){
					x.splice(g, 0, el);
					ok = true;
					break;
				}
			}
			if(!ok)
				x.splice(0, 0, el);
		}
	}
	return x;
}

function inputChanged() {
	var i = document.getElementById("input");
	var array = normalizeInput(i.value);
	solve(array);
}

function inputChangedDiff() {
	var i = document.getElementById("input");
	var inp = normalize(i.value);
	solveDiff(inp);
}
function inputChangedInte() {
	var i = document.getElementById("input");
	var inp = normalize(i.value);
	solveInte(inp);
}

function solve(inp) {
	var maxGrade = inp[inp.length -1].grade;
	if(maxGrade == 0) {
		setSolution([]);
	}
	else if(maxGrade == 1) {
		solveLinear(inp[1].coeff, inp[0].coeff);
	}
	else if(maxGrade == 2) {
		var a, b = 0, c = 0;
		for(var i = 0; i < inp.length; i++) {
			if(inp[i].grade == 2)
				a = inp[i].coeff;
			if(inp[i].grade == 1)
				b = inp[i].coeff;
			if(inp[i].grade == 0)
				c = inp[i].coeff;
		}
		solveSquare(a,b,c);
	}
	else {
		solveBrute(inp);
	}
}

function solveDiff(inp) {
	var x = diffExpr(inp);
	document.getElementById("output").value = "y' = " + x;
}

function diffExpr(expr) {
	if(!expr.includes("+")) {
		if(expr.startsWith("sin")) {
			var n = expr.substring(3, expr.length);
			n = "cos" + n;
			var inner = diffExpr(expr.substring(4,expr.length-1));
			if(inner != "" && inner != "1")
				n+= "*("+inner+")";
			return n;
		} else if(expr.startsWith("cos")) {
			var n = expr.substring(3, expr.length);
			n = "-sin" + n;
			var inner = diffExpr(expr.substring(4,expr.length-1));
			if(inner != "" && inner != "1")
				n +="*("+inner+")";
			return n;
		} else if(expr.startsWith("tan")) {
			var n = "1 + " + expr.splice(3,0,"^2");
			var inner = diffExpr(expr.substring(4,expr.length-1));
			if(inner != "" && inner != "1")
				n = "("+n+")*("+inner+")";
			return n;
		} else if(expr.startsWith("asin")) {
			var n = expr.substring(5, expr.length-1);
			var inner = diffExpr(expr.substring(5,expr.length-1));
			var rest;
			if(n.length > 1)
				rest = "(sqrt(1 - (" + n +")^2))";
			else
				rest = "(sqrt(1 - " + n +"^2))";
			if(inner != "" && inner != "1")
				return "("+inner+") / " + rest;
			return "1 / " + rest;
		} else if(expr.startsWith("acos")) {
			var n = expr.substring(5, expr.length-1);
			var inner = diffExpr(expr.substring(5,expr.length-1));
			var rest;
			if(n.length > 1)
				rest = "(sqrt(1 - (" + n +")^2))";
			else
				rest = "(sqrt(1 - " + n +"^2))";
			if(inner != "" && inner != "1")
				return "-("+inner+") / " + rest;
			return "-1 / " + rest;
		} else if(expr.startsWith("atan")) {
			var n = expr.substring(5, expr.length-1);
			var inner = diffExpr(expr.substring(5,expr.length-1));
			var rest;
			if(n.length > 1)
				rest = "(1 + (" + n +")^2)";
			else
				rest = "(1 + " + n +"^2)";
			if(inner != "" && inner != "1")
				return "("+inner+") / " + rest;
			return "1 / " + rest;
		} else {
			var c = findCoefficient(expr);
			var g = findGrade(expr);
			c*=g;
			g-=1;
			if(g == -1)
				return "";
			else if(g == 0)
				return c + "";
			else if(g == 1)
				return c+"x";
			else
				return c + "x^"+g;
		}
	} else {
		var parts = expr.split("+");
		if(parts.length > 1) {
			var n = "";
			for(var i = 0; i < parts.length; i++) {
				parts[i] = parts[i].trim();
				var p = diffExpr(parts[i]);
				if(p != "" && p != "0")
					n += diffExpr(parts[i]) + " + ";
			}
			if(n.length > 0) {
				n = n.substring(0, n.length-3);
			}
			return n;
		}
	}
}

function solveInte(inp) {
	var x = inteExpr(inp);
	var n = "y = " + x;
	if(x != "")
		n = n + " + C";
	else
		n = n + "C";
	document.getElementById("output").value = n;
}

function inteExpr(expr) {
	if(!expr.includes("+")) {
		if(expr.startsWith("sin")) {
			var n = expr.substring(3, expr.length);
			n = "-cos" + n;
			return n;
		} else if(expr.startsWith("cos")) {
			var n = expr.substring(3, expr.length);
			n = "sin" + n;
			return n;
		} else if(expr.startsWith("tan")) {
			var n = expr.substring(3, expr.length);
			n = "ln(cos" + n+")";
			return n;
		} else if(expr.startsWith("asin")) {
			var n = expr.substring(5, expr.length-1);
			if(n.length > 1)
				n = "(" + n + ")";
			return n +"asin("+n+") + (1 - " + n+"^2)^(1/2)";
		} else if(expr.startsWith("acos")) {
			var n = expr.substring(5, expr.length-1);
			if(n.length > 1)
				n = "(" + n + ")";
			return n +"acos("+n+") - (1 - " + n+"^2)^(1/2)";
		} else if(expr.startsWith("atan")) {
			var n = expr.substring(5, expr.length-1);
			if(n.length > 1)
				n = "(" + n + ")";
			return n +"atan("+n+") - (ln("+n+"^2+1))/2";
		} else {
			var c = findCoefficient(expr);
			var g = findGrade(expr);
			g+=1;
			c/=g;
			if(c != 0) {
				if(g == 0)
					return "";
				else if(g == 1) {
					if(c != 1)
						return c+"x";
					else
						return "x";
				}
				else {
					if(c != 1)
						return c + "x^"+g;
					else
						return "x^" + g;
				}
			} else {
				return "";
			}
		}
	} else {
		var parts = expr.split("+");
		if(parts.length > 1) {
			var n = "";
			for(var i = 0; i < parts.length; i++) {
				parts[i] = parts[i].trim();
				var p = inteExpr(parts[i]);
				if(p != "" && p != "0")
					n += inteExpr(parts[i]) + " + ";
			}
			if(n.length > 0) {
				n = n.substring(0, n.length-3);
			}
			return n;
		}
	}
}

function findGrade(summand) {
	for(var i = 0; i < summand.length; i++) {
		if(summand[i] == "x") {
			if(i < summand.length - 1 && summand[i+1] == "^") {
				var n = "";
				var grade = 0.0;
				for(var g = i+2; g < summand.length; g++) {
					if(!("1234567890.".includes(summand[g])))
						break;
					n += summand[g];
				}
				grade = solveExpression(n);
				return grade;
			} else {
				return 1;
			}
		}
	}
	return 0;
}

function solveExpression(expr) {
	if(expr.includes("/")) {
		return solveFraction(expr);
	}
	else {
		return parseFloat(expr);
	}
}

function findCoefficient(summand) {
	for(var i = 0; i < summand.length; i++) {
		if(summand[i] == "x") {
			if(i > 0) {
				var p = summand.substring(0, i);
				return solveExpression(p);
			} else {
				return 1;
			}
		}
	}
	return solveExpression(summand);
}

function solveFraction(fraction) {
	var lr = fraction.split("/");
	var l = solveExpression(lr[0]);
	var r = solveExpression(lr[1]);
	return l / r;
}

function solveLinear(k, d) {
	if(k == 0) {
		setSolution([]);
		return;
	}
	var x = [ -d / k ];
	setSolution(x);
}

function solveSquare(a, b, c) {
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
	var der = derive(x);
	xn = parseFloat(document.getElementById("startX").value);
	var cnt = 0;
	var sd = calculate(xn, der);
	var s = calculate(xn, x);
	while(!(s < 0.000000000000001 && s > -0.000000000000001) && cnt < 1000) {
		if(sd == 0) {
			setSolution([]);
			return;
		}
		xn = xn - s / sd;
		var s = calculate(xn, x);
		var sd = calculate(xn, der);
		cnt++;
	}
	if(cnt == 1000) {
		setSolution([]);
		return;
	}
	setSolution(xn);
}

function setSolution(x) {
	var ok = false;
	var s = "x = {";
	if(x.constructor === Array) {
		if(x.length == 0)
			ok = true;
		for(var i = 0; i < x.length; i++) {
			if(x[i]) {
				ok = true;
			}
			var n = +x[i].toFixed(5);
			s += " " + n + ",";
		}
		if(x.length != 0)
			s = s.substring(0, s.length - 1);
		s += " }";
	} else {
		if(x)
			ok = true;
		var n = +x.toFixed(5);
		s += " " + n + " }";
	}
	if(ok)
		document.getElementById("output").value = s;
}

function derive(inp) {
	var x = [];
	for(var i = 0; i < inp.length; i++) {
		var el = { grade: inp[i].grade - 1, coeff: inp[i].coeff*inp[i].grade };
		x.push(el);
	}
	return x;
}

function calculate(x, func) {
	var s = 0;
	for(var i = 0; i < func.length; i++) {
		if(!(x == 0 && func[i].grade <= 0))
			s += Math.pow(x, func[i].grade)*func[i].coeff;
	}
	return s;
}