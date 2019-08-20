import React, { useEffect, useState } from "react";
import { geoTransverseMercator, geoPath, scaleLinear, schemeBlues } from "d3";
import { values, flatten } from "lodash";
import useD3 from "./useD3";
import json from "./barris.json";
import data from "./data.json";

import styles from "./Map.module.css";

const prices = flatten(
  values(data).map(years =>
    flatten(
      values(years).map(trimesters => trimesters.map(t => parseFloat(t.Preu)))
    )
  )
).filter(n => !isNaN(n));

const maxPrice = Math.max(...prices);
const minPrice = Math.min(...prices);

const times = [
  ["2014", "1"],
  ["2014", "2"],
  ["2014", "3"],
  ["2014", "4"],
  ["2015", "1"],
  ["2015", "2"],
  ["2015", "3"],
  ["2015", "4"],
  ["2016", "1"],
  ["2016", "2"],
  ["2016", "3"],
  ["2016", "4"],
  ["2017", "1"],
  ["2017", "2"],
  ["2017", "3"],
  ["2017", "4"],
  ["2018", "1"],
  ["2018", "2"],
  ["2018", "3"],
  ["2018", "4"]
];

const transitionDelay = 1000;

export default function Map({ setCurrentBarrio }) {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const currentTime = times[currentTimeIndex];
  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentTimeIndex((currentTimeIndex + 1) % times.length);
    }, transitionDelay);
    return () => clearInterval(interval);
  });
  const ref = useD3(root => {
    console.log("rendering");

    const color = scaleLinear()
      .domain([minPrice, maxPrice])
      .range(["blue", "red"]);

    const size = root.node().getBoundingClientRect();
    var projection = geoTransverseMercator().fitExtent(
      [[20, 20], [size.width, size.height]],
      json
    );

    var getPath = geoPath().projection(projection);

    var countriesGroup = root
      .selectAll("#map")
      .data([null])
      .join("g")
      .attr("id", "map");

    countriesGroup
      .selectAll("g")
      .data(json.features)
      .join(
        enter => {
          enter
            .append("g")
            .append("path")
            .attr("class", "country")
            .attr("d", getPath)
            .on("mouseover", function(d) {
              setCurrentBarrio(d.properties.BARRI);
            })
            .transition()
            .duration(transitionDelay)
            .attr("fill", d => {
              const price = data[parseInt(d.properties.BARRI)][
                currentTime[0]
              ].find(ob => ob["Trimestre"] === currentTime[1])["Preu"];
              return color(parseFloat(price));
            });
        },
        update => {
          update
            .select("path")
            .attr("d", getPath)
            .transition()
            .duration(transitionDelay)
            .attr("fill", d => {
              const price = data[parseInt(d.properties.BARRI)][
                currentTime[0]
              ].find(ob => ob["Trimestre"] === currentTime[1])["Preu"];
              return color(parseFloat(price));
            });
        }
      );
  }, currentTimeIndex);

  return (
    <div className={styles.map}>
      <h1>{`${currentTime[0]} - Trimester: ${currentTime[1]}`}</h1>
      <svg ref={ref} />
    </div>
  );
}
