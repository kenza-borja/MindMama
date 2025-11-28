
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LaunchScreen from "../screens/LaunchScreen";

export type RootStackParamList = {
  Launch: undefined;Home: undefined;
  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

 function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{ 
        headerShown: false
      }}
    >
      <Stack.Screen name="Launch" component={LaunchScreen} />
      
    </Stack.Navigator>
  );
}
export default RootNavigator;
