var formElement=null;
var numeroSecreto=null;
var respuestaSelect=null;
var respuestasCheckbox = [];
var contadorLabelfor = 0;//contador label for para que no se repitan
var nota = 0;  //nota de la prueba sobre 3 puntos (hay 3 preguntas)
var mostrarerrores = true;

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function(){ 

 //CORREGIR al apretar el botón
 formElement=document.getElementById('enviar');
 formElement.onsubmit=function(){
   inicializar();
   if (comprobar()){
    corregirNumber();
    corregirSelect();
    corregirCheckbox();
    presentarNota();
   }
   return false;
 }
 
 //LEER XML de xml/preguntas.xml
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
   gestionarXml(this);
  }
 };
 xhttp.open("GET", "xml/preguntas.xml", true);
 xhttp.send();
}

//****************************************************************************************************
// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml){
 var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
 if (xmlDoc == undefined ) {
     mostrarError("no hay xml.")
     return;
 }
 
 var tipos = {};//contendra el html para cada tipo
 
 if (document.getElementsByClassName("pregunta").length<5){//tienen q estar los 5 tipos
     mostrarError("faltan tipos de pregunta en el documento.")
 }
 
 //el html ya tiene los 5 tipos (hidden), asi q solo buscamos cada pregunta de cada tipo
 tipos["radio"]             = document.getElementsByClassName("pregunta tipoRadio")                 [0] ;
 tipos["text"]              = document.getElementsByClassName("pregunta tipoText")                  [0] ;
 tipos["select"]            = document.getElementsByClassName("pregunta tipoSelect")                [0] ;
 tipos["select multiple"]   = document.getElementsByClassName("pregunta tipoSelectMultiple")         [0] ;
 tipos["checkbox"]          = document.getElementsByClassName("pregunta tipoCheckbox")              [0] ;
 
 
 //variable preguntas: todas las etiquietas <question> del xml
 //divsPreguntas: todos los divs del html con clase "pregunta"
 var preguntas = xmlDoc.getElementsByTagName("question");
 var divsPreguntas = []
 
 //recorremos preguntas del xml
 for (i = 0; i < preguntas.length; i++) {
     var div    = document.createElement("div");
     var preg   = preguntas[i];
     
     divsPreguntas[i] = div;
     
     var t = preguntas[i].getElementsByTagName("type");
     var q = preguntas[i].getElementsByTagName("title");
     var a = preguntas[i].getElementsByTagName("answer");
     var o = preguntas[i].getElementsByTagName("option");
     
     if (t.length==0) {
         mostrarError("el xml no está bien.");
         return;
     }
     
     var tipo = t[0].innerHTML;
     
     if (!(tipo in tipos)) {
         mostrarError("hay un tipo incorrecto.")
         return;
     }
     
     var modelo = tipos[tipo];
     if (modelo == undefined) {
         mostrarError("falta un tipo en el documento.")
     }
     
     div.innerHTML = modelo.innerHTML;
     div.setAttribute("class",modelo.getAttribute("class"));
     div.setAttribute("id","preg_"+preg.getAttribute("id"));
     
     //poner texto de las preguntas
     div.getElementsByClassName("textPregunta")[0].innerHTML = q[0].innerHTML;
     
     document.getElementById("pagina").appendChild(div);
     if (tipo=="radio" || tipo=="checkbox") {
         var labelMod = modelo.getElementsByTagName("label")[0];
         for (j = 0; j < o.length; j++) {
             //creamos elemento label
             var label = document.createElement("label");
             //definimos un valor for único, usando un contador 
             var valorFor = labelMod.getAttribute("for")+String(contadorLabelfor);
             contadorLabelfor+=1;
             label.setAttribute("for",valorFor);
             //copiamos el html del label
             label.innerHTML = labelMod.innerHTML;
             var input = label.getElementsByTagName("input")[0];
             input.setAttribute("id",valorFor)
             //añadimos el texto de la pregunta
             label.getElementsByClassName("opcion")[0].getElementsByTagName("span")[0].innerHTML = o[j].innerHTML;
             //añadimos el label al div correspondiente
             div.appendChild(label);
         }
         //ocultamos el modelo del label
         labelMod.setAttribute("hidden","");
     }
 }
 
 //ahora borramos las preguntas de los tipos
 for (t in tipos) {
     tipos[t].remove();
 }
 
 //ya se puede mostrar la pagina
 document.getElementById("pagina").removeAttribute("hidden");

 return;
 //NUMBER
 //Recuperamos el título y la respuesta correcta de Input, guardamos el número secreto
 var tituloInput=xmlDoc.getElementsByTagName("title")[0].innerHTML;
 ponerDatosInputHtml(tituloInput);
 numeroSecreto=parseInt(xmlDoc.getElementsByTagName("answer")[0].innerHTML);
 
 //SELECT
 //Recuperamos el título y las opciones, guardamos la respuesta correcta
 var tituloSelect=xmlDoc.getElementsByTagName("title")[1].innerHTML;
 var opcionesSelect = [];
 var nopt = xmlDoc.getElementById("mrl2").getElementsByTagName('option').length;
  for (i = 0; i < nopt; i++) { 
    opcionesSelect[i] = xmlDoc.getElementById("mrl2").getElementsByTagName('option')[i].innerHTML;
 }
 ponerDatosSelectHtml(tituloSelect,opcionesSelect);
 respuestaSelect=parseInt(xmlDoc.getElementsByTagName("answer")[1].innerHTML);

 //CHECKBOX
 //Recuperamos el título y las opciones, guardamos las respuestas correctas
 var tituloCheckbox = xmlDoc.getElementsByTagName("title")[2].innerHTML;
 var opcionesCheckbox = [];
 var nopt = xmlDoc.getElementById("mrl3").getElementsByTagName('option').length;
 for (i = 0; i < nopt; i++) { 
    opcionesCheckbox[i]=xmlDoc.getElementById("mrl3").getElementsByTagName('option')[i].innerHTML;
 }  
 contenedorCheckbox = document.getElementsByClassName("pregunta tipoCheckbox")[0];
 ponerDatosCheckboxHtml(tituloCheckbox,opcionesCheckbox,contenedorCheckbox);
 var nres = xmlDoc.getElementById("mrl3").getElementsByTagName('answer').length;
 for (i = 0; i < nres; i++) { 
  respuestasCheckbox[i]=xmlDoc.getElementById("mrl3").getElementsByTagName("answer")[i].innerHTML;
 }
}

