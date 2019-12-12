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

// Append a group area inside the margins set above
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

// renderAxesX function for updating xAxis with new information
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    // Include transition on page load
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}  //ends renderAxesX function

// renderAxesY function for updating yAxis with new information
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    // Include transition on page load
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}  //ends renderAxesY function

// renderCirlces function for updating circles group with a transition
// to new circles for change in x axis or y axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
}   //ends renderCircles function

// renderText function for updating state labels with a transition
// for change in x axis or y axis
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}  //ends renderText function

// Function to add units for each category in the hover box (using tooltips)
// ...not needed for y because they're all % and put directly into toolTip function
function styleX(value, chosenXAxis) {

    // Use percent for poverty
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    // Use U.S. dollars for household income
    else if (chosenXAxis === 'income') {
        return `$${value}`;
    }
    // Use a number for age
    else {
        return `${value}`;
    }
}

// Function for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // Select x-label
    // Poverty
    if (chosenXAxis === 'poverty') {
        var xLabel = "Poverty:";
    }
    // Household income (Median)
    else if (chosenXAxis === 'income') {
        var xLabel = "Median Income:";
    }
    // Age
    else {
        var xLabel = "Age:";
    }

    // Select y-label
    // Lacking healthcare
    if (chosenYAxis === 'healthcare') {
        var yLabel = "No Healthcare:"
    }
    // Obesity
    else if (chosenYAxis === 'obesity') {
        var yLabel = "Obesity:"
    }
    // Smokers
    else {
        var yLabel = "Smokers:"
    }

    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    // Add event for hovering over a circle
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

// Load data from data.csv
d3.csv("../D3_data_journalism/data/data.csv").then(function(censusData) {

    // Print data.csv
    //console.log(censusData)  // it works!

    //parse data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    })  //ends parsing data

        // Create first linear scales
        var xLinearScale = xScale(censusData, chosenXAxis);
        var yLinearScale = yScale(censusData, chosenYAxis);

        // Create initial axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append xAxis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Append yAxis
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 12)
            .attr("opacity", ".5");

        // Append initial text
        var textGroup = chartGroup.selectAll(".stateText")
            .data(censusData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", 3)
            .attr("font-size", "10px")
            .text(function(d){return d.abbr});

    // Create group for three different x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 25)
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age")
        .text("Age (Median)")

    var incomeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 75)
        .attr("value", "income")
        .text("Household Income (Median)")

    // Create group for three different y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 25)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 50)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokers (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 75)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");    
        
    // UpdateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // X-axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {
                console.log(value);

                // Replace chosenXAxis with value
                chosenXAxis = value;

                // Update xScale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                // Update xAxis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                // Update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
                // Update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                
                // Change classes to change x-axis labels to/from bold text,
                // depending which label was clicked
                if (chosenXAxis === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                }

            }  // ends "if value != chosenXAxis" statement
        })    // ends x "click"

    // X-axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenYAxis) {
                console.log(value);

            // Replace chosenYAxis with value
            chosenYAxis = value;

            // Update yScale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            // Update yAxis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            // Update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Update text with new y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Update tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // Change classes to change y-axis labels to/from bold text,
            // depending which label was clicked
            if (chosenYAxis === "obesity") {
                obesityLabel.classed("active", true).classed("inactive", false);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", true).classed("inactive", false);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", true).classed("inactive", false);
            }

            }  // ends "if value != chosenYAxis" statement
        })    // ends y "click"    
});    // ends d3.csv read       

