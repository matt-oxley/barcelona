import React from "react";
import { scaleLinear, scaleBand, axisLeft, axisBottom, select } from "d3";
import useD3 from "./useD3";
import { times, maxPrice, minPrice } from "./Map";
import styles from "./Console.module.css";

export default function Console({ currentBarrio }) {
  const currentBarrioName = currentBarrio.name;
  const ref = useD3(root => {
    const timeValues = times.map(t => `${t[0]} - ${t[1]}`);
    const margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 20
    };
    const { height, width } = root.node().getBoundingClientRect();
    const x = scaleBand()
      .padding(0.1)
      .domain(timeValues)
      .range([margin.left, width - margin.right]);
    const y = scaleLinear()
      .domain([minPrice, maxPrice])
      .range([height - margin.bottom, margin.top]);

    const yLabel = "Rental price (Euros / m2)";
    const xLabel = "Year (Trimestre)";

    root
      .selectAll(".axes")
      .data([null])
      .join(enter => {
        const g = enter.append("g");
        g.attr("class", "axes");
        g.append("g")
          .attr("class", "yAxis")
          .attr("transform", `translate(${margin.left} 0)`)
          .call(axisLeft(y));
        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", `translate(0 ${height - margin.bottom})`)
          .call(axisBottom(x))
          .selectAll(".xAxis .tick text")
          .call(function(t) {
            t.each(function(d) {
              // for each one
              var self = select(this);
              var s = self.text().split("-"); // get the text and split it
              self.text(""); // clear it out
              self
                .append("tspan") // insert two tspans
                .attr("x", 0)
                .attr("dy", ".8em")
                .text(s[0]);
              self
                .append("tspan")
                .attr("x", 0)
                .attr("dy", ".8em")
                .text(s[1]);
            });
          });
      });

    root
      .selectAll(".yLabel")
      .data([null])
      .join(
        enter => {
          enter
            .append("text")
            .attr("alignment-baseline", "hanging")
            .attr("transform", `translate(0 0) `)
            .attr("class", `yLabel`)
            .text(yLabel);
        },
        update => update.text(yLabel).attr("transform", `translate(0 0)`)
      );

    // add x label
    root
      .selectAll(".xLabel")
      .data([null])
      .join(
        enter =>
          enter
            .append("text")
            .attr("transform", `translate(${width} ${height - 5})`)
            .attr("alignment-baseline", "bottom")
            .attr("text-anchor", "end")
            .attr("class", `xLabel`)
            .text(xLabel),
        update =>
          update
            .text(xLabel)
            .attr("transform", `translate(${width} ${height - 5})`)
      );
  });
  return (
    <div className={styles.console}>
      <h1>{currentBarrioName}</h1>
      <div className={styles.chartWrapper}>
        <svg ref={ref} />
      </div>
    </div>
  );
}
