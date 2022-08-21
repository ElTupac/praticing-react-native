import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { WebSocketProvider } from "./src/contexts/WebSocketContext";
import Home from "./src/pages/Home";
import CreateRoom from "./src/pages/CreateRoom";

const Stack = createNativeStackNavigator();

const App = () => (
  <WebSocketProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateRoom" component={CreateRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  </WebSocketProvider>
);

export default App;
