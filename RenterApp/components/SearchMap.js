import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Text,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import generateConfirmationCode from "./generateConfirmCode";

// import icons
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchMap({ navigation }) {
  // state variables
  // curr user location
  const [location, setLocation] = useState(null);
  // loading status
  const [loading, setLoading] = useState(true);
  // storing owner listings
  const [ownerInfo, setOwnerInfo] = useState([]);
  // product location markers
  const [markers, setMarkers] = useState([]);
  // for storing selected marker
  const [selectedMarker, setSelectedMarker] = useState(null);
  // booking status for the selected marker
  const [bookingStatus, setBookingStatus] = useState(false);

  // reference to the map view
  const mapViewRef = useRef(null);

  // checking for booking status
  const checkIn = async (marker) => {
	// -------   handling owner side first   -------
	const docRef = doc(db, "ownerData", marker.ownerID);

	// Get the document
	const docSnap = await getDoc(docRef);
	// Get the current listings
	const listings = docSnap.data().listings;

	// Find the listing you want to update
	const listingToUpdate = listings.find(
	  (listing) => listing.id === marker.id
	);

	// Check if the vehicle is already booked by the same user
	const isAlreadyBooked = await listingToUpdate.bookings.some(
	  (booking) =>
		booking.renterId === auth.currentUser.uid &&
		booking.status === "confirmed"
	);

	setBookingStatus(isAlreadyBooked);
  };

  const MarkerCard = ({ marker }) => {
    console.log(`Marker clicked`);
    if (!marker) return null;

    useEffect(() => {

      checkIn(marker);
    }, [bookingStatus]);

    return (
      <View style={styles.card}>
        {/* close marker card */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedMarker(null)}
        >
          <Ionicons name="close-circle-outline" size={24} color="black" />
        </TouchableOpacity>

        {/* marker card content */}
        <Text style={styles.title}>{marker.vehicleName}</Text>
        <Text style={styles.text}>Type: {marker.vehicleType}</Text>
        <Text style={styles.text}>Price: {marker.price}</Text>
        <Text style={styles.text}>Capacity: {marker.capacity}</Text>
        {!bookingStatus ? (
          <Button
            title="Book"
            onPress={() => {
              handleBooking(marker);
            }}
          />
        ) : (
          <Button
            title="Confirmed"
            onPress={() => {
              alert("Not implemented yet :)");
            }}
            disabled
          />
        )}
      </View>
    );
  };

  // handle booking
  const handleBooking = async (vehicle) => {
    console.log("Attempting to get Vehicle...");

    try {
      // -------   handling owner side first   -------
      const docRef = doc(db, "ownerData", vehicle.ownerID);

      // Get the document
      const docSnap = await getDoc(docRef);
      // Get the current listings
      let listings = docSnap.data().listings;

      // Find the listing you want to update
      let listingToUpdate = listings.find(
        (listing) => listing.id === vehicle.id
      );

      // Check if the vehicle is already booked by the same user
      let isAlreadyBooked = listingToUpdate.bookings.some((booking) => {
        return (
          booking.renterId === auth.currentUser.uid &&
          booking.status === "confirmed"
        );
      });

      setBookingStatus(isAlreadyBooked);

      if (!isAlreadyBooked) {
        // Update the bookings in the listing
        listingToUpdate.bookings.push({
          renterId: auth.currentUser.uid,
          status: "confirmed",
        });

        // Update the document with the new listings
        await updateDoc(docRef, { listings: listings });

        // --------------------------------------------------------

        // -------  handling renter side   -------
        const renterRef = doc(db, "renterData", auth.currentUser.uid);

        // Get the document
        const renterSnap = await getDoc(renterRef);
        // Get the current bookings
        let bookings = renterSnap.data().bookings;

        // Add the booking to the renter's bookings
        bookings.push({
          ownerID: vehicle.ownerID,
          listingID: vehicle.id,
          status: "confirmed",
		  confirmationCode: generateConfirmationCode(),
        });

        // Update the document with the new bookings
        await updateDoc(renterRef, { bookings: bookings });

        alert(`Booked ${vehicle.vehicleName}`);

        setSelectedMarker(null);
      } else {
        console.log("Vehicle already booked by you");
        alert("Vehicle already booked by you");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const requestPermissions = async () => {
    try {
      // request permission to access user's location
      const permissionsObject =
        await Location.requestForegroundPermissionsAsync();

      // get the current location if permission is granted
      if (permissionsObject.status === "granted") {
        getCurrentPosition();
      } else {
        alert("Permission denied or not provided");
        navigation.navigate("Account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentPosition = async () => {
    try {
      const currLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // set the location state to the current location
      setLocation(currLocation);
      setLoading(false);

      // logging user curr location info
      console.log(currLocation);

      // animate the map to the current location
      // maybe change to animateCamera later
      mapViewRef?.current?.animateToRegion({
        latitude: currLocation.coords.latitude,
        longitude: currLocation.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  //get product markers from the Firestore database
  const getMarkers = async () => {
    console.log("Getting markers...");
    try {
      // Retrieve all documents from a collection called "ownerData"
      const ownerData = await getDocs(collection(db, "ownerData"));

      // clear the ownerInfo state before adding new data
      setOwnerInfo([]);

      // iterating through the ownerData collection and logging the data
      ownerData.forEach((currOwner) => {
        console.log(`--------------------------------------------------`);
        console.log(`Owner id: ${currOwner.id}`);
        console.log("Owner data:");
        console.log(currOwner.data());
        console.log(`--------------------------------------------------`);
        // kept the owner data and ownerID in same object
        let tempOwnerInfo = currOwner.data();
        tempOwnerInfo.ownerID = currOwner.id;
        ownerInfo.push(tempOwnerInfo);
      });
    } catch (err) {
      console.log(err);
    }

    // using temp array to store the markers
    const tempListing = [];

    // iterate through the ownerInfo array and get the listings and owner info
    await ownerInfo.forEach((owner) => {
      owner.listings.forEach((listing) => {
        tempListing.push({
          ownerID: owner.ownerID,
          id: listing.id,
          lat: listing.address.latitude,
          lng: listing.address.longitude,
          name: owner.name,
          vehicleName: listing.vehicleName,
          vehicleType: listing.vehicleType,
          price: listing.price,
          capacity: listing.capacity,
        });
      });
    });

    // set the markers state to the tempListing array
    setMarkers(tempListing);

    console.log(`Markers: ${JSON.stringify(markers)}`);
    console.log(`Markers Count: ${markers.length}`);
  };

  // get user's location when the component mounts
  useEffect(() => {
    requestPermissions();
  }, []);

  // show loading spinner while getting user's location
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <MapView
        ref={mapViewRef}
        style={[styles.mapStyle, { height: "100%" }]}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* show markers on the maps */}
        {markers.length > 0 &&
          markers.map((marker) => {
            return (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lng,
                }}
                // Might remove later
                onPress={() => setSelectedMarker(marker)}
              >
                <View style={styles.markerView}>
                  <Text>{marker.vehicleName}</Text>
                </View>
                <Ionicons name="pin" size={54} color="black" />
              </Marker>
            );
          })}
      </MapView>

      <MarkerCard marker={selectedMarker} />

      <Pressable
        style={[styles.button, { position: "absolute", top: 20, right: 20 }]}
        onPress={getMarkers}
      >
        <FontAwesome name="refresh" size={32} color="black" />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    width: "100%",
  },
  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  markerView: {
    alignSelf: "center",
    backgroundColor: "yellow",
    padding: 5,
    borderRadius: 10,
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 20,
    margin: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  text: {
    fontSize: 16,
  },
});
