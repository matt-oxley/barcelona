import React, { useEffect, useState } from "react";
import { geoTransverseMercator, geoPath, scaleLinear } from "d3";
import Slider from "@material-ui/core/Slider";
import { values, flatten } from "lodash";
import useD3 from "./useD3";
import json from "./barris.json";
import data from "./data.json";

import styles from "./Map.module.css";

const flattenPriceData = raw => {
  return flatten(
    values(raw).map(years =>
      flatten(
        values(years).map(trimesters => trimesters.map(t => parseFloat(t.Preu)))
      )
    )
  );
};

const prices = flattenPriceData(data).filter(n => !isNaN(n));

export const maxPrice = Math.max(...prices);
export const minPrice = Math.min(...prices);

const hiColor = "#7becac";
const loColor = "#be5754";

export const times = [
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
  const [dragging, setDragging] = useState(false);
  const currentTime = times[currentTimeIndex];
  useEffect(() => {
    let interval = setInterval(() => {
      !dragging && setCurrentTimeIndex((currentTimeIndex + 1) % times.length);
    }, transitionDelay);
    return () => clearInterval(interval);
  });
  const ref = useD3(root => {
    console.log("rendering");

    const color = scaleLinear()
      .domain([minPrice, maxPrice])
      .range([loColor, hiColor]);

    const size = root.node().getBoundingClientRect();
    var projection = geoTransverseMercator().fitExtent(
      [[20, 20], [size.width, size.height]],
      json
    );

    var getPath = geoPath().projection(projection);

    root
      .selectAll(".legend")
      .data([null])
      .join("rect")
      .attr("class", "legend")
      .attr("fill", "url(#svgGradient)")
      .attr("stroke", "none")
      .attr("alignment-baseline", "hanging")
      .attr("height", "30%")
      .attr("transform", `translate(${size.width - 10} ${size.height * 0.7})`);

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
            .attr("d", d => {
              return getPath(d);
            })
            .on("mouseover", function(d) {
              setCurrentBarrio({
                name: d.properties.NOM,
                geom: d,
                data: flatten(values(data[parseInt(d.properties.BARRI)]))
              });
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
      <div className={styles.sliderWrapper}>
        <Slider
          valueLabelDisplay={"on"}
          valueLabelFormat={d =>
            `${times[d][0]} \n ${
              ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"][times[d][1] - 1]
            }`
          }
          // ValueLabelComponent={props => {
          //   console.log(props);
          //   const d = props.value;
          //   return <span>{`${times[d][0]} - ${times[d][1]}`}</span>;
          // }}
          step={null}
          orientation="vertical"
          value={currentTimeIndex}
          aria-labelledby="vertical-slider"
          onChange={(ev, val) => {
            setDragging(true);
            setCurrentTimeIndex(val);
          }}
          onChangeCommitted={() => setDragging(false)}
          max={times.length}
          getAriaValueText={i =>
            `Year: ${times[i][0]}, Trimestre: ${times[i][1]}`
          }
          marks={times.map((t, i) => ({
            value: i,
            label: `Year: ${t[0]}, Trimestre: ${t[1]}`
          }))}
        />
      </div>
      <svg ref={ref}>
        <defs>
          <linearGradient id="svgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: hiColor, stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: loColor, stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
