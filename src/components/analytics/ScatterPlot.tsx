import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Card } from "../ui/Card";

interface DataPoint {
  x: number;
  y: number;
  label?: string;
  group?: string;
  size?: number;
}

interface ScatterPlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  title?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  showTrendline?: boolean;
  groupColors?: Record<string, string>;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  width = 600,
  height = 400,
  xLabel = "X Axis",
  yLabel = "Y Axis",
  title = "Scatter Plot",
  xDomain,
  yDomain,
  showTrendline = false,
  groupColors = {},
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

  const margin = { top: 60, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Setup color scale for groups
  const groups = Array.from(new Set(data.map((d) => d.group || "default")));
  const defaultColors = d3.schemeCategory10;
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(groups)
    .range(
      groups.map(
        (group, i) =>
          groupColors[group] || defaultColors[i % defaultColors.length]
      )
    );

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

    // Create scales
    const x = d3
      .scaleLinear()
      .domain(xDomain || (d3.extent(data, (d) => d.x) as [number, number]))
      .range([0, innerWidth])
      .nice();

    const y = d3
      .scaleLinear()
      .domain(yDomain || (d3.extent(data, (d) => d.y) as [number, number]))
      .range([innerHeight, 0])
      .nice();

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    // Add trendline if requested
    if (showTrendline && data.length > 1) {
      const xValues = data.map((d) => d.x);
      const yValues = data.map((d) => d.y);

      // Simple linear regression
      const xMean = d3.mean(xValues) || 0;
      const yMean = d3.mean(yValues) || 0;

      const numerator = d3.sum(
        data.map((d, i) => (d.x - xMean) * (d.y - yMean))
      );
      const denominator = d3.sum(xValues.map((x) => Math.pow(x - xMean, 2)));

      const slope = numerator / denominator;
      const intercept = yMean - slope * xMean;

      const line = d3
        .line<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

      const xRange = x.domain();
      const trendData = [
        { x: xRange[0], y: slope * xRange[0] + intercept },
        { x: xRange[1], y: slope * xRange[1] + intercept },
      ];

      g.append("path")
        .datum(trendData)
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,5")
        .attr("d", line);
    }

    // Draw points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", (d) => d.size || 5)
      .attr("fill", (d) => colorScale(d.group || "default"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8)
      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: d.label || `(${d.x}, ${d.y})`,
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
      .attr("y", height - 10)
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

    // Add legend if groups exist
    if (groups.length > 1) {
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - margin.right - 120}, ${margin.top})`
        );

      groups.forEach((group, i) => {
        const legendRow = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        legendRow
          .append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", colorScale(group));

        legendRow
          .append("text")
          .attr("x", 15)
          .attr("y", 10)
          .attr("text-anchor", "start")
          .style("font-size", "12px")
          .text(group);
      });
    }
  }, [
    data,
    width,
    height,
    margin,
    xLabel,
    yLabel,
    title,
    xDomain,
    yDomain,
    showTrendline,
    groupColors,
    innerWidth,
    innerHeight,
    colorScale,
    groups,
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

export default ScatterPlot;
