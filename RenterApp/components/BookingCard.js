import { Text, View, StyleSheet, Image, Pressable } from "react-native";

//import icons
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BookingCard({ listing }) {
  const vehicleIcon = {
    car: (
      <MaterialCommunityIcons name="car-hatchback" size={24} color="black" />
    ),
    truck: (
      <MaterialCommunityIcons
        name="car-lifted-pickup"
        size={24}
        color="black"
      />
    ),
    van: <MaterialCommunityIcons name="van-utility" size={24} color="black" />,
    motorcycle: (
      <MaterialCommunityIcons name="motorbike" size={24} color="black" />
    ),
    scooter: (
      <MaterialCommunityIcons name="scooter-electric" size={24} color="black" />
    ),
    bicycle: <MaterialCommunityIcons name="bicycle" size={24} color="black" />,
  };

  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: listing.listingImgUrl }} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.vehicleName}</Text>
        <Text style={styles.text}>
          Confirmation Code: {listing.confirmationCode}
        </Text>
        <Text style={styles.text}>Owned by: {listing.ownerName}</Text>
        <Image style={styles.ownerImage} source={{ uri: listing.ownerImage }} />
        <Text style={styles.text}>
          {listing.address.postalAdd.formattedAddress}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text style={styles.price}>${listing.price}/day</Text>
          <View>{vehicleIcon[listing.vehicleType]}</View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>{listing.capacity}</Text>
            <Ionicons name="people" size={24} color="black" />
          </View>
        </View>
        <Pressable
          style={[
            styles.statusBtn,
            listing.status === "cancelled"
              ? { backgroundColor: "red" }
              : { backgroundColor: "#50C878" },
          ]}
        >
          <Text style={styles.subTitle}>{listing.status}</Text>
        </Pressable>
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
    color: "#50C878",
    fontWeight: "bold",
  },
  statusBtn: {
    flexDirection: "row",
    color: "black",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
},
subTitle: {
  marginBottom: 7,
  fontSize: 18,
  fontWeight: "400",
  color: "#4a4a4a",
},
});
