import { StyleSheet, Text, ScrollView, View, TextInput, Pressable} from 'react-native'
import { useState } from "react"
import { Picker } from '@react-native-picker/picker'
import uuid from 'react-native-uuid'
import * as Location from 'expo-location'
import * as ImagePicker from "expo-image-picker"

// Firebase imports
import { auth, db, storage }from '../firebaseConfig'
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { ref, uploadBytesResumable } from "firebase/storage"

// Import icons
import { AntDesign } from '@expo/vector-icons'

const CreateListingScreen = ({navigation}) => {
    // Form fields
    const [vehicleType, setVehicleType] = useState("")
    const [vehicleName, setVehicleName] = useState("")
    const [capacity, setCapacity] = useState(1)
    const [imageFromGallery, setImageFromGallery] = useState(null)
    const [city, setCity] = useState("")
    const [address, setAddress] = useState("")
    const [price, setPrice] = useState(0)

    // Choose image from gallery
    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
 
        if (!result.canceled) {  //if the user selected an image
            //console.log("DEBUG - Image selected: ", result.assets[0].uri)
            setImageFromGallery(result.assets[0].uri)
            return
        }
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
    
    // Sends an alert if any of the form fields are invalid and returns false, otherwise returns true
    const formValidation = () => {
        let errors = []
    
        if (vehicleName === "") {
            errors.push("Please enter a vehicle name")
        }
        if (vehicleType === "" || vehicleType === "...") {
            errors.push("Please select a vehicle type")
        }
        if (imageFromGallery === null) {    
            errors.push("Please select an image")
        }
        if (city === "") {
            errors.push("Please enter a city")
        }
        if (address === "") {
            errors.push("Please enter an address")
        }
        if (price <= 0) {
            errors.push("Please enter a valid price")
        }
    
        if (errors.length > 0) {
            alert(errors.join('\n'))
            return false
        } else {
            return true
        }
    }

    // Save image to cloud storage
    const saveToCloud = async (image) => {
        if (image === "") {
            alert("No photo selected")
            return
        } 
        //console.log("DEBUG - Path to image is:", image)

        const filename = image.substring(image.lastIndexOf('/') + 1, image.length)
        const photoRef = ref(storage, filename)
 
        try {           
            const response = await fetch(image)
            const blob = await response.blob()            
            await uploadBytesResumable(photoRef, blob)           
        } catch (err) {
            console.log(err)
        }
    }
    
    // Convert address and city to geocoded location
    const forwardGeocode = async (address, city) => {
        if(requestPermissions()) {
            try {
                const location = address + ", " + city                           //combine address and city into one string
                const geocodedLocations = await Location.geocodeAsync(location)  //get the geocoded location
                //console.log("DEBUG - Geocoded location: ", geocodedLocations[0])       
                return geocodedLocations[0]                                      //return the first geocoded location
            } catch (error) {
                console.log(error)
            }
        }
    }

    // Create a new listing and save it to cloud database
    const createListingPressed = async () => {
        try {
            if (!formValidation()) {
                return
            }

            const geocodedLocation = await forwardGeocode(address, city)
            if (geocodedLocation === undefined) {
                return
            }

            const newListing = {
                id: uuid.v4(),  //generate random unique id
                vehicleName: vehicleName,
                vehicleType: vehicleType,
                capacity: capacity,
                photoFileName: imageFromGallery.substring(imageFromGallery.lastIndexOf('/') + 1, imageFromGallery.length),
                city: city,
                address: geocodedLocation,
                price: price,
                bookings: []
            }

            const docToUpdate = doc(db, "ownerData", auth.currentUser.uid) //specify which collection and document id to query
            await updateDoc(docToUpdate, { listings: arrayUnion(newListing) }) //appends the new listing to the owner's listings array
            await saveToCloud(imageFromGallery)  //save the image to cloud storage
            alert("Listing successfully created!")
            navigation.navigate("Listings page")
        } catch(error) {
            console.log(error)
        }
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>  
            {/* Vehicle Information*/}
            <View style={[styles.innerContainer, {flexGrow: 5}]}>
                <Text style={styles.sectionText}>Vehicle Details</Text>

                {/* Vehicle name input */}
                <View style={[styles.item, {flex : 2}]}>
                    <Text style={styles.headingText}>Vehicle Name</Text>
                    <TextInput style={styles.textInput}
                        placeholder="Enter vehicle name (ex: Toyota Carolla)"
                        value={vehicleName}
                        onChangeText={setVehicleName}/>
                </View>

                <View style={{flex: 4, flexDirection: 'row'}}>
                    {/* Vehicle type picker */}
                    <View style={[styles.item, {marginRight: 10}]}>
                        <Text style={styles.headingText}>Vehicle Type</Text>
                        <View style={{}}>
                            <Picker
                            selectedValue={vehicleType}
                            onValueChange={(itemValue, itemIndex) => setVehicleType(itemValue)}
                            >
                                <Picker.Item label="..." value="" />
                                <Picker.Item label="Car" value="car" />
                                <Picker.Item label="Truck" value="truck" />
                                <Picker.Item label="Van" value="van" />
                                <Picker.Item label="Motorcycle" value="motorcycle" />
                                <Picker.Item label="E-Scooter" value="scooter" />
                                <Picker.Item label="Bicycle" value="bicycle" />
                            </Picker>
                        </View>
                    </View>

                    {/* Vehicle capacity input */}
                    <View style={[styles.item, {marginLeft: 10}]}>
                        <Text style={styles.headingText}>Capacity:</Text>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20}}>
                            <AntDesign name="minuscircleo" size={30} color="black" onPress={() => capacity > 1 && setCapacity(capacity - 1)}/>
                            <Text style={styles.text}>{capacity} people</Text>
                            <AntDesign name="pluscircleo" size={30} color="black" onPress={() => setCapacity(capacity + 1)} />
                        </View>
                    </View>
                </View>  

                {/* Vehicle image input */}
                <View style={{flex: 2, alignItems: 'center'}}>
                    <Pressable style={styles.btn} onPress={chooseImage}>
                        <Text style={styles.headingText}>Select Image</Text>
                    </Pressable>
                </View>
            </View>

            {/* Booking Information*/}
            <View style={[styles.innerContainer, {flexGrow: 3}]}>
                <Text style={styles.sectionText}>Booking Information</Text>

                {/* Pickup location input */}
                <View style={{flex: 2, flexDirection: 'row'}}>
                    {/* Pickup city*/}
                    <View style={[styles.item, {marginRight: 10}]}>
                        <Text style={styles.headingText}>Pickup City</Text>
                        <TextInput style={{}}
                            placeholder="enter city"
                            value={city}
                            onChangeText={setCity}/>
                    </View>

                    {/* Pickup address*/}
                    <View style={[styles.item, {marginLeft: 10}]}>
                        <Text style={styles.headingText}>Pickup Address</Text>
                        <TextInput style={{}}
                            placeholder="enter address"
                            value={address}
                            onChangeText={setAddress}/>
                    </View>
                </View>

                {/* Price input */}
                <View style={styles.item}>
                    <Text style={styles.headingText}>Price</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput style={[styles.textInput, {flex: 1}]}
                            placeholder="Enter price (ex: 150)"
                            value={price.toString()}
                            onChangeText={setPrice}/>
                        <Text style={styles.text}>per day</Text>
                    </View>
                </View>
            </View>

            <View style={{alignItems: 'center'}}>
                <Pressable style={styles.btn} onPress={createListingPressed}>
                    <Text style={styles.headingText}>Complete</Text>
                </Pressable>
            </View>  
        </ScrollView>
    )

}
export default CreateListingScreen


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',     
        padding: 20,
        justifyContent: 'space-between',
    },  
    innerContainer: {
        flexDirection: 'column',
        backgroundColor: '#f0eded',  
        padding: 8,
        borderRadius: 14,   
        marginBottom: 20,
    },  
    item: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',  
        marginVertical: 12,
        paddingHorizontal: 8,
        paddingVertical: 4, 
        borderWidth: 2,
        borderRadius: 8,
        borderColor: 'black',
        alignContent: 'center',
    },
    sectionText: {
        fontSize: 24,
        padding: 10,
    },
    headingText: {
        fontSize: 16,
        color: 'black',
    },
    text: {
        fontSize: 16,
        paddingHorizontal: 10,
    },
    textInput: {
        fontSize: 14,
    },
    btn: {
        backgroundColor: 'white',  
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
