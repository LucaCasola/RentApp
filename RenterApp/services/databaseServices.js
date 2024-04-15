import { db, auth, storage } from '../firebaseConfig'
import { doc, getDoc } from "firebase/firestore"
import { ref, getDownloadURL} from "firebase/storage"


export const getImage = async (fileName) => {
    try {
        const relativePath = '/' + fileName
        const reference = ref(storage, relativePath)
        const url = await  getDownloadURL(reference)
        //console.log("DEBUG - photo url:", url)
        return url // Return the url
    } catch (e) {
        console.log(fileName)
        console.log('Errors while downloading => ', e)
    }
}

export const getUserInfo = async () => {
    try {
        if (auth.currentUser) {
            const docRef = doc(db, "renterData", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userInfo = { name: docSnap.data().name, photoUrl: docSnap.data().photoUrl };
                return userInfo;
            } else {
                console.log("ERROR - getUserInfo() - No user document found!");
            }
        } else {
            console.log("ERROR - getUserInfo() - No user is signed in");
        }
    } catch (error) {
        console.log("ERROR - getUserInfo() - Error getting document:", error);
    }
}