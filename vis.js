"use strict"

var width,height
var chartWidth, chartHeight
var margin
var svg = d3.select("#graph").append("svg")
var chartLayer = svg.append("g").classed("chartLayer", true)

main()

function main() {
   let projects = {
       nodes: [
           {label: "About", r: 20},
           {label: "Publications", r: 20},
           {label: "TagRefinery", r: 50},
           {label: "Scope", r: 50},
           {label: "Contact", r: 20},
       ],
       links: [
           {"source": "0", "target": "1" },
           {"source": "1", "target": "2" },
           {"source": "2", "target": "3" },
           {"source": "3", "target": "4" },
       ]
   }

   console.log(projects)
   setSize(projects)
   drawChart(projects)
}

function setSize(data) {
   width = document.querySelector("#graph").clientWidth
   height = document.querySelector("#graph").clientHeight

   margin = {top:0, left:0, bottom:0, right:0 }


   chartWidth = width - (margin.left+margin.right)
   chartHeight = height - (margin.top+margin.bottom)

   svg.attr("width", width).attr("height", height)

   chartLayer
       .attr("width", chartWidth)
       .attr("height", chartHeight)
       .attr("transform", "translate("+[margin.left, margin.top]+")")
}

function drawChart(data) {
   var simulation = d3.forceSimulation()
       .force("link", d3.forceLink().id(function(d) { return d.index }))
       .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
       .force("charge", d3.forceManyBody())
       .force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2))
       .force("y", d3.forceY(0))
       .force("x", d3.forceX(0))

   var link = svg.append("g")
       .attr("class", "links")
       .selectAll("line")
       .data(data.links)
       .enter()
       .append("line")
       .attr("stroke", "black")

       var arc = d3.symbol()
            .type(d3.symbolTriangle)
            .size(function(d) {
                return d.r;
            });

   var node = svg.append("g")
       .attr("class", "nodes")
       .selectAll("path")
       .data(data.nodes)
       .enter().append("path")
       .attr("d", arc)
       .call(d3.drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));


   var ticked = function() {
       link
           .attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

       node
            .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"; });
        //    .attr("cx", function(d) { return d.x; })
        //    .attr("cy", function(d) { return d.y; });
   }

   simulation
       .nodes(data.nodes)
       .on("tick", ticked);

   simulation.force("link")
       .links(data.links);

   function dragstarted(d) {
       if (!d3.event.active) simulation.alphaTarget(0.3).restart();
       d.fx = d.x;
       d.fy = d.y;
   }

   function dragged(d) {
       d.fx = d3.event.x;
       d.fy = d3.event.y;
   }

   function dragended(d) {
       if (!d3.event.active) simulation.alphaTarget(0);
       d.fx = null;
       d.fy = null;
   }

}
