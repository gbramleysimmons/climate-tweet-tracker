import React, { Component } from 'react';
import './css/Graph.css';
import * as d3 from "d3";
import ReactDOM from 'react-dom';

/**
 * Graph component. Does nothing right now.
 * @author Grace
 */

class Graph extends Component {
    constructor(props) {
        super(props)
           this.createDynamicChart = this.createDynamicChart.bind(this);
           this.referMe = React.createRef();
    }

    componentDidMount() {
        this.createDynamicChart();
        //this.node.width = document.getElementsByClassName('wrapper-left')[0].offsetWidth;
        console.log("componentDidMount LOG:"+ this.node);
    }

    componentDidUpdate() {
        this.createDynamicChart();
    }

    createDynamicChart() {
var myData = "date	#cats	#climate	#hi\n\
201110011235	63	62	72\n\
201110011240	58	59	67\n\
201110011245	53	59	69\n\
201110011250	55	58	68\n\
201110011255	64	58	72\n\
201110011300	58	57	77\n\
201110011305	57.9	56.7	82.3\n\
201110011310	61.8	56.8	78.9\n\
201110011315	69.3	56.7	68.8\n\
201110011320	71.2	60.1	68.7\n\
201110011325	68.7	61.1	70.3\n\
201110011330	61.8	61.5	75.3\n\
201110011335	63.0	64.3	76.6\n\
201110011340	66.9	67.1	66.6\n\
201110011345	61.7	64.6	68.0\n\
201110011350	61.8	61.6	70.6\n\
201110011355	62.8	61.1	71.1\n\
201110011400	60.8	59.2	70.0\n\
201110011405	62.1	58.9	61.6\n\
201110011410	65.1	57.2	57.4\n\
201110011415	55.6	56.4	64.3\n\
201110011420	54.4	60.7	72.4\n";

        const node = this.node;

        var margin = {
            top: 20,
            right: 0,
            bottom: 0,
            left: 0
          },
          width = document.getElementsByClassName('wrapper-left')[0].offsetWidth,
          //width = this.props.width - margin.left - margin.right,
          //width = this.referMe.offsetWidth,
          //width = ReactDOM.findDOMNode(this).offsetWidth - margin.left - margin.right,
          //width = this.props.svg.width - margin.left - margin.right,
          //width = d3.select('.svg').node().element.getBoundingClientRect().width - margin.left - margin.right,
          height = this.props.height - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%Y%m%d%H%M");

        var x = d3.scaleTime()
          .range([0, width]);

        var y = d3.scaleLinear()
          .range([height, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var xAxis = d3.axisBottom(x);

        //   var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");

        var yAxis = d3.axisLeft(y);

        //     var yAxis = d3.svg.axis()
        //       .scale(y)
        //       .orient("left");

        var line = d3.line()
          //.curve(d3.curveBasis)
          .x(function(d) {
            return x(d.date);
          })
          .y(function(d) {
            return y(d.temperature);
          });

        {/*var svg = d3.select("body").append("svg")*/}
        var svg = d3.select(node)
          //.attr("width", width + margin.left + margin.right)
          //.attr("height", height + margin.top + margin.bottom)
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 600 400")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = d3.tsvParse(myData);

        color.domain(d3.keys(data[0]).filter(function(key) {
          return key !== "date";
        }));

        data.forEach(function(d) {
          d.date = parseDate(d.date);
          //d.date = d3.timeFormat("%Y%m%d%H%M")(d.date);
        });

        var cities = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
              return {
                date: d.date,
                temperature: +d[name]
              };
            })
          };
        });

        x.domain(d3.extent(data, function(d) {
          return d.date;
        }));

        y.domain([
          d3.min(cities, function(c) {
            return d3.min(c.values, function(v) {
              return v.temperature;
            });
          }),
          d3.max(cities, function(c) {
            return d3.max(c.values, function(v) {
              return v.temperature;
            });
          })
        ]);

        var legend = svg.selectAll('g')
          .data(cities)
          .enter()
          .append('g')
          .attr('class', 'legend');

        legend.append('rect')
          .attr('x', width - 100)
          .attr('y', function(d, i) {
            return i * 20;
          })
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', function(d) {
            return color(d.name);
          });

        legend.append('text')
          .attr('x', width - 88)
          .attr('y', function(d, i) {
            return (i * 20) + 9;
          })
          .text(function(d) {
            return d.name;
          });

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height - 500 + ")")
          .call(xAxis);

        // svg.append("g")
        //   .attr("class", "y axis")
        //   .call(yAxis)
        //   .append("text")
        //   .attr("transform", "rotate(-90)")
        //   .attr("transform", "translate("+ 20 +", 0)") // added
        //   .attr("y", 6)
        //   .attr("dy", ".71em")
        //   .style("text-anchor", "end")
        //   .text("Temperature (ºF)");

        var city = svg.selectAll(".city")
          .data(cities)
          .enter().append("g")
          .attr("class", "city");

        city.append("path")
          .attr("class", "line")
          .attr("d", function(d) {
            return line(d.values);
          })
          .style("stroke", function(d) {
            return color(d.name);
          });

        city.append("text")
          .datum(function(d) {
            return {
              name: d.name,
              value: d.values[d.values.length - 1]
            };
          })
          .attr("transform", function(d) {
            return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
          })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) {
            return d.name;
          });

        var mouseG = svg.append("g")
          .attr("class", "mouse-over-effects");

        mouseG.append("path") // this is the black vertical line to follow mouse
          .attr("class", "mouse-line")
          .style("stroke", "black")
          .style("stroke-width", "1px")
          .style("opacity", "0");

        var lines = this.props.lines;

        var mousePerLine = mouseG.selectAll('.mouse-per-line')
          .data(cities)
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
          .attr("r", 7)
          .style("stroke", function(d) {
            return color(d.name);
          })
          .style("fill", "none")
          .style("stroke-width", "1px")
          .style("opacity", "0");

        mousePerLine.append("text")
          .attr("transform", "translate(10,3)");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
          .attr('width', width) // can't catch mouse events on a g element
          .attr('height', height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
              .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
              .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
              .style("opacity", "0");
          })
          .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
              .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
              .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
              .style("opacity", "1");
          })
          .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
              .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
              });

            d3.selectAll(".mouse-per-line")
              .attr("transform", function(d, i) {
                console.log(width/mouse[0])
                var xDate = x.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.date; }).right;
                    let idx = bisect(d.values, xDate);

                var beginning = 0,
                    end = lines[i].getTotalLength(),
                    target = null;

                let pos;
                while (true){
                  target = Math.floor((beginning + end) / 2);
                  pos = lines[i].getPointAtLength(target);
                  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                      break;
                  }
                  if (pos.x > mouse[0])      end = target;
                  else if (pos.x < mouse[0]) beginning = target;
                  else break; //position found
                }

                d3.select(this).select('text')
                  .text(y.invert(pos.y).toFixed(2));

                return "translate(" + mouse[0] + "," + pos.y +")";
              });
          });
    }


    render() {
        console.log("lines:"+ this.props.lines);
        console.log("width:"+ this.props.width);
        return (
            <div id="svg"><svg ref={node => this.node = node}></svg></div>
        );
    }
}

export default Graph;
