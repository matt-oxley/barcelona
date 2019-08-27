import React, { Component } from "react";
import Map from "./Map";
import Console from "./Console";
import styles from "./App.module.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentBarrio: {},
      dialogOpen: false
    };
    this.setCurrentBarrio = this.setCurrentBarrio.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  openDialog() {
    this.setState({
      dialogOpen: true
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false
    });
  }

  setCurrentBarrio(ob) {
    this.setState({
      currentBarrio: ob
    });
  }

  render() {
    return (
      <div className={styles.app}>
        {this.state.dialogOpen ? (
          <div className={styles.dialog}>
            <div className={styles.overlay} onClick={this.closeDialog}></div>
            <div className={styles.box}>
              <div className={styles.boxHeader}>
                <span>About this visualisation</span>
                <button className={styles.close} onClick={this.closeDialog}>
                  X
                </button>
              </div>
              <div></div>
            </div>
          </div>
        ) : null}
        <div className={styles.header}>
          <span>Barcelona Rental Price Explorer</span>
          <button className={styles.more} onClick={this.openDialog}>
            ?
          </button>
        </div>
        <div className={styles.wrap}>
          <Map setCurrentBarrio={this.setCurrentBarrio} />
          <Console currentBarrio={this.state.currentBarrio} />
        </div>
      </div>
    );
  }
}

export default App;
