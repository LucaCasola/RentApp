import { db, auth, storage } from '../firebaseConfig'
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
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

export const getUserInfo = async (collection, userId) => {
    try {
        if (collection && userId) {
            const docRef = doc(db, collection, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userInfo = { name: docSnap.data().name, photoUrl: docSnap.data().photoUrl };
                //console.log("DEBUG - getUserInfo() - userInfo:", userInfo)
                return userInfo;
            } else {
                console.log("ERROR - getUserInfo() - No user document found!");
            }
        } else {
            console.log("ERROR - getUserInfo() - No collection or userId specified");
        }
    } catch (error) {
        console.log("ERROR - getUserInfo() - Error getting document:", error);
    }
}

export const cancelBooking = async (listingId, bookingPassed) => {
    try {
        // Update the status of the booking to "cancelled" in the ownerData document
        const docRef = doc(db, "ownerData", auth.currentUser.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const listings = docSnap.data().listings
            const listingIndex = listings.findIndex((listing) => listing.id === listingId)
            //console.log("DEBUG - cancelBooking() - listingIndex:", listingIndex)
            //console.log("DEBUG - cancelBooking() - bookingPassed:", bookingPassed)

            const bookings = listings[listingIndex].bookings
            const bookingIndex = bookings.findIndex((booking) => booking.renterId === bookingPassed.renterId)
            //console.log("DEBUG - cancelBooking() - bookingIndex:", bookingIndex)

            bookings[bookingIndex].status = "cancelled"
            listings[listingIndex].bookings = bookings

            await updateDoc(docRef, { listings: listings }) 
        }


        // Update the status of the booking to "cancelled" in the renterData document
        const renterDocRef = doc(db, "renterData", bookingPassed.renterId)
        const renterDocSnap = await getDoc(renterDocRef)

        if (renterDocSnap.exists()) {
            const bookings = renterDocSnap.data().bookings
            const bookingIndex = bookings.findIndex((booking) => booking.listingID === listingId)
            //console.log("DEBUG - cancelBooking() - bookings:", booking)

            bookings[bookingIndex].status = "cancelled"
            
            await updateDoc(renterDocRef, { bookings: bookings }) 
        }


        alert('Booking cancelled successfully');
    } catch (error) {
        console.log(error)
        alert('Failed to cancel booking');
    }
}

export const getConfirmationCode = async (renterId, listingId) => {
    try {
        const docRef = doc(db, "renterData", renterId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const bookings = docSnap.data().bookings
            //console.log("DEBUG - getConfirmationCode() - bookings:", bookings)

            const bookingIndex = bookings.findIndex((booking) => booking.listingID === listingId)
            //console.log("DEBUG - getConfirmationCode() - bookingIndex:", bookingIndex)

            return bookings[bookingIndex].confirmationCode
        }
    } catch (error) {
        console.log(error)
    }

}
