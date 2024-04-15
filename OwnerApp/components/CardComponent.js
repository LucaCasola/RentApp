import { Text, View, StyleSheet, Image, FlatList, Pressable } from "react-native"
import { useState, useEffect } from "react"
import { useIsFocused } from '@react-navigation/native';
import * as Location from "expo-location";

import { getUserInfo, getConfirmationCode, cancelBooking } from '../services/databaseServices'

//import icons
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CardComponent({ listing , showBookings = false}) {
    const [address, setAddress] = useState("")
    const [renterInfo, setRenterInfo] = useState([])
    const isFocused = useIsFocused();

    const vehicleIcon = {
        car: <MaterialCommunityIcons name="car-hatchback" size={24} color="black" />,
        truck: <MaterialCommunityIcons name="car-lifted-pickup" size={24} color="black" />,
        van: <MaterialCommunityIcons name="van-utility" size={24} color="black" />,
        motorcycle: <MaterialCommunityIcons name="motorbike" size={24} color="black" />,
        scooter: <MaterialCommunityIcons name="scooter-electric" size={24} color="black" />,
        bicycle: <MaterialCommunityIcons name="bicycle" size={24} color="black" />,
    }

    // Request permission to access location
    const requestPermissions = async () => {
        try {           
            const permissionsObject =  
                await Location.requestForegroundPermissionsAsync()
            if (permissionsObject.status  === "granted") {
                //console.log("Location permission granted!")
                return true          
            } else {
                console.log("Location permission denied")
                alert("Permission denied or not provided")    
                return false           
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    // Convert latitude and longitude to address
    const getLocation = async () => {
        if(requestPermissions()) {
            const coords = {
                latitude: listing.address.latitude,
                longitude: listing.address.longitude,
            };
            const postalAdd = await Location.reverseGeocodeAsync(coords);
            const result = postalAdd[0].formattedAddress;
            //console.log("DEBUG - getLocation() - location: ", result)
            setAddress(result)
        }
    }

    const getRenters = async () => {
        try {
            let renters = []

            for (let i = 0; i < listing.bookings.length; i++) {
                let renter = await getUserInfo("renterData", listing.bookings[i].renterId)
                let confirmationCode = await getConfirmationCode(listing.bookings[i].renterId, listing.id)
                let renterObj = {
                    name: renter.name, 
                    photoUrl: renter.photoUrl, 
                    status: listing.bookings[i].status, 
                    renterId: listing.bookings[i].renterId,
                    confirmationCode: confirmationCode
                }
                renters.push(renterObj)
            }

            setRenterInfo(renters)
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        const fetchLocationAndRenters = async () => {
            await getLocation();
            if (showBookings) {
                await getRenters();
            }
        };

        if (isFocused) {
            fetchLocationAndRenters();
        }
    
    }, [isFocused])

    return (
        <View style={styles.card} id={listing.id}>
            <Image style={styles.image} source={{ uri: listing.imageUrl }} />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{listing.vehicleName}</Text>
                <Text style={styles.text}>{address} </Text>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={styles.price}>${listing.price}/day</Text>
                    <View>{vehicleIcon[listing.vehicleType]}</View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.text}>{listing.capacity}</Text>
                        <Ionicons name="people" size={24} color="black" />
                    </View>
                </View>
            </View>

            {(showBookings && renterInfo) && (
                <View>
                    <FlatList
                    data={renterInfo}c
                    renderItem={
                        ({item})=>{
                            return(
                                <View>
                                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10}}>
                                        <View>
                                            <Image style={styles.renterImage} source={{ uri: item.photoUrl }} />
                                            <Text style={styles.subTitle}>{item.name}</Text>
                                        </View>
                                        <Text style={styles.subTitle}>Code: {item.confirmationCode}</Text>
                                        <MaterialCommunityIcons name="cancel" size={24} color="black" onPress={() => cancelBooking(listing.id, item)}/>
                                    </View>

                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <Pressable style={[styles.statusBtn, item.status === "cancelled" ? { backgroundColor: 'red' } : {backgroundColor: "#50C878"}]}>
                                            <Text style={styles.subTitle}>{item.status}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )
                        }
                    }
                    ItemSeparatorComponent={()=> {
                        return ( <View style={{padding: 2, marginBottom: 20, backgroundColor: "#d3d3d3"}}></View> )
                    }}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: "#f8f4f4", // light background color
        marginBottom: 20,
        overflow: "hidden",
        borderWidth: 1, // add border
        borderColor: "#a9a9a9", // gray border color
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    statusBtn: {
        flex: 1,
        flexDirection: "row",
        color: "black",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
        justifyContent: "center",
        marginHorizontal: 10,
        marginBottom: 30
    },
    detailsContainer: {
        padding: 20,
    },
    image: {
        width: "100%",
        height: 200,
    },
    renterImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    title: {
        marginBottom: 7,
        fontSize: 24,
        fontWeight: "500",
    },
    subTitle: {
        marginBottom: 7,
        fontSize: 18,
        fontWeight: "400",
        color: "#4a4a4a",
    },
    text: {
        fontSize: 16,
        color: "#4a4a4a",
    },
    price: {
        fontSize: 18,
        color: "#50C878",
        fontWeight: "bold",
    },
})