import { Text, View, StyleSheet, Image } from "react-native"
import { useState, useEffect } from "react"
import * as Location from "expo-location";

//import icons
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookingCard({ listing }) {
    const [address, setAddress] = useState("")

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
                console.log("Location permission granted!")
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

    useEffect(() => {
        getLocation()
    }, [])

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
    detailsContainer: {
        padding: 20,
    },
    image: {
        width: "100%",
        height: 200,
    },
    ownerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
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