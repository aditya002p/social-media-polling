import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  date: Date | string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  areaColor?: string;
  showArea?: boolean;
  showPoints?: boolean;
  curve?: d3.CurveFactory;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 30, right: 30, bottom: 60, left: 60 },
  title = "",
  xAxisLabel = "",
  yAxisLabel = "",
  lineColor = "#3b82f6",
  areaColor = "rgba(59, 130, 246, 0.2)",
  showArea = true,
  showPoints = true,
  curve = d3.curveLinear,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || data.length === 0) return;

    // Ensure dates are Date objects
    const formattedData = data.map((d) => ({
      ...d,
      date: d.date instanceof Date ? d.date : new Date(d.date),
    }));

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
      .scaleTime()
      .domain(d3.extent(formattedData, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(Math.min(formattedData.length, 10)));

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Define line
    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.date as Date))
      .y((d) => y(d.value))
      .curve(curve);

    // Add area if specified
    if (showArea) {
      const area = d3
        .area<DataPoint>()
        .x((d) => x(d.date as Date))
        .y0(innerHeight)
        .y1((d) => y(d.value))
        .curve(curve);

      svg
        .append("path")
        .datum(formattedData)
        .attr("fill", areaColor)
        .attr("d", area);
    }

    // Add the line
    svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add points if specified
    if (showPoints) {
      svg
        .selectAll("circle")
        .data(formattedData)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.date as Date))
        .attr("cy", (d) => y(d.value))
        .attr("r", 4)
        .attr("fill", lineColor)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("r", 6);

          const tooltip = svg
            .append("g")
            .attr("class", "tooltip")
            .attr(
              "transform",
              `translate(${x(d.date as Date)},${y(d.value) - 30})`
            );

          tooltip
            .append("rect")
            .attr("x", -40)
            .attr("y", -20)
            .attr("width", 80)
            .attr("height", 20)
            .attr("fill", "rgba(0, 0, 0, 0.7)")
            .attr("rx", 5);

          tooltip
            .append("text")
            .attr("x", 0)
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(`${d.value}`);
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 4);
          svg.selectAll(".tooltip").remove();
        });
    }

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
  }, [
    data,
    width,
    height,
    margin,
    title,
    xAxisLabel,
    yAxisLabel,
    lineColor,
    areaColor,
    showArea,
    showPoints,
    curve,
  ]);

  return <svg ref={svgRef}></svg>;
};

export default LineChart;
