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

export const getListings = async () => {
    try {
        const docRef = doc(db, "ownerData", auth.currentUser.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log("ownerData document found")
            if (docSnap.data().listings.length > 0) {
                const listingsData = docSnap.data().listings  //get the listings array from the ownerData document
                const listingsWithImages = await Promise.all( //map through listingsData and get save the correct image url to the each listing
                    listingsData.map(async (listing) => {
                        const imageUrl = await getImage(listing.photoFileName)
                        return { ...listing, imageUrl }
                    })
                )
                //console.log("DEBUG - listingsWithImages:", listingsWithImages)
                return listingsWithImages
            }
        } else if (docSnap.data() === undefined) {
            console.log("No such document!")
        }
    } catch (error) {
        console.log(error)
    }
}

export const getUserInfo = async () => {
    try {
        if (auth.currentUser) {
            const docRef = doc(db, "ownerData", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let userInfo = { name: docSnap.data().name, photoUrl: docSnap.data().photoUrl };
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