import { StyleSheet, View, FlatList } from 'react-native'
import {useState, useEffect} from "react"

import { getListings } from '../services/databaseServices'
import CardComponent from '../components/CardComponent'

const BookingsScreen = ({navigation}) => {
    const [listings, setListings] = useState([])

    //useEffect to call getListings when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {  //call getListings every time the screen is focused
            setListings(await getListings())                       
        })
        return unsubscribe  //clean up the event listener when done
    }, [navigation])


    return(
        <View style={styles.container}>  
            { (listings ) && ( 
                <FlatList
                style={{}}
                data={listings}
                keyExtractor={(listing)=>{return listing.id}}
                renderItem={({ item }) => {
                    return item.bookings && item.bookings.length > 0 && (
                        <CardComponent listing={item} showBookings={true} />
                    );
                }}

                ItemSeparatorComponent={()=>{
                    return ( <View style={{padding: 12}}></View> )
                }}
                />
            ) }
        </View>
    )

}
export default BookingsScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',     
        paddingHorizontal: 16,
        paddingVertical: 16,
    }
})
