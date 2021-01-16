var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/data/data.csv").then(function(data){
  console.log(data)
  // parse out poverty, healthcare, and state abbrev data
  data.forEach(item =>{

    item.poverty = +item.poverty
    item.healthcare = +item.healthcare
  })

  // Create scale function
  let xLinearScale = d3.scaleLinear().
  domain([8,d3.max(data, d=> d.poverty)])
  .range([0,width])

  let yLinearScale = d3.scaleLinear()
  .domain([0,d3.max(data, d=>d.healthcare)])
  .range([height,0])

  //create axis functions
  let bottomAxis = d3.axisBottom(xLinearScale)
  let leftAxis = d3.axisLeft(yLinearScale)

  //add axes to chart
  chartGroup.append('g').attr('transform',`translate(0,${height})`).call(bottomAxis)
  chartGroup.append('g').call(leftAxis)


//create circles
let circleGroup = chartGroup.selectAll('circle')
.data(data)
.enter()
.append('circle')
.attr('cx',d=>xLinearScale(d.poverty))
.attr('cy',d=>yLinearScale(d.healthcare))
.attr('r','15')
.attr('opacity','.8')
.attr('fill', 'steelblue')

//create labels of state abbr within circle 
chartGroup.append("g")
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xLinearScale(d.poverty))
  .attr("y",d=>yLinearScale(d.healthcare))
  .attr('font-size','10')
  .attr('fill','white')
  .attr("text-anchor", "middle")
  .attr('font-weight',1000)


// Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "axisText")  
  .text("Lacks Healthcare (%)");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");

})

//need to add abbrev text to center of circle and also tool tip 