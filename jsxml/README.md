# jsxml

v.10 modificada función de corregirCheckbox: en un bucle, añadida funcion comprobar() para comprobar si hemos introducido datos

v.9 se ha añadido css responsive y adaptativo (mínimo) para tomar como referencia

v.8 se han comentado las funciones de corrección

v.7 añadido título html (h3 tituloCheckbox)

v.6 varias simplificaciones, cambio de "childNodes[0].nodeValue" al equivalente "innerHTML".

v.5 Se ha incluido el cálculo de la nota final y su presentación.

v.4 Se ha dividido la carga de datos dos partes, la recepción y la presentación. Se han modificado los nombres de las variables para ser más descriptivas.

v.3 Se ha añadido un div en el que se cargan todas las opciones de tipo checkbox. Se han creado funciones para corregir cada tipo de pregunta, y para separar la carga de datos (I) la corrección (II) y la presentación de resultados (III). La presentación de los resultados se hace en un div.

v.2 Se ha añadido un elemento select al html y código js para leer el título y las opciones de tipo select y rellenar el select html. Además guarda la respuesta correcta para poder comprobar que la opción seleccionada es la correcta.

v.1 Primero carga el fichero html que contiene la referencia a un js, al cargar (window.onload), js pide los datos a preguntas.xml, el título y el número secreto, los parsea y luego pone dentro del html el título y guarda en una variable secret el valor suministrado.

Al ejecutarse la aplicación da una respuesta en función de lo que ponemos, si es mayor, menor o coincide con el número secreto.
