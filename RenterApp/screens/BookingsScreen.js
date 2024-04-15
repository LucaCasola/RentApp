import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";

// Firstore imports
import { auth, db, storage } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

// Lsiting Card Component
import BookingCard from "../components/BookingCard";
import { getImage } from "../services/databaseServices";

export default function BookingsScreen({ navigation }) {
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(true);

  const userOnThisScreen = useIsFocused();

  useEffect(() => {
    if (userOnThisScreen) {
      fetchListings();
    }
  }, [userOnThisScreen]);

  const fetchListings = async () => {
    console.log("fetching listings...");

    try {
      // get all listings from Firestore
      const renterRef = doc(db, "renterData", auth.currentUser.uid);

      // Get the document
      const renterSnap = await getDoc(renterRef);
      // Get the current bookings (array of listing and owner IDs with status)
      const bookings = renterSnap.data().bookings;

      // resolve all promises to get and set the listings
      const promises = bookings.map(async (booking) => {
        const docRef = doc(db, "ownerData", booking.ownerID);

        // Get the document
        const docSnap = await getDoc(docRef);
        // Get the current listings
        const ownerData = docSnap.data();

        // Find the listing you want to update
        const rentedListing = ownerData.listings.find(
          (listing) => listing.id === booking.listingID
        );

        // setting up listing image download URL
        rentedListing.listingImgUrl = await getImage(
          rentedListing.photoFileName
        );

        // remove not needed listing fields
        delete rentedListing.photoFileName;

        // reverse geoCoding (get address)
        const coords = {
          latitude: rentedListing.address.latitude,
          longitude: rentedListing.address.longitude,
        };
        const postalAdd = await Location.reverseGeocodeAsync(coords);
        const result = postalAdd[0];
        //log retrieved address
        console.log("Listing Address: ", result);
        if (result === undefined) {
          rentedListing.address.postalAdd = "City not found";
          console.log("Issues getting a address");
        } else {
          rentedListing.address.postalAdd = result;
        }

        // getting owner name and Image
        rentedListing.ownerName = ownerData.name;
        rentedListing.ownerImage = ownerData.photoUrl;
        rentedListing.confirmationCode = booking.confirmationCode;
        rentedListing.status = booking.status;

        return rentedListing;
      });

      // awaiting until all listings are fetched (P.S. all promises are resolved)
      const tempListing = await Promise.all(promises);
      setListings(tempListing);
      console.log("listings: ", tempListing);

      // stop loading
      setLoading(false);
    } catch (err) {
      console.error("Error getting Renter Listings: ", err);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={listings}
            keyExtractor={(listing) => listing.id}
            renderItem={({ item }) => <BookingCard listing={item} />}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#141D21",
    borderRadius: 8,
    paddingVertical: 16,
    marginVertical: 20,
  },
  btnLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  headingText: {
    fontSize: 24,
    paddingVertical: 8,
  },
  text: {
    fontSize: 18,
    paddingVertical: 8,
  },
});
