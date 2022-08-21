import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import { useWebSocketContext } from "../contexts/WebSocketContext";
import Loading from "../components/Loading";
import styles from "../styles";

const CreateRoom = ({ navigation }) => {
  const [friendName, setFriendName] = useState();
  const { startConnection, connected, authenticated, fullName } =
    useWebSocketContext();

  useEffect(() => {
    startConnection();
  }, []);

  const buttonProps = {
    title: "Send invite",
  };
  if (!friendName || !connected || !authenticated) buttonProps.disabled = true;

  return (
    <View style={styles.container}>
      {connected ? (
        <>
          <Text>Invite a friend</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Your friend full username"
            onChangeText={setFriendName}
          />
          <Button {...buttonProps} />
        </>
      ) : (
        <Loading />
      )}
      {fullName && (
        <View style={styles.flexContainer}>
          <Text style={styles.secondaryText}>
            Share your user with friends:{" "}
          </Text>
          <Text style={styles.shareText}>{fullName}</Text>
        </View>
      )}
    </View>
  );
};

export default CreateRoom;
