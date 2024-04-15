import { StyleSheet, Text, View, Image, Pressable} from 'react-native'
import {useState, useEffect} from "react"
import { auth } from '../firebaseConfig'
import { signOut } from "firebase/auth"

import { getUserInfo } from '../services/databaseServices'

const AccountScreen = ({navigation}) => {
    const [userInfo, setUserInfo] = useState([])

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

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (auth.currentUser) {
                setUserInfo(await getUserInfo())
            }
        }

        fetchUserInfo()
    }, [])

    return(
        <View style={styles.container}>  
            <Pressable onPress={logoutPressed} style={styles.logoutBtn}>
                <Text style={{ fontSize:16, textAlign:"center" }}>Logout</Text>
            </Pressable>
            <Text style={{ fontSize:16, textAlign:"center" }}>{userInfo.name}</Text>
            <Image
                style={{ width: 55, height: 55, borderRadius: 32}}
                source={{ uri: userInfo.photoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}}
            />
        </View>
    )
}
export default AccountScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',     
        padding:20,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    logoutBtn: {
        backgroundColor: '#FF7F7F',
        borderWidth: 2, 
        borderRadius: 16, 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
    }
})
