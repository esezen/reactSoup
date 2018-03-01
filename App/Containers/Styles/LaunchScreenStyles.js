import { StyleSheet } from "react-native";
import { Metrics, ApplicationStyles } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: "contain"
  },
  centered: {
    marginTop: 80,
    alignItems: "center"
  },
  pageTitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold"
  }
});
