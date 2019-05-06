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
        console.log("componentDidMount LOG:"+ this.node);
    }

    componentDidUpdate() {
        this.createDynamicChart();
        console.log("FREQ from componentDidMount: "+this.props.freq);
    }

    createDynamicChart() {
      var myData = this.props.freq;
      if (myData.length == 0) {
        return;
      }
      console.log("MYDATA FROM Graph.JS "+myData);
// var myData = "date	#cats	#climate	#hi\n\
// 201110011200	58	57	77\n\
// 201110011205	57.9	56.7	77\n\
// 201110011210	61.8	56.8	78.9\n\
// 201110011215	69.3	56.7	68.8\n\
// 201110011220	71.2	60.1	68.7\n\
// 201110011225	68.7	61.1	70.3\n\
// 201110011230	61.8	61.5	75.3\n\
// 201110011235	63	62	72\n\
// 201110011240	58	59	67\n\
// 201110011245	55	59	69\n\
// 201110011250	55	58	68\n\
// 201110011255	64	58	72\n\
// 201110011300	58	57	77\n\
// 201110011305	57.9	56.7	77\n\
// 201110011310	61.8	56.8	78.9\n\
// 201110011315	69.3	56.7	68.8\n\
// 201110011320	71.2	60.1	68.7\n\
// 201110011325	68.7	61.1	70.3\n\
// 201110011330	61.8	61.5	75.3\n\
// 201110011335	63.0	64.3	76.6\n\
// 201110011340	66.9	67.1	66.6\n\
// 201110011345	61.7	64.6	68.0\n\
// 201110011350	61.8	61.6	70.6\n\
// 201110011355	62.8	61.1	71.1\n\
// 201110011400	60.8	59.2	70.0\n\
// 201110011405	62.1	58.9	61.6\n\
// 201110011410	65.1	57.2	57.4\n\
// 201110011415	55.6	56.4	64.3\n\
// 201110011420	54.4	60.7	72.4\n\
// 201110011425	54.4	60.7	72.4\n\
// 201110011430	54.4	60.7	72.4\n\
// 201110011435	63	62	72\n\
// 201110011440	58	59	67\n\
// 201110011445	55	59	69\n\
// 201110011450	55	58	68\n\
// 201110011455	64	58	72\n\
// 201110011500	58	57	77\n\
// 201110011505	57.9	56.7	77\n\
// 201110011510	61.8	56.8	78.9\n\
// 201110011515	69.3	56.7	68.8\n\
// 201110011520	71.2	60.1	68.7\n\
// 201110011525	68.7	61.1	70.3\n\
// 201110011530	61.8	61.5	75.3\n\
// 201110011535	63.0	64.3	76.6\n\
// 201110011540	66.9	67.1	66.6\n\
// 201110011545	61.7	64.6	68.0\n\
// 201110011550	61.8	61.6	70.6\n\
// 201110011555	62.8	61.1	71.1\n\
// 201110011600	60.8	59.2	70.0\n\
// 201110011605	62.1	58.9	61.6\n\
// 201110011610	65.1	57.2	57.4\n\
// 201110011615	55.6	56.4	64.3\n\
// 201110011620	54.4	60.7	72.4\n\
// 201110011625	54.4	60.7	72.4\n\
// 201110011630	54.4	60.7	72.4\n\
// 201110011635	63.0	64.3	76.6\n\
// 201110011640	66.9	67.1	66.6\n\
// 201110011645	61.7	64.6	68.0\n\
// 201110011650	61.8	61.6	70.6\n\
// 201110011655	62.8	61.1	71.1\n\
// 201110011700	60.8	59.2	70.0\n\
// 201110011705	62.1	58.9	61.6\n\
// 201110011710	65.1	57.2	57.4\n\
// 201110011715	55.6	56.4	64.3\n\
// 201110011720	54.4	60.7	72.4\n\
// 201110011725	54.4	60.7	72.4\n\
// 201110011730	54.4	60.7	72.4\n\
// 201110011735	63.0	64.3	76.6\n\
// 201110011740	66.9	67.1	66.6\n\
// 201110011745	61.7	64.6	68.0\n\
// 201110011750	61.8	61.6	70.6\n\
// 201110011755	62.8	61.1	71.1\n\
// 201110011800	60.8	59.2	70.0\n\
// 201110011805	62.1	58.9	61.6\n\
// 201110011810	65.1	57.2	57.4\n\
// 201110011815	55.6	56.4	64.3\n\
// 201110011820	54.4	60.7	72.4\n\
// 201110011825	54.4	60.7	72.4\n\
// 201110011830	54.4	60.7	72.4\n\
// 201110011835	63.0	64.3	76.6\n\
// 201110011840	66.9	67.1	66.6\n\
// 201110011845	61.7	64.6	68.0\n\
// 201110011850	61.8	61.6	70.6\n\
// 201110011855	62.8	61.1	71.1\n\
// 201110011900	60.8	59.2	70.0\n\
// 201110011905	62.1	58.9	61.6\n\
// 201110011910	65.1	57.2	57.4\n\
// 201110011915	55.6	56.4	64.3\n\
// 201110011920	54.4	60.7	72.4\n\
// 201110011925	54.4	60.7	72.4\n\
// 201110011930	54.4	60.7	72.4\n\
// 201110011935	63.0	64.3	76.6\n\
// 201110011940	66.9	67.1	66.6\n\
// 201110011945	61.7	64.6	68.0\n\
// 201110011950	61.8	61.6	70.6\n\
// 201110011955	62.8	61.1	71.1\n\
// 201110012000	60.8	59.2	70.0\n\
// 201110012005	62.1	58.9	61.6\n\
// 201110012010	65.1	57.2	57.4\n\
// 201110012015	55.6	56.4	64.3\n\
// 201110012020	54.4	60.7	72.4\n\
// 201110012025	54.4	60.7	72.4\n\
// 201110012030	54.4	60.7	72.4\n\
// 201110012035	63.0	64.3	76.6\n\
// 201110012040	66.9	67.1	66.6\n\
// 201110012045	61.7	64.6	68.0\n\
// 201110012050	61.8	61.6	70.6\n\
// 201110012055	62.8	61.1	71.1\n\
// 201110012100	60.8	59.2	70.0\n\
// 201110012105	62.1	58.9	61.6\n\
// 201110012110	65.1	57.2	57.4\n\
// 201110012115	55.6	56.4	64.3\n\
// 201110012120	54.4	60.7	72.4\n\
// 201110012125	54.4	60.7	72.4\n\
// 201110012130	54.4	60.7	72.4\n\
// 201110012135	63.0	64.3	76.6\n\
// 201110012140	66.9	67.1	66.6\n\
// 201110012145	61.7	64.6	68.0\n\
// 201110012150	61.8	61.6	70.6\n\
// 201110012155	62.8	61.1	71.1\n\
// 201110012200	60.8	59.2	70.0\n\
// 201110012205	62.1	58.9	61.6\n\
// 201110012210	65.1	57.2	57.4\n\
// 201110012215	55.6	56.4	64.3\n\
// 201110012220	54.4	60.7	72.4\n\
// 201110012225	54.4	60.7	72.4\n\
// 201110012230	54.4	60.7	72.4\n\
// 201110012235	63.0	64.3	76.6\n\
// 201110012240	66.9	67.1	66.6\n\
// 201110012245	61.7	64.6	68.0\n\
// 201110012250	61.8	61.6	70.6\n\
// 201110012255	62.8	61.1	71.1\n\
// 201110012300	60.8	59.2	70.0\n\
// 201110012305	62.1	58.9	61.6\n\
// 201110012310	65.1	57.2	57.4\n\
// 201110012315	55.6	56.4	64.3\n\
// 201110012320	54.4	60.7	72.4\n\
// 201110012325	54.4	60.7	72.4\n\
// 201110012330	54.4	60.7	72.4\n\
// 201110012335	63.0	64.3	76.6\n\
// 201110012340	66.9	67.1	66.6\n\
// 201110012345	61.7	64.6	68.0\n\
// 201110012350	61.8	61.6	70.6\n\
// 201110012355	62.8	61.1	71.1\n"

        const node = this.node;


          var width = 1 * (document.getElementsByClassName('wrapper-left')[0].offsetWidth),
          //width = this.props.width - margin.left - margin.right,
          //width = this.referMe.offsetWidth,
          //width = ReactDOM.findDOMNode(this).offsetWidth - margin.left - margin.right,
          //width = this.props.svg.width - margin.left - margin.right,
          //width = d3.select('.svg').node().element.getBoundingClientRect().width - margin.left - margin.right,
          //height = document.getElementsByClassName('wrapper-left')[0].offsetHeight - 100 - document.getElementsByClassName('hashtags')[0].offsetHeight;
          height = width * 0.75,
          margin = {
            top: width/63, //~13
            right: 0,
            bottom: 0,
            left: width/27 //~30
          };
          document.getElementById('svg').style.height = height * 1;
          document.getElementById('svg').style.width = width * 1;


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

        {/*var svg = d3.select("body").append("svg")*/}
        var string = "0 0 "+width*1.125+" "+height*1.04
        var svg = d3.select(node)
          //.attr("width", width + margin.left + margin.right)
          //.attr("height", height + margin.top + margin.bottom)
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", string)
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
          .attr('x', width*0.98)
          .attr('y', function(d, i) {
            return (i + 1) * height/20;
          })
          .attr('width', height/68)
          .attr('height', height/68)
          .style('fill', function(d) {
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
