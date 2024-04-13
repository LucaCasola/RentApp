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
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

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

  // header button for refreshing markers
  navigation.setOptions({
    headerRight: () => (
      <Pressable style={styles.button} onPress={getMarkers}>
        <Text style={styles.buttonLabel}>Refresh Markers</Text>
      </Pressable>
    ),
  });

  const MarkerCard = ({ marker }) => {
    if (!marker) return null;

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
        <Button
          title="Book"
          onPress={() => alert(`Booked ${marker.vehicleName}`)}
        />
      </View>
    );
  };

  const mapViewRef = useRef(null);

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
    width: "45%",
    height: "60%",
    backgroundColor: "black",
    marginTop: 5,
    marginRight: 2,
  },
  buttonLabel: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    paddingVertical: "5%",
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
