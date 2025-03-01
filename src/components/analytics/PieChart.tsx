import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: {
    label: string;
    value: number;
  }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  title?: string;
  colorScale?: string[];
  innerRadius?: number;
  padAngle?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 500,
  height = 500,
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  title = "",
  colorScale = d3.schemeCategory10,
  innerRadius = 0, // 0 for pie, > 0 for donut
  padAngle = 0.02,
  showLegend = true,
  showLabels = true,
  showPercentages = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Colors
    const color = d3.scaleOrdinal(colorScale);

    // Compute the position of each group on the pie
    const pie = d3.pie<any>().value((d: any) => d.value);
    const data_ready = pie(data);

    // Total value for percentage calculation
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);

    // Build the pie chart
    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .padAngle(padAngle)
      .padRadius(radius);

    // Add the arcs
    svg
      .selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator as any)
      .attr("fill", (d, i) => color(i.toString()) as string)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .style("opacity", 1)
          .transition()
          .duration(200)
          .attr(
            "d",
            d3
              .arc()
              .innerRadius(innerRadius)
              .outerRadius(radius + 10)
              .padAngle(padAngle)
              .padRadius(radius) as any
          );
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .style("opacity", 0.8)
          .transition()
          .duration(200)
          .attr("d", arcGenerator as any);
      });

    // Add labels
    if (showLabels) {
      const labelArc = d3
        .arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.7);

      const labels = svg
        .selectAll("text")
        .data(data_ready)
        .enter()
        .append("text")
        .attr("transform", (d) => `translate(${labelArc.centroid(d as any)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold");

      if (showPercentages) {
        labels.text((d) => {
          const percentage = ((d.data.value / totalValue) * 100).toFixed(1);
          return `${percentage}%`;
        });
      } else {
        labels.text((d) => d.data.label);
      }
    }

    // Add title
    if (title) {
      svg
        .append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(title);
    }

    // Add legend
    if (showLegend) {
      const legendSpacing = 20;
      const legendRectSize = 15;
      const legendX = radius + 20;
      const legendY = -radius;

      const legend = svg
        .selectAll(".legend")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => {
          return `translate(${legendX}, ${legendY + i * legendSpacing})`;
        });

      legend
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", (d, i) => color(i.toString()) as string)
        .style("stroke", "white");

      legend
        .append("text")
        .attr("x", legendRectSize + 5)
        .attr("y", legendRectSize - 2)
        .text((d) => `${d.label} (${d.value})`);
    }
  }, [
    data,
    width,
    height,
    margin,
    title,
    colorScale,
    innerRadius,
    padAngle,
    showLegend,
    showLabels,
    showPercentages,
  ]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
