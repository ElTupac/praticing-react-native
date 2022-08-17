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

  const [wsRef, setWsRef] = useState();
  const [wsAuth, setWsAuth] = useState(false);
  const [friendName, setFriendName] = useState();

  const inviteButtonProps = {
    title: "Invite friend",
    onPress: () => {
      if (wsRef) {
        wsRef.send(`invite--${friendName}`);
      }
    },
  };
  if (!wsAuth || !friendName || !friendName.length)
    inviteButtonProps.disabled = true;

  const buttonProps = {
    title: "Send name",
    onPress: () => {
      fetch("http://10.236.28.163:3001/user", {
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
          onSuccess={(ws) => {
            setWsRef(ws);
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
          onAuth={() => setWsAuth(true)}
          title="Test Connection"
        />
      </View>
      {wsAuth && (
        <View style={styles.controlsContainer}>
          <TextInput
            onChangeText={setFriendName}
            value={friendName}
            placeholder="Your friend name"
          />
          <Button {...inviteButtonProps} />
        </View>
      )}
    </View>
  );
};

export default App;
