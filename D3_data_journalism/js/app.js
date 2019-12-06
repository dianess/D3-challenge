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

// xScale function for updating x-scale when clicking on axis label
function xScale(censusData, chosenXAxis) {
    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

// yScale function for updating y-scale upon clicking on axis label
function yScale(censusData, chosenYAxis) {
    // Create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

// Load data from data.csv
d3.csv("../data/data.csv").then(function(censusData) {

    // Print data.csv
    console.log(censusData)

    //parse data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    })  //ends parsing data
});    // ends d3.csv read

