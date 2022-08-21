import { Button, Text, TextInput, View } from "react-native";
import styles from "./src/styles";

const CreateRoom = () => (
  <View style={styles.container}>
    <Text>Invite a friend</Text>
    <TextInput placeholder="Your friend full username" />
    <Button title="Invite him" />
  </View>
);

export default CreateRoom;
