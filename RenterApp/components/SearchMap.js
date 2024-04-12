import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Text,
  View,
  Button,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function SearchMap({ navigation }) {
  // state variables
  // curr user location
  const [location, setLocation] = useState(null);
  // loading status
  const [loading, setLoading] = useState(true);
  // product location markers
  const [markers, setMarkers] = useState([]);
  // for storing selected marker
  const [selectedMarker, setSelectedMarker] = useState(null);
  // map height
  const [mapHeight, setMapHeight] = useState("95%");

  const MarkerCard = ({ marker }) => {
    if (!marker) return null;

    return (
      <View style={styles.markerCard}>
        <View style={{ alignSelf: "center" }}>
          <Text>{marker.name}</Text>
          <Text>{marker.desc}</Text>
        </View>
        <Button
          title="Close"
          onPress={() => {
            setSelectedMarker(null);
            setMapHeight("95%");
          }}
        />
      </View>
    );
  };

  const mapViewRef = useRef(null);

  // show product summary when clicked on marker
  const onMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setMapHeight("70%");
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
    const MARKERS_ARRAY = [
      {
        lat: 43.79663862288411,
        lng: -79.3488463612906,
        name: "Seneca College",
        desc: "Get your education here.",
      },
      {
        lat: 43.760757526422935,
        lng: -79.29724183878953,
        name: "Costco Wholesale",
        desc: "get your groceries here.",
      },
    ];

    setMarkers(MARKERS_ARRAY);
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
        style={[styles.mapStyle, { height: mapHeight }]}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsTraffic={true}
      >
        {/* show markers on the maps */}
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
              title={marker.name}
              description={marker.desc}
              onPress={() => onMarkerPress(marker)}
            >
              <Ionicons name="pin" size={54} color="black" />
            </Marker>
          );
        })}
      </MapView>
      <MarkerCard marker={selectedMarker} />
      <Pressable style={styles.button} onPress={getMarkers}>
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 18,
            paddingVertical: 5,
          }}
        >
          Refresh Markers
        </Text>
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
    borderRadius: 15,
    width: "55%",
    height: 40,
    alignSelf: "center",
    backgroundColor: "black",
    borderWidth: 1,
    marginTop: 2,
  },
  markerCard: {
    borderWidth: 2,
    borderColor: "black",
    // other styles...
  },
});
