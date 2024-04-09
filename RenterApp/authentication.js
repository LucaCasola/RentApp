import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";




const loginPressed = async () => {
    var email = "lcasola@myseneca.ca"
    var password = "123456"

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log(`loginPressed: Who is the currently logged in user? ${auth.currentUser.uid}`)
        alert("Login complete!")
    } catch(error) {
        console.log(`Error code: ${error.code}`)
        console.log(`Error message: ${error.message}`)
        console.log(error) //full error message
    }
}
