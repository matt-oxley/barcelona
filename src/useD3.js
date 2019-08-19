import { useEffect, useRef } from "react";
import { select } from "d3";

export default function(cb) {
  const ref = useRef(null);
  useEffect(() => cb(select(ref.current)));
  return ref;
}
