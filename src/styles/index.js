import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  flexContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    borderColor: "#1A1A1A",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "100%",
    marginVertical: 10,
  },
  errorText: {
    color: "#FF3333",
  },
  shareText: {
    color: "#1A1A1A",
    fontWeight: "bold",
  },
  secondaryText: {
    color: "#BBBBBBS",
  },
});

export default styles;
