import React, { Component } from 'react';
import './css/Graph.css';
import * as d3 from "d3";
import ReactDOM from 'react-dom';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

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
        //console.log("componentDidMount LOG:"+ this.node);
    }

    componentDidUpdate() {
        this.createDynamicChart();
        //console.log("FREQ from componentDidMount: "+this.props.freq);
    }

    createDynamicChart() {
      console.log("this.props.hashtags: "+this.props.hashtags); 
      console.log("hashtag[#cats] :"+this.props.hashtags["cats"]);
      
      d3.selectAll("g").remove();
      var myData = this.props.freq;
      if (myData.length == 0) {
        return;
      }

        const node = this.node;


          var width = 1 * (document.getElementsByClassName('wrapper-left')[0].offsetWidth),
          //width = this.props.width - margin.left - margin.right,
          //width = this.referMe.offsetWidth,
          //width = ReactDOM.findDOMNode(this).offsetWidth - margin.left - margin.right,
          //width = this.props.svg.width - margin.left - margin.right,
          //width = d3.select('.svg').node().element.getBoundingClientRect().width - margin.left - margin.right,
          //height = document.getElementsByClassName('wrapper-left')[0].offsetHeight - 100 - document.getElementsByClassName('hashtags')[0].offsetHeight;
          height = width * 0.73,
          margin = {
            top: width/63, //~13
            right: 0,
            bottom: 0,
            left: width/27 //~30
          };
          document.getElementById('svg').style.height = height * 1;
          document.getElementById('svg').style.width = width * 1;

           {/*var svg = d3.select("body").append("svg")*/}
          var string = "0 0 "+width*1.125+" "+height*1.04
          var svg = d3.select(node)
          //.attr("width", width + margin.left + margin.right)
          //.attr("height", height + margin.top + margin.bottom)
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", string)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          let initialState = false;
          for (var key in this.props.hashtags) {
            if (this.props.hashtags[key]) {
              initialState = true;
            }
          }
          if (!initialState) {
            svg.append("text")
            .text("Please select hashtags below to track their frequency.")
            .attr("y", height/2)
            .attr("x", height/3)
            .attr("font-size", height/30 + "px")
            return;
          }

        var parseDate = d3.timeParse("%Y%m%d%H%M");

        var x = d3.scaleTime()
          .range([0, width]);

        var y = d3.scaleLinear()
          .range([height, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var xAxis = d3.axisBottom(x)
          .tickSize(height/120)

        //   var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");

        var yAxis = d3.axisLeft(y)
          .tickSize(height/120);


        //     var yAxis = d3.svg.axis()
        //       .scale(y)
        //       .orient("left");

        var line = d3.line()
          //.curve(d3.curveBasis) -- interpolates data
          .x(function(d) {
            return x(d.date);
          })
          .y(function(d) {
            return y(d.temperature);
          });

       // MOVE THE SVG CHUNK RIGHT HERE // 

        var data = d3.tsvParse(myData);

        color.domain(d3.keys(data[0]).filter(function(key) {
          return key !== "date";
        }));

        data.forEach(function(d) {
          d.date = parseDate(d.date);
          //d.date = d3.timeFormat("%Y%m%d%H%M")(d.date);
        });

        let hashtags = this.props.hashtags;
        var cities = color.domain().map(function(name) {
          console.log("name in line 263 :"+name);
          if (!hashtags[name.slice(1)]) {
            return {
              name: "",
              values: data.map(function(d) {
                return {
                  date: "",
                  temperature: null
                };
              })
            };
          }
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
          .attr('x', width*0.98)
          .attr('y', function(d, i) {
            return (i + 1) * height/20;
          })
          .attr('width', height/68)
          .attr('height', height/68)
          .style('fill', function(d) {
            if (d.name == "") 
              return "gray";
            return color(d.name);
          });

        legend.append('text')
          .attr('x', width*1)
          .attr('y', function(d, i) {
            return (i + 1.3) * height/20;
          })
          .attr("font-size", height/40 + "px")
          .text(function(d) {
            return d.name;
          });

        svg.append("g")
          .attr("class", "x axis")
          //.attr("transform", "translate(0," + height - 500 + ")")
          .call(xAxis)
          .attr("font-size", height/70 + "px")
          .style("stroke-width", height/430);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .attr("font-size", height/70 + "px")
          .style("stroke-width", height/430)
          .append("text")
          .attr("font-size", height/70 + "px")
          .attr("transform", "translate("+ height/30 +", 0)") // added
          .attr("y", height/100)
          .attr("x", -height/30)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("number of tweets")
          .style("fill", "#0F3A6F")
          .attr("transform", "rotate(-90)");

        var city = svg.selectAll(".city")
          .data(cities)
          .enter().append("g")
          .attr("class", "city");

        city.append("path")
          .attr("class", "line")
          .style("stroke-width", height/250)
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
          .attr("font-size", height/40 + "px")
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
          .attr("r", height/65)
          .style("stroke", function(d) {
            return color(d.name);
          })
          .style("fill", "none")
          .style("stroke-width", height/350+"px")
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
              .style("opacity", "1")
              .attr("font-size", height/35 + "px");
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
                //console.log(width/mouse[0])
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
            <div className={"Graph"}>
            <div id="svg"><svg ref={node => this.node = node}></svg></div>
            </div>
        );
    }
}

export default Graph;
