import React, { Component } from "react";
import { ScrollView, Text, Image, View, Button, Alert } from "react-native";
import DevscreensButton from "../../ignite/DevScreens/DevscreensButton.js";
import RoundedButton from "../Components/RoundedButton";
import { Images } from "../Themes";

// Styles
import styles from "./Styles/LaunchScreenStyles";

export default class LaunchScreen extends Component {
  static navigationOptions = {
    title: "Welcome",
    headerRight: (
      <Button
        onPress={() => alert("This is a button!")}
        title="Info"
        color="#fff"
      />
    )
  };

  render() {
    let days = [
      { key: 1, title: "Day 1", screen: "Day1Screen" },
      { key: 2, title: "Day 2", screen: "Day2Screen" }
    ];
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.mainContainer}>
        <Image
          source={Images.background}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            {
              //<Image source={Images.launch} style={styles.logo} />
            }
            <Text style={styles.pageTitle}>50 React Projects</Text>
          </View>

          <View style={styles.section}>
            {days.map(day => {
              return (
                <RoundedButton
                  key={day.key}
                  style={styles.dayButton}
                  onPress={() => navigate(day.screen)}
                >
                  {day.title}
                </RoundedButton>
              );
            })}

            {/*
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              This probably isn't what your app is going to look like. Unless
              your designer handed you this screen and, in that case, congrats!
              You're ready to ship. For everyone else, this is where you'll see
              a live preview of your fully functioning app using Ignite.
            </Text>
            <DevscreensButton />
            */}
          </View>
        </ScrollView>
      </View>
    );
  }
}
