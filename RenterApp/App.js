import { StyleSheet, Text } from 'react-native'

// import react-navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// import screens
import LoginScreen from "./screens/LoginScreen"
import SearchScreen from './screens/SearchScreen'
import BookingsScreen from './screens/BookingsScreen'

//import account component
import AccountDisplay from './components/AccountDisplay'

// import icons
import { Entypo } from '@expo/vector-icons';

// tab navigator and stack navigator
const MainStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const SearchStack = createNativeStackNavigator()
const BookingsStack = createNativeStackNavigator() 

function SearchScreenStack() { 
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen 
                name="Search page" 
                component={SearchScreen} 
                options={{ 
                    headerTitle: () => <Text style={styles.headerText}>Search</Text>,
                    headerRight: () => <AccountDisplay />,
                }}
            />
        </SearchStack.Navigator>
    )
}

function BookingsScreenStack() { 
    return (
        <BookingsStack.Navigator>
            <BookingsStack.Screen 
                name="Bookings page" 
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
                <MainStack.Screen name="Renter Login" component={LoginScreen} />
                <MainStack.Screen name="Home" options={{ headerShown: false }}>
                {() => (
                    <Tab.Navigator>
                        <Tab.Screen 
                            name="Search" 
                            component={SearchScreenStack} 
                            options={{ 
                                headerShown: false,
                                tabBarIcon: ({ color, size }) => (
                                    <Entypo name="magnifying-glass" size={size} color={color} />
                                )
                            }}
                        />
                        <Tab.Screen 
                            name="Bookings" 
                            component={BookingsScreenStack} 
                            options={{ 
                                headerShown: false,
                                tabBarIcon: ({ color, size }) => (
                                    <Entypo name="open-book" size={size} color={color} />
                                )
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