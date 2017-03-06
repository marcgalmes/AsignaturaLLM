var sortOrder = false;

function crearBarchart(datosx) {

    var barchart = {}

    //el width y el height
    barchart.w = document.body.offsetWidth*0.97-32-16;//calcular ancho de la pantalla
    barchart.h = 400;

    barchart.data = datos;//los datos

    barchart.xScale = d3.scale.ordinal();//escala x
    barchart.xScale.domain(
        d3.range(barchart.data.length)//range devuelve una lista hasta data length, [0,1,2,3,4,5]
    );
    barchart.xScale.rangeRoundBands(
        [0,barchart.w],
        0.1
    );


    barchart.yScale = d3.scale.linear();//escala linear, el dominio es [valor minimo, valor maximo]
    barchart.yScale.domain(
        [0,d3.max(barchart.data)]
    );
    barchart.yScale.range([barchart.h,0]);


    barchart.svg = d3.select("#chart").html("").append("svg");//crear elemento svg dentrode body
    //atributos de svg
    barchart.svg.attr("width",barchart.w)
    barchart.svg.attr("height",barchart.h);

    barchart.svg.on("click",function() {
        if (document.getElementById("insertar").checked) {
            var eleInput = document.getElementById("valorinsertar");
            var valor = parseInt(eleInput.value);
            if (valor!=NaN) {
                datos.push(valor);
                crearBarchart(datos);
            }
        } 
    })

    barchart.svg.selectAll("rect")//hacer select para los rects
    .data(barchart.data)//aqui van losdatos
    .enter()
    .append("rect")//crear <rect>
    .attr("x", function(d, i) {//atributo <rect x=> (donde se coloca horizontalmente)
        return barchart.xScale(i);
    })
    .attr("y", function(d) {//y es la posicion vertocal
        return barchart.yScale(d);
    })
    .attr("width", barchart.xScale.rangeBand())//width (anchos)
    .attr("height", function(d) {//height (alto)
        return barchart.h - barchart.yScale(d);
    })
    .attr("fill", function(d) {//color del rect
        return "rgb(0, 0, " + (d * 10) + ")";
    })
    .on("mouseover", function(d) {
        //Get this bar's x/y values, then augment for the tooltip
        var xPosition = parseFloat(d3.select(this).attr("x")) + barchart.xScale.rangeBand() / 2;
        var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + barchart.h / 2;

        //Update the tooltip position and value
        d3.select("#tooltip")
          .style("left", xPosition + "px")
          .style("top", yPosition + "px")
          .select("#value")
          .text(d);

        //Show the tooltip
        d3.select("#tooltip").classed("hidden",false)
    })
    .on("mouseout", function() {
        //Remove the tooltip
        d3.select("#tooltip").classed("hidden",true);
     })
    .on("click", function(d,i) {
        //esto lo aprtendi en lenguaje de marcas :D
        if (document.getElementById("borrar").checked) {
               datos.splice(i,1);
               crearBarchart(datos);
        } else {
            sortOrder = !sortOrder;
            sortBars(500);
        }

    });

    
    var sortBars = function(duration) {
        
        barchart.svg.selectAll("rect").sort(function(a,b){
            if (sortOrder) {
                return d3.ascending(a, b);
            } else {
                return d3.descending(a, b);
            }
        }).transition()
        .duration(duration)
        .attr("x",function(d,i) {
            return barchart.xScale(i);
        });
    };

    sortBars(0);

         //definir eje X
            var xAxis = d3.svg.axis()
                    .scale(barchart.xScale)
                    .orient("bottom")
                    .ticks(5);

            //definir eje Y
            var yAxis = d3.svg.axis()
                    .scale(barchart.yScale)
                    .orient("left")
                    .ticks(5);

            //crear eje x
            barchart.svg.append("g")
                    .attr("class", "axis")  //Assign "axis" class
                    .attr("transform", "translate(0," + (barchart.h - 0) + ")")
                    .call(xAxis);

            //crear eje Y
            barchart.svg.append("g")
                    .attr("class", "axis")  //Assign "axis" class
                    .attr("transform", "translate(" + 0 + ",0)")
                    .call(yAxis);

}

var datos = [10,20,30,20,50,40,90,80,30,50,30,40,70,30,70,30,20,30,20,30,20,30,070,30]

crearBarchart(datos)
