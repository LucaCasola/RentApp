import { useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";

export default function BookingCard({ listing }) {
  return (
    <View style={styles.card} id={listing.id}>
      <Image style={styles.image} source={{ uri: listing.listingImgUrl }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.vehicleName}</Text>
        <Text style={styles.subTitle}>{listing.vehicleType}</Text>
        <Text style={styles.text}>Owned by: {listing.ownerName}</Text>
        <Image style={styles.ownerImage} source={{ uri: listing.ownerImage }} />
        <Text style={styles.text}>Address: {listing.address.postalAdd.formattedAddress}</Text>
        <Text style={styles.text}>Capacity: {listing.capacity}</Text>
        <Text style={styles.price}>${listing.price}/day</Text>
      </View>
    </View>
  );
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
    color: "#fc5c65",
    fontWeight: "bold",
  },
});
