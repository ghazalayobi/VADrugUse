$(document).ready(function(){

  $('#menu').click(function(){
      $(this).toggleClass('fa-times');
      $('.navbar').toggleClass('nav-toggle');
  });

  $(window).on('load scroll',function(){
      $('#menu').removeClass('fa-times');
      $('.navbar').removeClass('nav-toggle');
  });

});


{
  const margin = {top: 30, right: 30, bottom: 65, left: 98},
      width = 800 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
  const svg = d3.select("#bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/ghazalayobi/CS-visual-analytics/main/assignment5/country_data.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 1100])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(d => d.Country))
    .padding(.4);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Country))
    .attr("width", d => x(d.Value))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")

});
}

{
  // set the dimensions and margins of the graph
  // set the dimensions and margins of the graph
  const width = 450,
  height = 450,
  margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Create dummy data
const data = {Male: 800, Female:950}

// set the color scale
const color = d3.scaleOrdinal()
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
const pie = d3.pie()
  .value(function(d) {return d[1]})
const data_ready = pie(Object.entries(data))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('mySlices')
  .data(data_ready)
  .join('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg
  .selectAll('mySlices')
  .data(data_ready)
  .join('text')
  .text(function(d){ return d.data[0]})
  .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 17)

  


}
{
// set the dimensions and margins of the graph
const width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#my_data")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

// Create dummy data
const data = {'18-24':592, '25-34':442,'35-44':338, '45-54':285, '55-64':91}

// set the color scale
const color = d3.scaleOrdinal()
  .domain(["18-24", "25-34", "35-44", "45-54", "55-64"])
  .range(d3.schemeDark2);

// Compute the position of each group on the pie:
const pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(d => d[1])
const data_ready = pie(Object.entries(data))

// The arc generator
const arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
const outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .join('path')
  .attr('d', arc)
  .attr('fill', d => color(d.data[1]))
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg
  .selectAll('allPolylines')
  .data(data_ready)
  .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      const posA = arc.centroid(d) // line insertion in the slice
      const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      const posC = outerArc.centroid(d); // Label position = almost the same as posB
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .join('text')
    .text(d => d.data[0])
    .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
    })
    .style('text-anchor', function(d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
  }

{
  const margin = {top: 30, right: 30, bottom: 98, left: 98},
      width = 800 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
// append the svg object to the body of the page
const svg = d3.select("#my_databar")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("../education_data.csv").then( function(data) {

// X axis
const x = d3.scaleBand()
.range([ 0, width ])
.domain(data.map(d => d.Education))
.padding(0.4);
svg.append("g")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Add Y axis
const y = d3.scaleLinear()
.domain([0, 800])
.range([ height, 0]);
svg.append("g")
.call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
.data(data)
.join("rect")
  .attr("x", d => x(d.Education))
  .attr("width", x.bandwidth())
  .attr("fill", "#404080")
  // no bar at the beginning thus:
  .attr("height", d => height - y(0)) // always equal to 0
  .attr("y", d => y(0))

// Animation
svg.selectAll("rect")
.transition()
.duration(800)
.attr("y", d => y(d.Value))
.attr("height", d => height - y(d.Value))
.delay((d,i) => {console.log(i); return i*100})

})

}













{

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 800 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  const svg = d3.select(".ascore")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left},${margin.top})`);

  
  // get the data
  d3.csv("https://raw.githubusercontent.com/ghazalayobi/CS-visual-analytics/main/assignment5/last_day_used.csv").then( function(data) {
      


    // X axis: scale and draw:
    const x = d3.scaleLinear()
        .domain([-4,4])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .style("font", "14px times")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
    // set the parameters for the histogram
    const histogram = d3.histogram()
        .value(function(d) { return +d.AScore; })   // I need to give the vector of AScore
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(40)); // then the numbers of bins
  
    // And apply twice this function to data to get the bins.
    const bins1 = histogram(data.filter( function(d){return d.gender === "F"} ));
    const bins2 = histogram(data.filter( function(d){return d.gender === "M"} ));
  
    // Y axis: scale and draw:
    const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, (d3.max(bins1, function(d) { return d.length; }) + 30)]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .style("font", "14px times")
        .call(d3.axisLeft(y));
  
    // append the bars for series 1
    svg.selectAll("rect")
        .data(bins1)
        .join("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")
          .style("opacity", 0.6)
  
    // append the bars for series 2
    svg.selectAll("rect2")
        .data(bins2)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#404080")
          .style("opacity", 0.6)
  
    // Handmade legend
    svg.append("circle").attr("cx",600).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
    svg.append("circle").attr("cx",600).attr("cy",60).attr("r", 6).style("fill", "#404080")
    svg.append("text").attr("x", 620).attr("y", 30).text("F").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 620).attr("y", 60).text("M").style("font-size", "15px").attr("alignment-baseline","middle")

    svg.append("text").attr("x", 200).attr("y", 12).text("Agreeableness Score").style("font-size", "3rem").attr("alignment-baseline","middle").attr('font-style', d => d)

  
  });
  
}

{

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 800 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  const svg = d3.select(".oscore")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left},${margin.top})`);

  
  // get the data
  d3.csv("https://raw.githubusercontent.com/ghazalayobi/CS-visual-analytics/main/assignment5/last_day_used.csv").then( function(data) {
      


    // X axis: scale and draw:
    const x = d3.scaleLinear()
        .domain([-4,4])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .style("font", "14px times")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
    // set the parameters for the histogram
    const histogram = d3.histogram()
        .value(function(d) { return +d.Oscore; })   // I need to give the vector of AScore
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(40)); // then the numbers of bins
  
    // And apply twice this function to data to get the bins.
    const bins1 = histogram(data.filter( function(d){return d.gender === "F"} ));
    const bins2 = histogram(data.filter( function(d){return d.gender === "M"} ));
  
    // Y axis: scale and draw:
    const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, (d3.max(bins1, function(d) { return d.length; }) + 30)]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .style("font", "14px times")
        .call(d3.axisLeft(y));
  
    // append the bars for series 1
    svg.selectAll("rect")
        .data(bins1)
        .join("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")
          .style("opacity", 0.6)
  
    // append the bars for series 2
    svg.selectAll("rect2")
        .data(bins2)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#404080")
          .style("opacity", 0.6)
  
    // Handmade legend
    svg.append("circle").attr("cx",600).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
    svg.append("circle").attr("cx",600).attr("cy",60).attr("r", 6).style("fill", "#404080")
    svg.append("text").attr("x", 620).attr("y", 30).text("F").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 620).attr("y", 60).text("M").style("font-size", "15px").attr("alignment-baseline","middle")

    svg.append("text").attr("x", 200).attr("y", 12).text("Openness Score").style("font-size", "3rem").attr("alignment-baseline","middle").attr('font-style', d => d)

  
  });
  
}





