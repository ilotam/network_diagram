const d3 = require('d3');
const dscc = require('@google/dscc');
const local = require('./localMessage.js');

// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;


// parse the style value
const styleVal = (message, styleId) => {
    if (typeof message.style[styleId].defaultValue === "object") {
      return message.style[styleId].value.color !== undefined
        ? message.style[styleId].value.color
        : message.style[styleId].defaultValue.color;
    }
    return message.style[styleId].value !== undefined
      ? message.style[styleId].value
      : message.style[styleId].defaultValue;
};

const drawViz = message => {
  
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var tblList = message.tables.DEFAULT;
    var links = tblList.map(row => {
    
                
        return {
           
            source: row["metric"][0],   
            target:  row["metric"][1]
        }  
    });
    var nodes = tblList.map(row => {
    
                
        return {
            id: row["dimension"][0],
            name: row["dimension"][1]
           
        }  
    });

    console.log(links);
    console.log(nodes);
    //d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json", function( data) {
    //console.log(data);
    // Initialize the links
    var link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    var node = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
                .id(function(d) { return d.id; })                     // This provide  the id of a node
                .links(links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("tick", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x+6; })
            .attr("cy", function(d) { return d.y-6; });
    }

    
    

};
// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}