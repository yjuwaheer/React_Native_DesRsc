import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icons
import { Entypo } from '@expo/vector-icons';
// Screens
import Home from './screens/Home';
import Favorites from './screens/Favorites';
// Provider
import { RenderContextProvider } from './screens/contexts/RenderContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <RenderContextProvider>
      <NavigationContainer>
        <StatusBar backgroundColor={'#FA9C56'} />
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
          }}>
          <Tab.Screen name="Home" component={Home} 
            options={{
              tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
              tabBarActiveTintColor: "#FA8532",
              tabBarInactiveTintColor: "gray",
            }}
          />
          <Tab.Screen name="Favorites" component={Favorites}
            options={{
              tabBarIcon: ({ color }) => <Entypo name="heart" size={24} color={color} />,
              tabBarActiveTintColor: "#FA8532",
              tabBarInactiveTintColor: "gray",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </RenderContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
