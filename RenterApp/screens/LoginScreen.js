import { StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import { useState } from "react"
import { db, auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


// Import the specific functions from the service (import ___ from "firebase/firebase auth)
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({navigation}) => {
    // form fields
    const [emailFromUI, setEmailFromUI] = useState("kelvin@gmail.com") //TODO: change this to an empty string when done testing
    const [passwordFromUI, setPasswordFromUI] = useState("123456")     //TODO: change this to an empty string when done testing

    const loginPressed = async () => {
        console.log("Logging in...")
        // if there is already a person logged in , then don't login again
        if (auth.currentUser === null) { 
            console.log("No user currently logged in. Attempting to login...")
            try {
                try {
                    await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI)
                    console.log("Login successful!")

                    const docRef = doc(db, "renterData", auth.currentUser.uid); //specify which collection and document id to query
                    const docSnap = await getDoc(docRef); //attempt to get the specified document

                    if (docSnap.exists()) {
                        navigation.navigate("Home")
                    } else {
                        console.log("No such document in renterData!");
                        alert("Please login with a renter account")
                        await signOut(auth)
                        console.log("Logout successful!")
                    }
                } catch (error) {
                    alert("Invalid account details")
                }
            } catch(error) {
                console.log(`Error code: ${error.code}`)
                console.log(`Error message: ${error.message}`)
                console.log(error) //full error message
            }
        } else {
            navigation.navigate("Home")
        }
    }


   return(
       <View style={styles.container}>  
            <Text>Login</Text>
            <TextInput placeholder="Enter email" onChangeText={setEmailFromUI} value={emailFromUI} style={styles.tb}/>
            <TextInput placeholder="Enter password" onChangeText={setPasswordFromUI} value={passwordFromUI} style={styles.tb}/>
          
            <Pressable onPress={loginPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Login</Text>
            </Pressable>
       </View>
   )
}
export default LoginScreen



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',     
      padding:20,
    },
    tb: {
        width:"100%",   
        borderRadius:5,
        backgroundColor:"#efefef",
        color:"#333",
        fontWeight:"bold", 
        paddingHorizontal:10,
        paddingVertical:15,
        marginVertical:10,       
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
    error: {
         fontSize:16,
         textAlign:"center",
         color:"blue"
    }
 });