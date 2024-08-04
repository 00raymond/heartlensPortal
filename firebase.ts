
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const auth = getAuth();

const registerDoctor = async (email: string, password: string, name:string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const userData = {
        userType: 'doctor',
        name: name,
        isAdmin: false,
        isDoc: true,
        isPatient: false,
        docEmail: email,
        patientIds: [],
    };

    // Add user data to Firestore
    await setDoc(doc(db, 'users', uid), userData);

    console.log('Doctor registered and data added to Firestore');
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

const registerPatient = async (email: string, password: string, docId: string, name: string, additionalInfo: string) => {
    try {
        // search for the doctor's email
        const docRef = doc(db, 'users', docId);
        if (docRef==null) {
            console.error('Doctor does not exist');
            return;
        }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userData = {
          userType: 'patient',
          name: name,
          isAdmin: false,
          isDoc: false,
          isPatient: true,
          patientEmail: email,
          docEmail: docRef,
          docId: docId,
          additionalInfo: additionalInfo,
      };
  
      // Add user data to Firestore
      await setDoc(doc(db, 'users', uid), userData);
  
      console.log('User registered and data added to Firestore');
    } catch (error) {
      console.error('Error registering user:', error);
    }
}

const loginDoctor = async (email: string, password: string) => {
    // check if email exists
    // check if email is a doctor
    // check if password is correct
    // authenticate, redirect to doctor page. ensure page is only accessible to doctors
}

const loginAdmin = async (email: string, password: string) => {
    try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
    
        // Fetch the user document from Firestore
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
    
        if (!userDoc.exists()) {
          console.error('No such document!');
          throw new Error('User document does not exist');
        }
    
        const userData = userDoc.data();
        console.log('User data:', userData);
    
        // Check if the user is an admin
        if (userData.userType === 'admin') {
          console.log('Admin authenticated successfully');
          // Redirect to admin page or perform admin-specific actions
        } else {
          console.error('User is not an admin');
          throw new Error('User is not an admin');
          // Handle non-admin access attempt
        }
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Login failed');
        // Handle errors
      }
}


// Example usage
export { auth, registerPatient, registerDoctor, loginAdmin, loginDoctor };