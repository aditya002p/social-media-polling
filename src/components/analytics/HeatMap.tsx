import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card } from "../ui/Card";

interface HeatMapProps {
  data: Array<{
    x: string | number;
    y: string | number;
    value: number;
  }>;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  title?: string;
  colorScale?: [string, string]; // [min color, max color]
}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  width = 600,
  height = 400,
  xLabel = "X Axis",
  yLabel = "Y Axis",
  title = "Heat Map",
  colorScale = ["#e0f7fa", "#006064"],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  // Extract unique x and y values
  const xValues = Array.from(new Set(data.map((d) => d.x))).sort();
  const yValues = Array.from(new Set(data.map((d) => d.y))).sort();

  // Calculate cell dimensions
  const margin = { top: 60, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const cellWidth = innerWidth / xValues.length;
  const cellHeight = innerHeight / yValues.length;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous renderings
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create color scale
    const values = data.map((d) => d.value);
    const colorDomain = [Math.min(...values), Math.max(...values)];
    const color = d3
      .scaleLinear<string>()
      .domain(colorDomain)
      .range([colorScale[0], colorScale[1]]);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(xValues.map(String))
      .range([0, innerWidth])
      .padding(0.05);

    const yScale = d3
      .scaleBand()
      .domain(yValues.map(String))
      .range([0, innerHeight])
      .padding(0.05);

    // Draw cells
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(String(d.x))!)
      .attr("y", (d) => yScale(String(d.y))!)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => color(d.value))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: `${d.x}, ${d.y}: ${d.value}`,
        });
      })
      .on("mousemove", (event) => {
        setTooltip((prev) => ({
          ...prev,
          x: event.pageX,
          y: event.pageY,
        }));
      })
      .on("mouseout", () => {
        setTooltip((prev) => ({
          ...prev,
          visible: false,
        }));
      });

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add y-axis
    g.append("g").call(d3.axisLeft(yScale));

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(title);

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .text(xLabel);

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text(yLabel);
  }, [
    data,
    width,
    height,
    margin,
    colorScale,
    xLabel,
    yLabel,
    title,
    xValues,
    yValues,
    innerWidth,
    innerHeight,
  ]);

  return (
    <Card className="p-4">
      <svg ref={svgRef} />
      {tooltip.visible && (
        <div
          className="absolute bg-white shadow-md rounded p-2 text-sm pointer-events-none z-50"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 30,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </Card>
  );
};

export default HeatMap;
