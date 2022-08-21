import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useWebSocketContext } from "../contexts/WebSocketContext";

import Loading from "../components/Loading";
import styles from "../styles";

const Home = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { createUser } = useWebSocketContext();

  const onSuccess = () => {
    setLoading(false);
    navigation.navigate("Invite a friend");
  };

  const onError = () => {
    setLoading(false);
    setError("Oops... try again");
  };

  const buttonProps = {
    title: "Create user",
  };
  if (!username || !username.length) buttonProps.disabled = true;

  return (
    <View style={styles.container}>
      <Text>Create my user</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Your username"
        onChangeText={setUsername}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading ? (
        <Button
          {...buttonProps}
          onPress={() => {
            setLoading(true);
            setError(undefined);
            createUser(username, { onError, onSuccess });
          }}
        />
      ) : (
        <Loading />
      )}
    </View>
  );
};

export default Home;
