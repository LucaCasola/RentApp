import { StyleSheet, Text, View, Image, Dimensions} from 'react-native'

const MyComponent = ({listing, bookings}) => {
    return (
        <View style={{flexDirection: 'column', borderWidth: 1, borderRadius: 28}}>
            <View>       
                <Image
                    style={{ width: '100%', height: 200, borderTopLeftRadius: 28, borderTopRightRadius: 28}} 
                    source={{ uri: listing.imageUrl }}
                />
            </View>
            <View styles={{padding: 20}}> 
                <Text>{listing.vehicleName}</Text>
                <Text>Vehicle type: {listing.vehicleType}</Text>
                <Text>Price per day: ${listing.price}</Text>
                <Text>{listing.location}</Text>
                <Text>{listing.renterId}</Text>
                <Text>{listing.renterId}</Text>
            </View>

            {bookings && (
                <View styles={{}}> 
                    <Text>Renter: </Text>
                </View>
            )}
            

        </View>
    );
};

export default MyComponent;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',     
        padding:20,
    },  

});
