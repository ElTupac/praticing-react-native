import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import styles from "./src/styles";
import ConnectButton from "./src/ConnectButton";

const App = () => {
  const [sucessfulConnection, setSucessfulConnection] = useState(false);
  const [socketLastMessage, setSocketLastMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [username, setUsername] = useState();
  const [token, setToken] = useState();

  const buttonProps = {
    title: "Send name",
    onPress: () => {
      fetch("http://192.168.0.4:3001/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
        .then((res) => res.json())
        .then(({ token }) => setToken(token))
        .catch((err) => console.log("Oops... %s", JSON.stringify(err)));
    },
  };
  if (!username || !username.length) buttonProps.disabled = true;

  return (
    <View style={styles.container}>
      <Text>Testing WebSocket connection</Text>
      {sucessfulConnection ? (
        <View>
          <Text>Connected to Websocket</Text>
          {socketLastMessage && <Text>{socketLastMessage}</Text>}
        </View>
      ) : (
        <Text>Not available connection</Text>
      )}
      {errorMessage && <Text>{errorMessage}</Text>}
      <View style={styles.controlsContainer}>
        <TextInput
          onChangeText={setUsername}
          value={username}
          placeholder="Your name in-game"
        />
        <View style={styles.buttonContainer}>
          <Button {...buttonProps} />
        </View>
        {token && <Text>Token: {token}</Text>}
        <ConnectButton
          token={token}
          onSuccess={() => {
            setErrorMessage(undefined);
            setSucessfulConnection(true);
          }}
          onMessage={(data) => setSocketLastMessage(data)}
          onClose={() => {
            setSucessfulConnection(false);
            setErrorMessage("Closed communication");
          }}
          onFail={(message) => {
            setSucessfulConnection(false);
            setErrorMessage(message);
          }}
          title="Test Connection"
        />
      </View>
    </View>
  );
};

export default App;
