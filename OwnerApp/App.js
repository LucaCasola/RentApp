// import react-navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


// import icons
import { Ionicons } from '@expo/vector-icons'

// import screens
import LoginScreen from "./screens/LoginScreen"
import ListingsScreen from './screens/ListingsScreen'
import CreateListingScreen from "./screens/CreateListingScreen"
import BookingsScreen from './screens/BookingsScreen'
import AccountScreen from './screens/AccountScreen'

// tab navigator and stack navigator
const MainStack = createNativeStackNavigator()
const ListingsStack = createNativeStackNavigator() // create a stack navigator for Listings
const Tab = createBottomTabNavigator()


function ListingsScreenStack() { 
    return (
        <ListingsStack.Navigator>
            <ListingsStack.Screen name="Listings" component={ListingsScreen} />
            <ListingsStack.Screen name="Create new Listing" component={CreateListingScreen} />
        </ListingsStack.Navigator>
    )
  }


export default function App() {
    return (
        <NavigationContainer>
        <MainStack.Navigator>
            <MainStack.Screen name="Owner Login" component={LoginScreen} />
            <MainStack.Screen name="Home" options={{ headerShown: false }}>
            {() => (
                <Tab.Navigator>
                    <Tab.Screen name="Listings" component={ListingsScreenStack} options={{ headerShown: false }} />
                    <Tab.Screen name="Bookings" component={BookingsScreen} />
                    <Tab.Screen name="Account" component={AccountScreen} />
                </Tab.Navigator>
            )}
            </MainStack.Screen>
        </MainStack.Navigator>
        </NavigationContainer>
    )
}