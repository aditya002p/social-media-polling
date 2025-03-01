import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface BarChartProps {
  data: {
    label: string;
    value: number;
  }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 30, right: 30, bottom: 60, left: 60 },
  title = "",
  xAxisLabel = "",
  yAxisLabel = "",
  color = "#3b82f6", // Blue color
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Add bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", color)
      .on("mouseover", function (_, d) {
        d3.select(this).attr("fill", d3.color(color)?.darker() as string);
      })
      .on("mouseout", function (_, d) {
        d3.select(this).attr("fill", color);
      });

    // Add title
    if (title) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(title);
    }

    // Add X axis label
    if (xAxisLabel) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text(xAxisLabel);
    }

    // Add Y axis label
    if (yAxisLabel) {
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text(yAxisLabel);
    }

    // Add value labels on top of bars
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.value);
  }, [data, width, height, margin, title, xAxisLabel, yAxisLabel, color]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
