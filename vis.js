"use strict"

var width,height
var chartWidth, chartHeight
var margin

main()

function main() {
    let svg = d3.select("#graph").append("svg")
    let chartLayer = svg.append("g").classed("chartLayer", true)

   let projects = {
       nodes: [
           {label: "About", r: 100, icon: "far fa-user", url: "about.html"},
           {label: "Publications", r: 100, icon: "fas fa-flask", url: "publications.html"},
           {label: "Teaching", r: 100, icon: "fas fa-university", url: "teaching.html"},
           {label: "Contact", r: 100, icon: "far fa-envelope", url: "contact.html"},
           {label: "TagRefinery", r: 160, icon: "fas fa-cogs", url: "http://tagrefinery.cs.univie.ac.at/"},
           {label: "Scope", r: 160, icon: "far fa-chart-bar", url: "http://scope.ai/"},
           {label: "Blackbox Viewer", r: 160, icon: "fas fa-search", url: "https://christoph.github.io/blackbox_viewer/"},
       ],
       links: [
           {"source": "0", "target": "1" },
           {"source": "1", "target": "2" },
           {"source": "2", "target": "3" },
           {"source": "3", "target": "0" },
           {"source": "0", "target": "4" },
           {"source": "4", "target": "5" },
           {"source": "5", "target": "6" },
           {"source": "6", "target": "4" },
       ]
   }

   setSize(projects, svg, chartLayer)
   drawChart(projects, svg)
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function setSize(data, svg, chartLayer) {
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

function drawChart(data, svg) {
   var simulation = d3.forceSimulation()
       .force("link", d3.forceLink().id(function(d) { return d.index }).distance(5).strength(0.9))
       .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
       .force("charge", d3.forceManyBody())
       .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
       .force("y", d3.forceY(0))
       .force("x", d3.forceX(0))

   var link = svg
       .selectAll(".link")
       .data(data.links)
       .enter().append("g")
       .attr("class", "link")
       .append("path");

   var arc = d3.symbol()
        .type(d3.symbolTriangle)
        .size(function(d) {
            return d.r * d.r;
        });

   var node = svg.selectAll(".nodes")
       .data(data.nodes)
       .enter().append("g")
       .attr("class", "nodes")
       .call(d3.drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended))

      node.append("svg:image")
          .attr("xlink:href",  function(d) { return "images/triangle.png";})
            .attr("x", function(d) { return -25;})
            .attr("y", function(d) { return -25;})
            .attr("height", 100)
            .attr("width", 100)
            .attr("transform", function(d) {
                if(d.r == 160) {
                    d3.select(this)
                        .attr("class", "big")
                    return "rotate(0) scale(2.5) translate(-25, -35)"
                }
                else {
                    d3.select(this)
                        .attr("class", "small")
                    return "rotate(60) scale(1.5) translate(-30, -35)"
                }
            })
            .on("mouseover", function(d) {
                 d3.select(this).style("cursor", "pointer");
                 if(d.r == 160) {
                   d3.select(this).transition().attr("transform", "rotate(60) scale(2.8) translate(-25, -32)")
                 }
                 else {
                   d3.select(this).transition().attr("transform", "rotate(0) scale(2) translate(-27, -38)")
                 }
             })
           .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default");
                if(d.r == 160) {
                  d3.select(this).transition().attr("transform", "rotate(0) scale(2.5) translate(-25, -35)")
                }
                else {
                  d3.select(this).transition().attr("transform", "rotate(60) scale(1.5) translate(-30, -35)")
                }
            })
            .on("click", function(d) {
                location.href=d.url
            })


    node.append("a")
    .attr("class",  function(d) {
        if(d.r == 160) {
            return "big"
        }
        else {
            return "small"
        }
    })
    .attr("xlink:href",function(d) { return d.url })
    .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", function(d) {
            if(d.r == 160) {
                return 40
            }
            else {
                return -15
            }
        })
        .text(function(d) {
            return d.label;
        });

    node
    .append("a")
    .attr("width", 100)
    .attr("class", "icon")
    .attr("xlink:href",function(d) { return d.url })
    .append('i')
    .attr("fill", "white")
    .attr("class", function(d) { return d.icon })
    .attr("x", function(d) {
        if(d.r == 160) {
            return -25
        }
        else {
            return -16
        }
    })
    .attr("y", function(d) {
        if(d.r == 160) {
            return -30
        }
        else {
            return -8
        }
    })
    .attr("height", function(d) {
        if(d.r == 160) {
            return 40
        }
        else {
            return 25
        }
    })
    .attr("width", function(d) {
        if(d.r == 160) {
            return 40
        }
        else {
            return 25
        }
    })

   var ticked = function() {
       link.attr("d", linkArc);

       node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"; });
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
