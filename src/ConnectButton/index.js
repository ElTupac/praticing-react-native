import { REACT_APP_WS_URL } from "@env";
import { Button } from "react-native";

const ConnectButton = ({
  title,
  onSuccess,
  onFail,
  onClose,
  onMessage,
  token,
}) => {
  const createConnection = () => {
    try {
      console.log("El token es: %s", token);
      const ws = new WebSocket(REACT_APP_WS_URL);
      let messageInterval;
      console.log("Connected to socket: %s", REACT_APP_WS_URL);

      const startMessages = () => {
        messageInterval = setInterval(() => {
          ws.send("Hola, master");
        }, 1500);
      };
      ws.onopen = () => {
        if (typeof onSuccess === "function") onSuccess();
      };
      ws.onmessage = ({ data }) => {
        switch (data) {
          case "authenticate":
            ws.send(JSON.stringify({ token }));
            break;

          case "authenticate_ok":
            startMessages();
            break;

          default:
            if (typeof onMessage === "function") onMessage(data);
        }
      };
      ws.onclose = () => {
        if (messageInterval) {
          clearInterval(messageInterval);
          messageInterval = null;
        }

        if (typeof onClose === "function") onClose();
      };
      ws.onerror = (data) => {
        if (messageInterval) {
          clearInterval(messageInterval);
          messageInterval = null;
        }
        console.log("Rompido: %s", JSON.stringify(data));

        if (typeof onFail === "function") onFail(data.message);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const buttonProps = {
    onPress: createConnection,
    title,
  };
  if (!token || !token.length) buttonProps.disabled = true;

  return <Button {...buttonProps} />;
};

export default ConnectButton;
