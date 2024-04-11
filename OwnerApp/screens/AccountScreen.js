import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState, useEffect} from "react"
import { auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";


const AccountScreen = ({navigation}) => {
    const [email, setEmail] = useState(auth.currentUser.email)
    const [userId, setUserId] = useState(auth.currentUser.uid)

    const logoutPressed = async () => {
        console.log("Logging the user out..")
        try {
            if (auth.currentUser === null) {
                console.log("logoutPressed: There is no user to logout!")
            } 
            else {
                await signOut(auth)
                navigation.navigate("Owner Login")
                console.log("Logout complete")
            }
        } catch(error) {
            console.log("ERROR when logging out")
            console.log(error)
        }            
   }


   return(
       <View style={styles.container}>  
            <Text style={styles.headingText}>{email}</Text>
            <Text style={styles.headingText}>User id: {userId}</Text>

            <Pressable onPress={logoutPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Logout</Text>
            </Pressable>
       </View>
   )

}
export default AccountScreen


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
