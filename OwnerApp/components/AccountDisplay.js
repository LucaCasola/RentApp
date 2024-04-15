import { StyleSheet, Text, View, Image, Pressable} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect} from "react"
import { auth } from '../firebaseConfig'
import { signOut } from "firebase/auth"

import { getUserInfo } from '../services/databaseServices'

// import icon
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AccountDisplay = () => {
    const navigation = useNavigation();
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
                setUserInfo(await getUserInfo(collection="ownerData", userId=auth.currentUser.uid))
            }
        }

        fetchUserInfo()
    }, [])

    return(
        <View style={styles.container}>  
            <View style={{flexDirection: 'col'}}>
                <Image
                    style={{ width: 45, height: 45, borderRadius: 32}}
                    source={{ uri: userInfo.photoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}}
                />
                <Text style={{ fontSize:16, textAlign: "center" }}>{userInfo.name}</Text>
            </View>
            <MaterialCommunityIcons style={{paddingTop: 5}} onPress={logoutPressed} name="logout" size={35} color="black" />
        </View>
    )
}
export default AccountDisplay


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',     
        justifyContent: 'flex-end',
    },  
    logoutBtn: {
        backgroundColor: '#FF7F7F',
        borderWidth: 2, 
        borderRadius: 16, 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
        marginRight: 10
    }
})
