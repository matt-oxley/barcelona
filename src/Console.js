import React from "react";
import data from "./data.json";
import styles from "./Console.module.css";

export default function Console({ currentBarrio }) {
  return (
    <div className={styles.console}>
      <h1>
        {data[currentBarrio] && data[currentBarrio]["2014"][0]["Nom_Barri"]}
      </h1>
    </div>
  );
}
