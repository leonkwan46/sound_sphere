import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Keep this import too
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD4iOt6TVNe6NANuORbdOz_TLjeYbquU6A',
  authDomain: 'soundsphere-ddf6a.firebaseapp.com',
  projectId: 'soundsphere-ddf6a',
  storageBucket: 'soundsphere-ddf6a.firebasestorage.app',
  messagingSenderId: '864910945885',
  appId: '1:864910945885:web:ac6145f0cc609d867767b4',
  measurementId: 'G-40MEXL3NK4',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const db = getFirestore(app)

export { auth, db }
