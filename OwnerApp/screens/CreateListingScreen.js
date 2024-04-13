import { StyleSheet, Text, SafeAreaView, ScrollView, View, TextInput, Pressable} from 'react-native'
import {useState, useEffect} from "react"
import { Picker } from '@react-native-picker/picker'
import uuid from 'react-native-uuid';
import * as Location from 'expo-location'
import * as ImagePicker from "expo-image-picker"

// Firebase imports
import { auth, db, storage }from '../firebaseConfig'
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { ref, uploadBytesResumable } from "firebase/storage";

// Import icons
import { AntDesign } from '@expo/vector-icons'

const CreateListingScreen = ({navigation}) => {
    // Form fields
    const [vehicleType, setVehicleType] = useState("")
    const [vehicleName, setVehicleName] = useState("")
    const [city, setCity] = useState("")
    const [address, setAddress] = useState("")
    const [price, setPrice] = useState(0)
    const [capacity, setCapacity] = useState(1)

    // Image variables
   const [imageFromGallery, setImageFromGallery] = useState(null)
   const [resultsLabel, setResultsLabel] = useState("")


    // Capacity button pressed functions
    const decreaseBtnPressed = () => {
        if (capacity > 1) {
            setCapacity(capacity - 1)
        }
    }
    const increaseBtnPressed = () => {
        setCapacity(capacity + 1)
    }

    const requestPermissions = async () => {
        try {           
            const permissionsObject =  
                await Location.requestForegroundPermissionsAsync()
            if (permissionsObject.status  === "granted") {
                console.log("Permission granted!")
                return true          
            } else {
                console.log("Permission denied")
                alert("Permission denied or not provided")    
                return false           
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }
    
    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        console.log(result)
 
        // check if user selected a photo
        if (result.canceled === true) {
            setResultsLabel("No photo selected")
            setImageFromGallery(null)
            return
        }
 
        setResultsLabel(`Path to photo: ${result.assets[0].uri}`)
        setImageFromGallery(result.assets[0].uri)
    }
 
    const saveToCloud = async () => {
        if (imageFromGallery === "") {
            alert("No photo selected")
            return
        } else {
            console.log("DEBUG: Path to image is:")
            console.log(imageFromGallery)           
        }
 
        // get name of file
        // find the last / symbol
        // then get all text after the / symbol
        const filename = imageFromGallery.substring(imageFromGallery.lastIndexOf('/') + 1, imageFromGallery.length);
 
        // create a "path" in Firebase Storage
        const photoRef = ref(storage, filename)
 
        try {           
            // download the image from the phone's gallery
            console.log(`DEBUG: retrieving image data`)
            const response = await fetch(imageFromGallery)           
            // convert the image into a Blob data type
            console.log(`DEBUG: converting data to a blob`)
            // The Blob data type is used to represent file and other media streams in a database
            const blob = await response.blob()            
            // upload the blob to Firebase Storage           
            console.log(`DEBUG: Uploading data`)
            await uploadBytesResumable(photoRef, blob)           
            alert("Done uploading!")
            console.log(`DEBUG: Done uploading!`)
        } catch (err) {
            console.log(err)
        }
    }
 

    const createListingPressed = async () => {
        try {
            if(requestPermissions()) {  //if permission is granted
                const location = address + ", " + city
                const geocodedLocations = await Location.geocodeAsync(location)
                const geocodedLocation = geocodedLocations[0]

                if (!geocodedLocation) {
                    alert("No coordinates found for the address entered. Please try again.")
                    return
                }

                const newListing = {
                    id: uuid.v4(),  //generate random unique id
                    vehicleName,
                    vehicleType,
                    address: geocodedLocation,
                    city: city,
                    price,
                    capacity,
                    renterId: [],
                    photoFileName: imageFromGallery.substring(imageFromGallery.lastIndexOf('/') + 1, imageFromGallery.length)
                }
        
                try {
                    const docToUpdate = doc(db, "ownerData", auth.currentUser.uid) //specify which collection and document id to query
                    await updateDoc(
                        docToUpdate, 
                        { listings: arrayUnion(newListing) }  //appends the listing to the array
                    )
                    await saveToCloud()
                    alert("Listing successfully created!")
                    navigation.navigate("Listings")
                } catch (error) {
                    console.log(error)
                }
            }
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
                                <Picker.Item label="Bike" value="bike" />
                                <Picker.Item label="E-Scooter" value="scooter" />
                            </Picker>
                        </View>
                    </View>

                    {/* Vehicle capacity input */}
                    <View style={[styles.item, {marginLeft: 10}]}>
                        <Text style={styles.headingText}>Capacity:</Text>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20}}>
                            <AntDesign name="minuscircleo" size={30} color="black" onPress={decreaseBtnPressed}/>
                            <Text style={styles.text}>{capacity} people</Text>
                            <AntDesign name="pluscircleo" size={30} color="black" onPress={increaseBtnPressed} />
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
