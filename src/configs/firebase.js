// src/Firebase.js
// firebase.js
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection,
    doc,
    query,
    getDocs,
    orderBy,
    onSnapshot,
    deleteDoc,
    addDoc,
    serverTimestamp
} from "firebase/firestore"; // For Firestore


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(firebaseApp);


async function saveFavoriteLocation(city) {
    try {
         await addDoc(collection(db, 'favorites'), {
            city,
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Error adding document: ", error);
    }

}

async function removeFavoriteLocation(city) {
    try {
        const docRef = doc(db, 'favorites', city);
        await deleteDoc(docRef);
        console.log(`Document ${city} successfully deleted!`);
        await getFavoriteLocations();
        return true;
    } catch (error) {
        console.error("Error deleting document: ", error);
        return false;
    }
}

async function getFavoriteLocations() {
    try {
        const q = query(collection(db, 'favorites'));
        const querySnapshot = await getDocs(q);
        let favorites = []
        querySnapshot.docs.map(doc => (
            favorites.push(
                {
                    id: doc.id,
                    city: doc.data().city,
                    createdAt: doc.data().createdAt
                }
            )

            ));

        return favorites;
    } catch (error) {
        return [];
    }
}

export { saveFavoriteLocation, getFavoriteLocations , removeFavoriteLocation};
