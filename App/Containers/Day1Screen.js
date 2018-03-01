import React, { Component } from "react";
import {
  Platform,
  ListView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { connect } from "react-redux";
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from "./Styles/Day1ScreenStyle";

class WatchFace extends Component {
  render() {
    return (
      <View style={styles.watchFaceContainer}>
        <Text style={styles.sectionTime}>{this.props.sectionTime}</Text>
        <Text style={styles.totalTime}>{this.props.totalTime}</Text>
      </View>
    );
  }
}

class WatchControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchOn: false,
      startBtnText: "Start",
      startBtnColor: "#60B644",
      stopBtnText: "Reset",
      underlayColor: "#fff"
    };
  }

  _startWatch = () => {
    if (!this.state.watchOn) {
      this.props.startWatch();
      this.setState({
        startBtnText: "Pause",
        startBtnColor: "#ff0044",
        stopBtnText: "Lap",
        underlayColor: "#eee",
        watchOn: true
      });
    } else {
      this.props.stopWatch();
      this.setState({
        startBtnText: "Continue",
        startBtnColor: "#60B644",
        stopBtnText: "Reset",
        underlayColor: "#eee",
        watchOn: false
      });
    }
  };
  _addRecord = () => {
    if (this.state.watchOn) {
      this.props.addRecord();
    } else {
      this.props.clearRecord();
      this.setState({
        stopBtnText: "Clear"
      });
    }
  };

  render() {
    return (
      <View style={styles.watchControlContainer}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <TouchableHighlight
            style={styles.btnStop}
            underlayColor={this.state.underlayColor}
            onPress={() => this._addRecord()}
          >
            <Text style={styles.btnStopText}>{this.state.stopBtnText}</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableHighlight
            style={styles.btnStart}
            underlayColor="#eee"
            onPress={() => this._startWatch()}
          >
            <Text
              style={[styles.btnStartText, { color: this.state.startBtnColor }]}
            >
              {this.state.startBtnText}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

class WatchRecord extends Component {
  render() {
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      theDataSource = ds.cloneWithRows(this.props.record);
    return (
      <ListView
        style={styles.recordList}
        dataSource={theDataSource}
        renderRow={rowData => (
          <View style={styles.recordItem}>
            <Text style={styles.recordItemTitle}>{rowData.title}</Text>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.recordItemTime}>{rowData.time}</Text>
            </View>
          </View>
        )}
      />
    );
  }
}

class Day1Screen extends Component {
  static navigationOptions = {
    title: "Day 1"
  };
  constructor() {
    super();
    this.state = {
      stopWatch: false,
      resetWatch: true,
      intialTime: 0,
      currentTime: 0,
      recordTime: 0,
      timeAccumulation: 0,
      totalTime: "00:00.00",
      sectionTime: "00:00.00",
      recordCounter: 0,
      record: [
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" }
      ]
    };
  }
  componentWillUnmount() {
    this._stopWatch();
    this._clearRecord();
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      StatusBar.setBarStyle(0);
    }
  }

  _startWatch() {
    if (this.state.resetWatch) {
      this.setState({
        stopWatch: false,
        resetWatch: false,
        timeAccumulation: 0,
        initialTime: new Date().getTime()
      });
    } else {
      this.setState({
        stopWatch: false,
        initialTime: new Date().getTime()
      });
    }
    let milSecond,
      second,
      minute,
      countingTime,
      secmilSecond,
      secsecond,
      secminute,
      seccountingTime;
    let interval = setInterval(() => {
      this.setState({
        currentTime: new Date().getTime()
      });
      countingTime =
        this.state.timeAccumulation +
        this.state.currentTime -
        this.state.initialTime;
      minute = Math.floor(countingTime / (60 * 1000));
      second = Math.floor((countingTime - 6000 * minute) / 1000);
      milSecond = Math.floor((countingTime % 1000) / 10);
      seccountingTime = countingTime - this.state.recordTime;
      secminute = Math.floor(seccountingTime / (60 * 1000));
      secsecond = Math.floor((seccountingTime - 6000 * secminute) / 1000);
      secmilSecond = Math.floor((seccountingTime % 1000) / 10);
      this.setState({
        totalTime:
          (minute < 10 ? "0" + minute : minute) +
          ":" +
          (second < 10 ? "0" + second : second) +
          "." +
          (milSecond < 10 ? "0" + milSecond : milSecond),
        sectionTime:
          (secminute < 10 ? "0" + secminute : secminute) +
          ":" +
          (secsecond < 10 ? "0" + secsecond : secsecond) +
          "." +
          (secmilSecond < 10 ? "0" + secmilSecond : secmilSecond)
      });
      if (this.state.stopWatch) {
        this.setState({
          timeAccumulation: countingTime
        });
        clearInterval(interval);
      }
    }, 10);
  }

  _stopWatch() {
    this.setState({
      stopWatch: true
    });
  }

  _addRecord() {
    let { recordCounter, record } = this.state;
    recordCounter++;
    if (recordCounter < 8) {
      record.pop();
    }
    record.unshift({
      title: "Lap : " + recordCounter,
      time: this.state.sectionTime
    });
    this.setState({
      recordTime:
        this.state.timeAccumulation +
        this.state.currentTime -
        this.state.initialTime,
      recordCounter: recordCounter,
      record: record
    });
    //use refs to call functions within other sub component
    //can force to update the states
    // this.refs.record._updateData();
  }

  _clearRecord() {
    this.setState({
      stopWatch: false,
      resetWatch: true,
      intialTime: 0,
      currentTime: 0,
      recordTime: 0,
      timeAccumulation: 0,
      totalTime: "00:00.00",
      sectionTime: "00:00.00",
      recordCounter: 0,
      record: [
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" },
        { title: "", time: "" }
      ]
    });
  }

  render() {
    return (
      <View style={styles.watchContainer}>
        <WatchFace
          totalTime={this.state.totalTime}
          sectionTime={this.state.sectionTime}
        />
        <WatchControl
          addRecord={() => this._addRecord()}
          clearRecord={() => this._clearRecord()}
          startWatch={() => this._startWatch()}
          stopWatch={() => this._stopWatch()}
        />
        <WatchRecord record={this.state.record} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Day1Screen);
