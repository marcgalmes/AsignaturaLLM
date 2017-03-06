// JavaScript Document

var elementosPag = {};
var idpregunta = 1;

function update() {
	var topnav = elementosPag.topnav;
	var siOverflowea = elementosPag.siOverflowea;

	/*
	if (isOverflowed(topnav)) {
		siOverflowea.style.display = "inline";
	} else {
		siOverflowea.style.display = "none";
	}*/
	if (siOverflowea.textContent===">>>"){
		topnav.style.height="35px";
	} else {
		topnav.style.height="";
	}
}
window.onresize = function() {
	update();
};

window.onload = function () {
	elementosPag.siOverflowea = document.getElementById("siOverflowea");
	elementosPag.topnav = document.getElementById("topnav");
	elementosPag.siOverflowea.onclick = function() {
		var e = elementosPag.siOverflowea;
		if (e.textContent===">>>") {
			e.textContent = "<<<";
		} else {
			e.textContent = ">>>";
		}
		update();
	};
	update();
        
        document.getElementById("pregunta1").addEventListener("animationend", function(e) {
            document.getElementById("pregunta1").style.animationName ="";
        }, false);
};


var xhttp = new XMLHttpRequest();
var xmlDoc;
xhttp.onreadystatechange = function() {
 if (this.readyState === 4 && this.status === 200) {
  gestionarXml(this);
 }
};
xhttp.open("GET", "xml/preguntas.xml", true);
xhttp.send();

function segPregunta() {
    document.getElementById("pregunta1").style.animationName = "canviPregunta";
    idpregunta+=1;
    if (idpregunta === 10)
        idpregunta = 0;
    loadPregunta();
}

function antPregunta() {
    document.getElementById("pregunta1").style.animationName = "canviPregunta";
    idpregunta-=1;
    loadPregunta();
}

function loadPregunta() {
    document.getElementById("numPregunta").textContent = idpregunta;
    var preg = xmlDoc.getElementById("mrl"+idpregunta).getElementsByTagName("title")[0].innerHTML;
	document.getElementById("pregunta1").getElementsByTagName("strong")[0].innerHTML= preg;
	document.getElementById("preguntaSel").style.display = "inherit";
        for (var i=0;i<=2;i++) {
           var resp = xmlDoc.getElementById("mrl"+idpregunta).getElementsByTagName("option")[i].innerHTML;
            document.getElementById("preguntaSel").getElementsByClassName("resposta")[i].getElementsByTagName("label")[0].innerHTML= resp;
    }
    
}

function gestionarXml(dadesXml){
	xmlDoc = dadesXml.responseXML;
        loadPregunta();
}