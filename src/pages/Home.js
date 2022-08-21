import { Button, Text, TextInput, View } from "react-native";
import styles from "./src/styles";

const Home = () => (
  <View style={styles.container}>
    <Text>Testing navigation</Text>
    <TextInput placeholder="Your username" />
    <Button title="Send it" />
  </View>
);

export default Home;
