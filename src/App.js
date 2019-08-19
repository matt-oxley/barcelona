import React, { Component } from "react";
import Map from "./Map";
import Console from "./Console";
import styles from "./App.module.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentBarrio: null
    };
    this.setCurrentBarrio = this.setCurrentBarrio.bind(this);
  }
  setCurrentBarrio(key) {
    this.setState({
      currentBarrio: key
    });
  }

  render() {
    return (
      <div className={styles.wrap}>
        <Map setCurrentBarrio={this.setCurrentBarrio} />
        <Console currentBarrio={this.state.currentBarrio} />
      </div>
    );
  }
}

export default App;
