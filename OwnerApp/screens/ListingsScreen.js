import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState, useEffect} from "react"
import { auth } from '../firebaseConfig';


const ListingsScreen = ({navigation}) => {
    const [email, setEmail] = useState(auth.currentUser.email)
    const [userId, setUserId] = useState(auth.currentUser.uid)

    return(
        <View style={styles.container}>  

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
