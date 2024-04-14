// import react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// import icons
import { Ionicons } from '@expo/vector-icons';

// import screens
import LoginScreen from "./screens/LoginScreen";
import SearchScreen from './screens/SearchScreen';
import BookingsScreen from './screens/BookingsScreen';
import AccountScreen from './screens/AccountScreen';

// tab navigator and stack navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Renter Login" component={LoginScreen}/>
        <Stack.Screen name="Home" options={{ headerShown: false }} >
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="Search" component={SearchScreen} />
              <Tab.Screen name="Bookings" component={BookingsScreen} />
              <Tab.Screen name="Account" component={AccountScreen} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}