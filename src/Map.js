import React from 'react'
import {geoTransverseMercator, geoPath} from 'd3';
import useD3 from './useD3'
import json from "./barris.json";

import styles from "./Map.module.css"

export default function Map({setCurrentBarrio}) {


  const ref = useD3(root => {
    const size = root.node().getBoundingClientRect()
    var projection = geoTransverseMercator()
    .rotate([74 + 30 / 60, -38 - 50 / 60])
    .fitExtent([[20, 20], [size.width, size.height]], json);

    var path = geoPath().projection(projection);

    var countriesGroup = root.selectAll('#map').data([null]).join("g").attr("id", "map");

    countriesGroup
    .selectAll("g")
    .data(json.features)
    .join(enter => {
      enter.append("g").append('path').attr("class", "country")
      .attr("d", d => {
        return path(d);
      })
      .on('mouseover', function(d) {
        setCurrentBarrio(d.properties.NOM)
      })

    }, update => {
      update.select('path').attr('d', path)
    });

})

  return (
    <div className={styles.map} >
      <svg ref={ref} />
    </div>
  )
}
