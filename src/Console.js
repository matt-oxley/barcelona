import React from "react";
import {
  scaleLinear,
  scaleBand,
  axisLeft,
  axisBottom,
  select,
  geoTransverseMercator,
  geoPath
} from "d3";
import useD3 from "./useD3";
import { times, maxPrice, minPrice } from "./Map";
import styles from "./Console.module.css";

export default function Console({ currentBarrio }) {
  const currentBarrioName = currentBarrio.name;
  const ref = useD3(root => {
    const timeValues = times.map(t => `${t[0]} - ${t[1]}`);
    console.log(timeValues);
    const years = ["2014", "2015", "2016", "2017", "2018"];
    const trimesters = ["1", "2", "3", "4"];
    const margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 20
    };
    const { height, width } = root.node().getBoundingClientRect();
    const x = scaleBand()
      .padding(0.1)
      .domain(years)
      .range([margin.left, width - margin.right]);

    const x1 = scaleBand()
      .padding(0.3)
      .domain(trimesters)
      .range([0, x.bandwidth()]);

    const y = scaleLinear()
      .domain([minPrice, maxPrice])
      .range([height - margin.bottom, margin.top]);

    const yLabel = "Rental price (Euros / m2)";
    const xLabel = "";
    var projection = geoTransverseMercator().fitExtent(
      [[20, 20], [width, height]],
      currentBarrio.geom
    );
    const getMap = geoPath().projection(projection);

    // root
    //   .selectAll(".map")
    //   .data([currentBarrio.geom])
    //   .join(
    //     enter => {
    //       enter
    //         .append("g")
    //         .attr("class", "map")
    //         .append("path")
    //         .attr("d", d => {
    //           return getMap(d);
    //         });
    //     },
    //     update => {
    //       update
    //         .select("path")
    //         .transition()
    //         .attr("d", getMap);
    //     }
    //   );

    root
      .selectAll(".axes")
      .data([null])
      .join(
        enter => {
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
            .selectAll(".xAxis .tick text");
        },
        update => {
          update
            .select(".yAxis")
            .attr("transform", `translate(${margin.left} 0)`)
            .call(axisLeft(y));

          update
            .select(".xAxis")
            .attr("transform", `translate(0 ${height - margin.bottom})`)
            .call(axisBottom(x))
            .selectAll(".xAxis .tick text");
        }
      );

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

    root
      .selectAll(".bar")
      .data(
        currentBarrio.data ? currentBarrio.data.filter(d => !isNaN(d.Preu)) : []
      )
      .join(
        enter => {
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("height", d => y(parseFloat(d.Preu, 10)))
            .attr("width", () => x1.bandwidth())
            .attr("x", d => x(d.Any))
            .attr("y", d => {
              return height - margin.bottom - y(parseFloat(d.Preu, 10));
            })
            .attr("transform", d => `translate(${x1(`${d.Trimestre}`)} 0)`);
        },
        update => {
          update
            .transition()
            .attr("height", d => y(parseFloat(d.Preu, 10)))
            .attr("width", () => x1.bandwidth())
            .attr("x", d => x(d.Any))
            .attr("y", d => {
              return height - margin.bottom - y(parseFloat(d.Preu, 10));
            })
            .attr("transform", d => `translate(${x1(`${d.Trimestre}`)} 0)`);
        }
      );
  });
  return (
    <div className={styles.console}>
      <div className={styles.chartWrapper}>
        <h1>{currentBarrioName}</h1>
        <div className={styles.chart}>
          <svg ref={ref} />
        </div>
      </div>
    </div>
  );
}
