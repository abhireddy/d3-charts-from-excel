function drawChart(filename, charttype) {
  //calculate chart dimensions and margins
  bodyMargin = { top: parseInt($("body").css("margin-top")),
                      bottom: parseInt($("body").css("margin-bottom")),
                      left: parseInt($("body").css("margin-left")),
                      right: parseInt($("body").css("margin-right")) };

  //getMargins(filename);

  margin = {top: 20, right: 20, bottom: 40, left: 80},
    ww = Math.min(window.innerWidth, 900), // document.getElementById("chart").clientWidth,
    hh = Math.min(window.innerHeight, 900), //document.getElementById("chart").clientHeight,
    width = ww - margin.left - margin.right - bodyMargin.left - bodyMargin.right, //$("body").css("margin-left") - $("body").css("margin-right"),
    height = hh - margin.top - margin.bottom - $("body").outerHeight( true ) - 3; // for some reason there's still vertical scroll if i don't subtract 3px...
  
    console.log($("body").outerHeight( true ));
  //determine the user's chart type
  if (charttype == "stacked-bar") {
    drawStackedBar(filename);
  } else if (charttype == "line") {
    drawLine(filename);
  } else if (charttype == "scatter") {
    drawScatter(filename);
  }
  else {
    alert("invalid chart type");
  }
}

function adjustLeftMargin() {
  //figure out the max pixel length of the Y axis labels we just drew
  var maxLabel = 0;
  var yTicks = $(".ytick").each(function() { maxLabel = Math.max(maxLabel, this.clientWidth); });

  var newMargin = margin;
  newMargin.left = maxLabel + 20 + 30;
  width -= newMargin.left - margin.left;
  margin.left = newMargin.left;
  
  //adjust the margins based on the Y axis labels
  d3.selectAll(".primary-g")
  .attr("transform", "translate(" + newMargin.left + "," + margin.top + ")");
}