// set the dimensions and margins of the graph
const width = 450,
  height = 450,
  margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", `translate(${width/2},${height/2})`);

// Create dummy data
const data = {'18-24': 136, '25-34': 112, '35-44':109, '45-54':81, '55-64':31, '65+':5}

// set the color scale
const color = d3.scaleOrdinal()
.domain(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"])
.range(d3.schemeDark2);

// Compute the position of each group on the pie:
const pie = d3.pie()
.sort(null) // Do not sort group by size
.value(d => d[1])
const data_ready = pie(Object.entries(data))

// The arc generator
const arc = d3.arc()
.innerRadius(radius * 0.5)         // This is the size of the donut hole
.outerRadius(radius * 0.89)

// Another arc that won't be drawn. Just for labels positioning
const outerArc = d3.arc()
.innerRadius(radius * 0.9)
.outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
.selectAll('allSlices')
.data(data_ready)
.join('path')
.attr('d', arc)
.attr('fill', d => color(d.data[1]))
.attr("stroke", "white")
.style("stroke-width", "2px")
.style("opacity", 0.7)

// Add the polylines between chart and labels:
svg
.selectAll('allPolylines')
.data(data_ready)
.join('polyline')
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr('points', function(d) {
    const posA = arc.centroid(d) // line insertion in the slice
    const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
    const posC = outerArc.centroid(d); // Label position = almost the same as posB
    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    return [posA, posB, posC]
  })

// Add the polylines between chart and labels:
svg
.selectAll('allLabels')
.data(data_ready)
.join('text')
  .text(d => d.data[0])
  .attr('transform', function(d) {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
  })
  .style('text-anchor', function(d) {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
  })




// correlation matrix

{

  // Dimension of the whole chart. Only one size since it has to be square
  const marginWhole = {top: 10, right: 10, bottom: 10, left: 10},
      sizeWhole = 640 - marginWhole.left - marginWhole.right
  
  // Create the svg area
  const svg = d3.select("#my_corr")
    .append("svg")
      .attr("width", sizeWhole  + marginWhole.left + marginWhole.right)
      .attr("height", sizeWhole  + marginWhole.top + marginWhole.bottom)
    .append("g")
      .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);
  
  
  d3.csv("https://raw.githubusercontent.com/ghazalayobi/CS-visual-analytics/main/assignment5/data.csv").then( function(data) {
  
    // What are the numeric variables in this dataset? How many do I have
    const allVar = ["Nscore", "Escore", "Oscore", "AScore", "Cscore"]
    const numVar = allVar.length
  
    // Now I can compute the size of a single chart
    mar = 10
    size = sizeWhole / numVar
  
  
    // ----------------- //
    // Scales
    // ----------------- //
  
    // Create a scale: gives the position of each pair each variable
    const position = d3.scalePoint()
      .domain(allVar)
      .range([0, sizeWhole-size])
  
    // Color scale: give me a specie name, I return a color
    const color = d3.scaleOrdinal()
      .domain(["M", "F" ])
      .range([ "#69b3a2", "#404080"])
  
  
    // ------------------------------- //
    // Add charts
    // ------------------------------- //
    for (i in allVar){
      for (j in allVar){
  
        // Get current variable name
        const var1 = allVar[i]
        const var2 = allVar[j]
  
        // If var1 == var2 i'm on the diagonal, I skip that
        if (var1 === var2) { continue; }
  
        // Add X Scale of each graph
        xextent = d3.extent(data, function(d) { return +d[var1] })
        const x = d3.scaleLinear()
          .domain(xextent).nice()
          .range([ 0, size-2*mar ]);
  
        // Add Y Scale of each graph
        yextent = d3.extent(data, function(d) { return +d[var2] })
        const y = d3.scaleLinear()
          .domain(yextent).nice()
          .range([ size-2*mar, 0 ]);
  
        // Add a 'g' at the right position
        const tmp = svg
          .append('g')
          .attr("transform", `translate(${position(var1)+mar},${position(var2)+mar})`);
  
        // Add X and Y axis in tmp
        tmp.append("g")
          .attr("transform", `translate(0,${size-mar*2})`)
          .call(d3.axisBottom(x).ticks(3));
        tmp.append("g")
          .call(d3.axisLeft(y).ticks(3));
  
        // Add circle
        tmp
          .selectAll("myCircles")
          .data(data)
          .join("circle")
            .attr("cx", function(d){ return x(+d[var1]) })
            .attr("cy", function(d){ return y(+d[var2]) })
            .attr("r", 3)
            .attr("fill", function(d){ return color(d.gender)})
      }
    }
  
  
    // ------------------------------- //
    // Add variable names = diagonal
    // ------------------------------- //
    for (i in allVar){
      for (j in allVar){
        // If var1 == var2 i'm on the diagonal, otherwisee I skip
        if (i != j) { continue; }
        // Add text
        const var1 = allVar[i]
        const var2 = allVar[j]
        svg
          .append('g')
          .attr("transform", `translate(${position(var1)},${position(var2)})`)
          .append('text')
            .attr("x", size/2)
            .attr("y", size/2)
            .text(var1)
            .attr("text-anchor", "middle")
  
      }
    }
  })
  
  }