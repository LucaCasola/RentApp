import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import {useState, useEffect} from "react"

import { getListings } from '../services/listingsServices'
import CardComponent from '../components/CardComponent'

const ListingsScreen = ({navigation}) => {
    const [listings, setListings] = useState([])

    //useEffect to call getListings when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let list = await getListings()
            setListings(list) //call getListings every time the screen is focused
        })
        return unsubscribe //clean up the event listener when done
    }, [navigation])


    return(
        <View style={styles.container}>  
            <Pressable style={styles.btn} onPress={() => navigation.navigate('Create new Listing')}>
                <Text style={styles.btnLabel}>Create new Listing</Text>
            </Pressable>
            
            { (listings.length > 0 ) && ( 
                <View style={styles.container}>
                    <FlatList
                    style={{}}
                    data={listings}
                    keyExtractor={(listing)=>{return listing.id}}
                    renderItem={
                        ({item})=>{
                            return(
                                <CardComponent listing={item}/>
                            )
                        }
                    }

                    ItemSeparatorComponent={()=>{
                        return (
                        <View style={{borderWidth: 3, borderColor:"#fef1f1", borderRadius: 20}}>
                        </View>)
                    }}
                    />
                </View>  
            ) }
        </View>
    )

}
export default ListingsScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',     
        padding:20,
    },  
    btn: {
        borderWidth:1,
        borderColor:"#141D21",
        borderRadius:8,
        paddingVertical:16,
        marginVertical:20
    },
    btnLabel: {
        fontSize:16,
        textAlign:"center"
    },
    headingText: {
        fontSize:24,
        paddingVertical:8
    },
    text: {
        fontSize:18,
        paddingVertical:8
    }
})