function drawLine(filename) {
  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "primary-g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    var columns = d3.keys(data[0]);

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== columns[0]; }));

    data.forEach(function(d) {
      d[columns[0]] = new Date(d[columns[0]]);
    });

    var lines = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {name: name, date: d[columns[0]], yVal: +d[name]};
        })
      };
    });

    var line = d3.svg.line()
      //.interpolate("basis") // this makes the lines look smooth
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.yVal); });

    x.domain(d3.extent(data, function(d) { return d[columns[0]]; }));
    y.domain([
      d3.min(lines, function(c) { return d3.min(c.values, function(v) { return v.yVal; }); }),
      d3.max(lines, function(c) { return d3.max(c.values, function(v) { return v.yVal; }); })
    ]);

    //draw Y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text") 
      .attr("class", "ytick");

    adjustLeftMargin();
    
    //if there's only 1 set of Y values, add a label to the Y axis
    if (columns.length == 2) {
      var labelOffset = 0 - margin.left + 20; // label font = 20px
      svg.selectAll(".axis")
        .append("text")
          .attr("class", "y-label")
          .attr("transform", "rotate(-90)")
          .attr("y", labelOffset)
          .attr("dy", 0)
          .style("text-anchor", "end")
          .text(columns[1]);
    }

    //draw X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "x-label")
        .attr("x", width)
        .attr("y", 40)
        .text(columns[0]);

    //create a g element for each line
    var chartLine = svg.selectAll(".chartLine")
          .data(lines)
        .enter().append("g")
          .attr("class", "chartLine");

    //create a path within each g element
    chartLine.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });


    var linePoints = svg.selectAll(".linePoints")
          .data(lines)
        .enter().append("g")
          .attr("class", "linePoints");

    linePoints.selectAll("circle")
        .data(function(d) { return d.values; })
      .enter().append("circle")
        .attr("class", "lineCircle")
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.yVal); })
        .attr("r", 5)
        .style("fill", function(d) { return color(d.name); });

    $("circle").tipsy({ 
      gravity: 'w',
      html: true, 
      title: function() {
        var d = this.__data__;
        return d.name + ": " + d.yVal + "<br/>" + columns[0] + ": " + d.date.toLocaleDateString();
      }
    });
  });
}

 function drawStackedBar(filename) {
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.4)

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20c();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
      //.tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

  // An SVG element with a bottom-right origin.
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    var columns = d3.keys(data[0]);

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== columns[0]; }));
    
    data.forEach(function(d) {
      var y0 = 0;
      d.bars = color.domain().map(function(name) { return {xval: d[columns[0]], name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.bars[d.bars.length - 1].y1;
    });
    
    x.domain(data.map(function(d) { return d[columns[0]]; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    //draw Y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text") 
      .attr("class", "ytick");

    adjustLeftMargin();

    //if there's only 1 set of Y values, add a label to the Y axis
    if (columns.length == 2) {
      var labelOffset = 0 - margin.left + 20; // label font = 20px
      svg.selectAll(".axis")
        .append("text")
          .attr("class", "y-label")
          .attr("transform", "rotate(-90)")
          .attr("y", labelOffset)
          .attr("dy", 0)
          .style("text-anchor", "end")
          .text(columns[1]);
    }

    //draw X-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "x-label")
        .attr("x", width)
        .attr("y", 40)
        .text(columns[0]);

    var bars = svg.selectAll(".bars")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d[columns[0]]) + ",0)"; });

    bars.selectAll("rect")
        .data(function(d) { return d.bars; })
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) {return y(d.y0) - y(d.y1); })
        .attr("stroke-width", 2)
        .attr("stroke", "white")
        .style("fill", function(d) { return color(d.name); });

    //tool tip box
    $("rect").tipsy({ 
      gravity: 's',
      html: true, 
      title: function() {
          var d = this.__data__;
          var yval = d.y1 - d.y0;
          if (d.name == columns[columns.length - 1]) {
            return d.xval + "<br/>" + d.name + ": " + yval + "<br/>Total: " + d.y1;
          } else {
            return d.xval + "<br/>" + d.name + ": " + yval;
          }
      }
    });

    //draw horizontal comparison line on hover
    /*
    $("rect").mouseenter( function() {
      var d = this.__data__,
          yshift = y(d.y1), 
          xshift = margin.left + width;

      state.append("line")
      .attr("x1", 0)
      .attr("y1", yshift)
      .attr("x2", width)
      .attr("y2", yshift)
      .attr("stroke-width", 1)
      .attr("stroke", "#ffff66")
      //.attr("stroke-dasharray", "5, 5")
      .attr("class", "hoverline");
    });
    $("rect").mouseleave( function() {
      d3.selectAll(".hoverline").remove();
    });
    */     
  });
}

function drawScatter(filename) {
  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(filename, function(error, data) {
    if (error) throw error;
    columns = d3.keys(data[0]);
  });


  d3.csv(filename, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      columns.forEach(function(c) {
        d[c] = +d[c];
      });
    });

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== columns[0]; }));

    var datasets = color.domain().map(function(name) {
      return {
        values: data.map(function(d) {
          return {xData: d[columns[0]], yData: d[name], name: name };
        })
      };
    });

    //alert(datasets[0].name);

    x.domain(d3.extent(data, function(d) { return d[columns[0]]; })).nice();

    y.domain([
      d3.min(datasets, function(c) { return d3.min(c.values, function(v) { return v.yData; }); }),
      d3.max(datasets, function(c) { return d3.max(c.values, function(v) { return v.yData; }); })
    ]).nice();

    //draw X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "x label")
        .attr("x", width)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text(columns[0]);

    if (columns.length == 2) {
      var labelOffset = 0 - margin.left + 20; // label font = 20px

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "y-label")
        .attr("transform", "rotate(-90)")
        .attr("y", labelOffset)
        .attr("dy", 0)
        .style("text-anchor", "end")
        .text(columns[1]);
    } else {
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    }

    var series = svg.selectAll(".series")
        .data(datasets)
      .enter().append("g")
        .attr("class", "series");

    series.selectAll("circle")
        .data(function(d) { return d.values; })
      .enter().append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.xData); })
        .attr("cy", function(d) { return y(d.yData); })
        .style("fill", function(d) { return color(d.name); });

    $("circle").tipsy({ 
      gravity: 's',
      html: true, 
      title: function() {
        var d = this.__data__;
        return columns[0] + ": " + d.xData + "<br/>" + d.name + ": " + d.yData;
      }
    });
  });
}