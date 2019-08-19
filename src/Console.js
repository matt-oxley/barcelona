import React from 'react';
import styles from "./Console.module.css";

export default function Console({currentBarrio}) {
  return (
    <div className={styles.console}>
      Console
      <h1>{currentBarrio}</h1>
    </div>
  )
}
