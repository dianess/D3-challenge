//Define SVG area with hard-coded dimensions
var svgWidth = 960;
var svgHeight = 620;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
  };

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom; 

// Append a div classed chart to the scatter id named in html
var chart = d3.select("#scatter").append("div").classed("chart", true);

// Append an SVG element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append a group area with it's area inside the margins set above
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  
    
// Set initial parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";    