import { StyleSheet, Text, View, FlatList, Pressable, Image} from 'react-native';
import {useState, useEffect} from "react"
import { db, auth, storage } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL} from "firebase/storage"

const ListingsScreen = ({navigation}) => {
    const [listings, setListings] = useState([])

    const getImage = async (fileName) => {
        try {
            const relativePath = '/' + fileName
            const reference = ref(storage, relativePath)
            const url = await  getDownloadURL(reference)
            console.log("photo url:", url)
            return url; // Return the url
        } catch (e) {
            console.log(fileName)
            console.log('Errors while downloading => ', e)
        }
    };

    const getListings = async () => {
        try {
            const docRef = doc(db, "ownerData", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("ownerData document found");
                if (docSnap.data().listings.length > 0) {
                    const listingsData = docSnap.data().listings;
                    const listingsWithImages = await Promise.all(
                        listingsData.map(async (listing) => {
                            const imageUrl = await getImage(listing.photoFileName); // Replace with your filename field
                            return { ...listing, imageUrl };
                        })
                    );
          
                  setListings(listingsWithImages);
                }
            } else if (docSnap.data() === undefined) {
                console.log("No such document!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getListings() //call getListings every time the screen is focused
        })
        return unsubscribe; //clean up the event listener when done
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
                                <View>
                                    <View style={{flexDirection: 'row', padding: 5, justifyContent: 'center'}}>
                                        <Text style={styles.headingText}>{item.vehicleName}</Text>
                                    </View>
                                    
                                    <Image
                                        style={{ width: 50, height: 50 }} 
                                        source={{ uri: item.imageUrl }}
                                    />
                                </View>
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
});
