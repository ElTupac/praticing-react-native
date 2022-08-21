import { useContext, createContext, useState, useEffect } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [connectionData, setConnectionData] = useState({});

  const updateConnectionData = (property, value) => {
    setConnectionData((oldData) => {
      const newData = { ...oldData };
      newData[property] = value;
      return newData;
    });
  };

  const createUser = (username, { onSuccess, onError }) => {
    updateConnectionData("username", username);
    fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then(({ token }) => {
        updateConnectionData("token", token);
        if (typeof onSuccess === "function") onSuccess();
      })
      .catch((err) => {
        console.log("Oops... %s", JSON.stringify(err));
        if (typeof onError === "function") onError();
      });
  };

  const newMessage = (message) => {
    const [action, value, data] = message.split("--");
    switch (action) {
      case "info":
        updateConnectionData(value, data);
        break;
      default:
        console.log(action, value, data);
    }
  };

  const startConnection = () => {
    if (connectionData.token) {
      console.log("Starting connection");
      try {
        const webSocket = new WebSocket(
          `ws://${process.env.REACT_APP_BACKEND_HOST}`
        );

        webSocket.onopen = () => {
          updateConnectionData("connected", true);
        };
        webSocket.onmessage = ({ data }) => {
          switch (data) {
            case "authenticate":
              webSocket.send(JSON.stringify({ token: connectionData.token }));
              break;
            case "authenticate_ok":
              updateConnectionData("authenticated", true);
              break;
            default:
              newMessage(data);
          }
        };
        webSocket.onclose = () => {
          updateConnectionData("connected", false);
        };
        webSocket.onerror = ({ message }) => {
          updateConnectionData("error", message);
        };

        updateConnectionData("websocket", webSocket);
      } catch (error) {
        console.log(error);
      }
    } else throw "NO_CONNECTION_TOKEN";
  };

  const { connected, authenticated, fullName } = connectionData;

  return (
    <WebSocketContext.Provider
      value={{
        createUser,
        startConnection,
        connected,
        authenticated,
        fullName,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