//****************************************************************************************************
//implementación de la corrección

function corregirNumber(){
  //Vosotros debéis comparar el texto escrito con el texto que hay en el xml
  //en este ejemplo hace una comparación de números enteros
  var s=formElement.elements[0].value;     
  if (s==numeroSecreto) {
   darRespuestaHtml("P1: Exacto!");
   nota +=1;
  }
  else {
    if (s>numeroSecreto) darRespuestaHtml("P1: Te has pasado");
    else darRespuestaHtml("P1: Te has quedado corto");
  }
}

function corregirSelect(){
  //Compara el índice seleccionado con el valor del íncide que hay en el xml (<answer>2</answer>)
  //para implementarlo con type radio, usar value para enumerar las opciones <input type='radio' value='1'>...
  //luego comparar ese value con el value guardado en answer
  var sel = formElement.elements[1];  
  if (sel.selectedIndex-1==respuestaSelect) { //-1 porque hemos puesto una opción por defecto en el select que ocupa la posición 0
   darRespuestaHtml("P2: Correcto");
   nota +=1;
  }
  else darRespuestaHtml("P2: Incorrecto");
}

//Si necesitáis ayuda para hacer un corregirRadio() decirlo, lo ideal es que a podáis construirla modificando corregirCheckbox
function corregirCheckbox(){
  //Para cada opción mira si está checkeada, si está checkeada mira si es correcta y lo guarda en un array escorrecta[]
  var f=formElement;
  var escorrecta = [];
  for (i = 0; i < f.color.length; i++) {  //"color" es el nombre asignado a todos los checkbox
   if (f.color[i].checked) {
    escorrecta[i]=false;     
    for (j = 0; j < respuestasCheckbox.length; j++) {
     if (i==respuestasCheckbox[j]) escorrecta[i]=true;
    }
    //si es correcta sumamos y ponemos mensaje, si no es correcta restamos y ponemos mensaje.
    if (escorrecta[i]) {
     nota +=1.0/respuestasCheckbox.length;  //dividido por el número de respuestas correctas   
     darRespuestaHtml("P3: "+i+" correcta");    
    } else {
     nota -=1.0/respuestasCheckbox.length;  //dividido por el número de respuestas correctas   
     darRespuestaHtml("P3: "+i+" incorrecta");
    }   
   } 
  }
}

//****************************************************************************************************
// poner los datos recibios en el HTML
function ponerDatosInputHtml(t){
 document.getElementById("enviar").innerHTML = t;
}

function ponerDatosSelectHtml(t,opt){
  document.getElementById("enviar").innerHTML=t;
  var select = document.getElementsByTagName("select")[0];
  for (i = 0; i < opt.length; i++) { 
    var option = document.createElement("option");
    option.text = opt[i];
    option.value=i+1;
    select.options.add(option);
 }  
}

function ponerDatosCheckboxHtml(t,opt,checkboxContainer){
 checkboxContainer.getElementsByClassName('textPregunta')[0].innerHTML = t;
 for (i = 0; i < opt.length; i++) { 
    var outerHTML = document.getElementsByClassName("pregunta tipoCheckbox")[0].outerHTML;
    checkboxContainer.outerHTML(outerHTML);
 }  
}

//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(r){
 var p = document.createElement("p");
 var node = document.createTextNode(r);
 p.appendChild(node);
 document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota(){
   darRespuestaHtml("Nota: "+nota+" puntos sobre 3");
}

function inicializar(){
   document.getElementById('resultadosDiv').innerHTML = "";
   nota=0.0;
}

//Comprobar que se han introducido datos en el formulario
function comprobar(){
   var f=formElement;
   var checked=false;
   for (i = 0; i < f.color.length; i++) {  //"color" es el nombre asignado a todos los checkbox
      if (f.color[i].checked) checked=true;
   }
   if (f.elements[0].value=="") {
    f.elements[0].focus();
    alert("Escribe un número");
    return false;
   } else if (f.elements[1].selectedIndex==0) {
    f.elements[1].focus();
    alert("Selecciona una opción");
    return false;
   } if (!checked) {    
    document.getElementsByTagName("h3")[2].focus();
    alert("Selecciona una opción del checkbox");
    return false;
   } else  return true;
}


function mostrarError(error) {
    console.log("Error: "+error);
    if (mostrarerrores) {
    document.getElementById("errores").style.animationName = "animError";
    document.getElementById("errores").removeAttribute("hidden");
    document.getElementById("errores").getElementsByTagName("span")[0].innerHTML="No se ha podido cargar el examen ya que "+error;
    }
}
