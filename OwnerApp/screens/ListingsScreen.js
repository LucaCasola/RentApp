import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import {useState, useEffect} from "react"

import { getListings } from '../services/databaseServices'
import CardComponent from '../components/CardComponent'

// Import icons
import { AntDesign } from '@expo/vector-icons';

const ListingsScreen = ({navigation}) => {
    const [listings, setListings] = useState([])

    //useEffect to call getListings when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {  //call getListings every time the screen is focused
            setListings(await getListings())                       
        })
        return unsubscribe //clean up the event listener when done
    }, [navigation])


    return(
        <View style={styles.container}>  
            { (listings) ? ( 
                <FlatList
                    ListHeaderComponent={
                        <Pressable style={styles.btn} onPress={() => navigation.navigate('Create new Listing')}>
                            <Text style={styles.btnLabel}>Create new Listing</Text>
                            <AntDesign name="pluscircleo" size={24} color="black" />
                        </Pressable>
                    }
                    data={listings}
                    keyExtractor={(listing)=>{return listing.id}}
                    renderItem={
                        ({item})=>{
                            return(
                                <CardComponent listing={item}/>
                            )
                        }
                    }
                    ItemSeparatorComponent={()=> {
                        return ( <View style={{padding: 12}}></View> )
                    }}
                />
            ) : (
                <Pressable style={styles.btn} onPress={() => navigation.navigate('Create new Listing')}>
                    <Text style={styles.btnLabel}>Create new Listing</Text>
                    <AntDesign name="pluscircleo" size={24} color="black" />
                </Pressable>
            )}
        </View>
    )

}
export default ListingsScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',     
        padding: 16,
    },  
    btn: {
        flexDirection: "row",
        borderWidth:1,
        borderColor:"#141D21",
        borderRadius: 8,
        padding: 16,
        marginVertical: 16,
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
    },
    btnLabel: {
        fontSize:16,
        textAlign:"center", 
        paddingRight: 10
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
