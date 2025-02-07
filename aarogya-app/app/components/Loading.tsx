import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";

const Loading = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require("../../assets/loading_animation.json")} // Place your Lottie JSON file in assets folder
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", // Slight dark overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default Loading;