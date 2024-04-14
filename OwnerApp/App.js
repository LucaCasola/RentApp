import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'

// import react-navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// import screens
import LoginScreen from "./screens/LoginScreen"
import ListingsScreen from './screens/ListingsScreen'
import CreateListingScreen from "./screens/CreateListingScreen"
import BookingsScreen from './screens/BookingsScreen'

//import account component
import AccountDisplay from './components/AccountDisplay'

// import icons
import { Entypo } from '@expo/vector-icons';

// tab navigator and stack navigator
const MainStack = createNativeStackNavigator()
const ListingsStack = createNativeStackNavigator()
const BookingsStack = createNativeStackNavigator() 
const Tab = createBottomTabNavigator()

function ListingsScreenStack() { 
    return (
        <ListingsStack.Navigator>
            <ListingsStack.Screen 
                name="Listings page" 
                component={ListingsScreen} 
                options={{ 
                    headerTitle: () => <Text style={styles.headerText}>Listings</Text>,
                    headerRight: () => <AccountDisplay />,
                }}
            />
            <ListingsStack.Screen 
                name="Create new Listing" 
                component={CreateListingScreen} 
                options={{ 
                    headerTitle: () => <Text style={styles.headerText}>Create a New Listing</Text>,
                }}
            />
        </ListingsStack.Navigator>
    )
}

function BookingsScreenStack() { 
    return (
        <BookingsStack.Navigator>
            <BookingsStack.Screen 
                name="Listings" 
                component={BookingsScreen} 
                options={{ 
                    headerTitle: () => <Text style={styles.headerText}>Bookings</Text>,
                    headerRight: () => <AccountDisplay />,
                }}
            />
        </BookingsStack.Navigator>
    )
}

export default function App() {
    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen  name="Owner Login" component={LoginScreen} />
                <MainStack.Screen name="Home" options={{ headerShown: false }}>
                {() => (
                    <Tab.Navigator>
                        <Tab.Screen 
                            name="Listings" 
                            component={ListingsScreenStack} 
                            options={{ 
                                tabBarIcon: ({ color, size }) => (
                                    <Entypo name="list" size={size} color={color} />
                                ),
                                headerShown: false,
                            }}
                        />
                        <Tab.Screen 
                            name="Bookings" 
                            component={BookingsScreenStack} 
                            options={{ 
                                tabBarIcon: ({ color, size }) => (
                                    <Entypo name="open-book" size={size} color={color} />
                                ),
                                headerShown: false,
                            }}
                        />
                    </Tab.Navigator>
                )}
                </MainStack.Screen>
            </MainStack.Navigator>
        </NavigationContainer>
    )
}


const styles = StyleSheet.create({
    headerText: {
        fontSize: 24,
        padding: 8,
    },
})