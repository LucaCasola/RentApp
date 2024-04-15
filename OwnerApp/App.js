import { StyleSheet, View, Text, Pressable } from 'react-native'

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
import { AntDesign } from '@expo/vector-icons';

// tab navigator and stack navigator
const MainStack = createNativeStackNavigator()
const ListingsStack = createNativeStackNavigator()
const BookingsStack = createNativeStackNavigator() 
const Tab = createBottomTabNavigator()

function ListingsScreenStack({ navigation }) { 
    return (
        <ListingsStack.Navigator>
            <ListingsStack.Screen 
                name="Listings page" 
                component={ListingsScreen} 
                options={{ 
                    headerTitle: () =>  (
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={styles.headerText}>Listings </Text>

                            <Pressable 
                                style={styles.btn} 
                                onPress={() => navigation.navigate('Create new Listing')}
                            >
                                <AntDesign name="pluscircleo" size={24} color="black" />
                            </Pressable>
                        </View>
                    ),
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
                <MainStack.Screen name="Owner Login" component={LoginScreen} />
                <MainStack.Screen name="Home" options={{ headerShown: false }}>
                {() => (
                    <Tab.Navigator>
                        <Tab.Screen 
                            name="Listings" 
                            component={ListingsScreenStack} 
                            options={{ 
                                headerShown: false,
                                tabBarIcon: ({ color, size }) => (
                                    <Entypo name="list" size={size} color={color} />
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