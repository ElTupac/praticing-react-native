import { REACT_APP_WS_URL } from "@env";
import { Button } from "react-native";

const ConnectButton = ({
  title,
  onSuccess,
  onFail,
  onClose,
  onMessage,
  onAuth,
  token,
}) => {
  const createConnection = () => {
    try {
      console.log("URL: %s", REACT_APP_WS_URL);
      const ws = new WebSocket(REACT_APP_WS_URL);
      let messageInterval;

      ws.onopen = () => {
        if (typeof onSuccess === "function") onSuccess(ws);
      };
      ws.onmessage = ({ data }) => {
        switch (data) {
          case "authenticate":
            ws.send(JSON.stringify({ token }));
            break;

          case "authenticate_ok":
            if (typeof onAuth === "function") onAuth();
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
