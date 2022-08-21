import { useContext, createContext, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [connectionData, setConnectionData] = useState({});
  const [lastMessage, setLastMessage] = useState();

  const updateConnectionData = (property, value) => {
    const newData = { ...connectionData };
    newData[property] = value;
    setConnectionData(newData);
  };

  const createUser = (username) => {
    fetch(`http://${process.env.REACT_APP_BACKEND_HOST}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then(({ token }) => {
        updateConnectionData("username", username);
        updateConnectionData("token", token);
      })
      .catch((err) => console.log("Oops... %s", JSON.stringify(err)));
  };

  const startConnection = () => {
    if (connectionData.token) {
      try {
        const webSocket = new WebSocket(
          `ws://${process.env.REACT_APP_BACKEND_HOST}`
        );

        webSocket.onopen = () => {
          updateConnectionData("connnected", true);
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
              setLastMessage(data);
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

  return (
    <WebSocketContext.Provider
      value={{ createUser, lastMessage, startConnection }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
