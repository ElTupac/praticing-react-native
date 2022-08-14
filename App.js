import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { REACT_APP_WS_URL } from "@env";

const App = () => {
  const [sucessfulConnection, setSucessfulConnection] = useState(false);
  const [socketLastMessage, setSocketLastMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const createConnection = () => {
    try {
      const ws = new WebSocket(REACT_APP_WS_URL);
      ws.onopen = () => {
        console.log("Connected to socket: %s", REACT_APP_WS_URL);
        setErrorMessage(undefined);
        setSucessfulConnection(true);
      };
      ws.onmessage = ({ data }) => {
        setSocketLastMessage(data);
      };
      ws.onclose = () => {
        setSucessfulConnection(false);
        setErrorMessage("Closed communication");
      };
      ws.onerror = ({ message }) => {
        setSucessfulConnection(false);
        setErrorMessage(message);
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={
        StyleSheet.create({
          container: {
            padding: 30,
          },
        }).container
      }
    >
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
      <Button onPress={createConnection} title="Test Connection" />
    </View>
  );
};

export default App;
