import * as firebase from 'firebase/app'
import 'firebase/database'

var firebaseConfig = {}

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
export default firebaseApp
