window.addEventListener("resize", setFontSize);

function showOptions() {
	var o = document.getElementById("optionBox").style;
	if(o.visibility == "hidden" || !o.visibility) {
		o.visibility = "visible";
	} else {
		o.visibility = "hidden";
	}
}

var fs = NaN;
var fso = NaN;
var ifs;
var ifso;

function setFontSize() {
	var retry = true;
	while(retry == true) {
		var i = document.getElementById("input");
		var o = document.getElementById("output");
		if(!fs) {
			fs = window.getComputedStyle(i, null).getPropertyValue('font-size');
			ifs = parseInt(fs.substring(0, fs.length-2));
			fso = window.getComputedStyle(o, null).getPropertyValue('font-size');
			ifso = parseInt(fs.substring(0, fso.length-2));
		}
		retry = false;
		var f = window.getComputedStyle(i, null).getPropertyValue('font');
		var w = getTextWidth(i.value, f);
		var fo = window.getComputedStyle(o, null).getPropertyValue('font');
		var wo = getTextWidth(o.value, fo);

		var iw = window.innerWidth - 100;
		if(wo > iw) {
			ifso -= 2;
			o.style.fontSize = ifso+"px";
			retry = true;
		}
		if(w > iw) {
			ifs -= 2;
			i.style.fontSize = ifs+"px";
			retry = true;
		}
		hs = window.getComputedStyle(i, null).getPropertyValue('height');
		h = parseInt(hs.substring(0, hs.length -2 ));
		hso = window.getComputedStyle(o, null).getPropertyValue('height');
		ho = parseInt(hs.substring(0, hso.length -2 ));
		if(w < iw - 100 && fs < h - 2) {
			ifs += 2;
			i.style.fontSize = ifs+"px";
			retry = true;
		}
		if(wo < iw - 100 && fso < ho - 2) {
			ifso += 2;
			o.style.fontSize = ifso+"px";
			retry = true;
		}
	}
}

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}