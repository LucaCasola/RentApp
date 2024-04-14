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

// tab navigator and stack navigator
const MainStack = createNativeStackNavigator()
const ListingsStack = createNativeStackNavigator() // create a stack navigator for Listings
const Tab = createBottomTabNavigator()

function ListingsScreenStack() { 
    return (
        <ListingsStack.Navigator>
            <ListingsStack.Screen 
                name="Listings" 
                component={ListingsScreen} 
                options={{ 
                    headerTitle: () => <Text style={styles.headerText}>Listings Page</Text>,
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

export default function App() {
    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen 
                    name="Owner Login" 
                    component={LoginScreen} 
                    options={{ 
                        
                    }}
                />
                <MainStack.Screen name="Home" options={{ headerShown: false }}>
                {() => (
                    <Tab.Navigator>
                        <Tab.Screen 
                            name="Listings" 
                            component={ListingsScreenStack} 
                            options={{ 
                                headerShown: false,
                            }}
                        />
                        <Tab.Screen 
                            name="Bookings" 
                            component={BookingsScreen} 
                            options={{ 
                                headerTitle: () => <Text style={styles.headerText}>Bookings</Text>,
                                headerRight: () => <AccountDisplay />,
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