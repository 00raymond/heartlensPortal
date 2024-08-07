
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserDataInterface } from '@/types/userData';

const auth = getAuth();

/// Logs the user out
const logout = async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
    }
};


/// Registers an admin user
const registerAdmin = async (email: string, password: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        const userData = {
            userType: 'admin',
            name: name,
            isAdmin: true,
            isDoc: false,
            isPatient: false,
        };

        await setDoc(doc(db, 'users', uid), userData);

        console.log('Admin registered and data added to Firestore');
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

/// Registers a doctor user with the given email, password, name, and parent ID of who created it
const registerDoctor = async (email: string, password: string, name:string, parentId:string) => {
  try {

    const parentRef = doc(db, 'users', parentId);
    if (parentRef==null) {
        console.error('Doctor does not exist');
        return;
    }

    let parentEmail = null;

    const parentDoc = await getDoc(parentRef);
    if (!parentDoc.exists()) {
        console.error('No such document!');
        return;
    } else {
        parentEmail = parentDoc.data().email;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userData = {
        userType: 'doctor',
        name: name,
        isAdmin: false,
        isDoc: true,
        isPatient: false,
        isActive: true,
        email: email,
        parentEmail: parentEmail,
        patientIds: [],
    };

    // Add user data to Firestore
    await setDoc(doc(db, 'users', uid), userData);

    console.log('Doctor registered and data added to Firestore');

    await auth.signOut();
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

/// Registers a patient user with the given email, password, parent ID, name, and additional info
const registerPatient = async (email: string, password: string, parentId: string, name: string, additionalInfo: string) => {
    try {
        // search for the doctor's email
        const docRef = doc(db, 'users', parentId);
        
        if (docRef==null) {
            console.error('Doctor does not exist');
            return;
        }

        let docEmail = null;

        // get docEmail
        const docData = await getDoc(docRef);
        if (!docData.exists()) {
            console.error('No such document!');
        } else {
          docEmail = docData.data().email;
        }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const userData = {
        userType: 'patient',
        name: name,
        isAdmin: false,
        isDoc: false,
        isPatient: true,
        email: email,
        parentEmail: docEmail,
        parentId: parentId,
        isActive: true,
        additionalInfo: additionalInfo,
      };
  
      await setDoc(doc(db, 'users', uid), userData);
  
      console.log('User registered and data added to Firestore');
      await auth.signOut();
    } catch (error) {
      console.error('Error registering user:', error);
    }
}

/// Toggles the user activity status. Disables the user if active, enables the user if disabled
const toggleUserActivity = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        console.error('No such document!');
        return;
      }
  
      const userData = userDoc.data();
      const isActive = userData.isActive;
  
      await setDoc(userDocRef, { isActive: !isActive }, { merge: true });
  
      console.log('User activity status updated');
    } catch (error) {
      console.error('Error updating user activity status:', error);
    }
};

/// Logs in a doctor user with the given email and password, checking if their userType is doctor
const loginDoctor = async (email: string, password: string) => {
    // check if email exists
    // check if email is a doctor
    // check if password is correct
    // authenticate, redirect to doctor page. ensure page is only accessible to doctors
}

/// Logs in an admin user with the given email and password, checking if their userType is admin
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

/// Fetches users by their userType
const getUsersByType = async (userType: string): Promise<UserDataInterface[]> => {
    try {
      // Reference to the 'users' collection
      const usersCollectionRef = collection(db, 'users');
  
      // Query the collection where userType matches the specified value
      const q = query(usersCollectionRef, where('userType', '==', userType));
  
      // Execute the query
      const querySnapshot = await getDocs(q);
  
      // Parse the results
      const users: UserDataInterface[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          uid: doc.id, // Include the UID from the document ID
        } as UserDataInterface; // Cast to UserDataInterface
      });
  
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users by type');
    }
  };

  export const getUserData = async (uid: string) => {
    try {
      const userDocRef =  doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc !== null && userDoc.exists()) {
        return userDoc.data().data; // Assuming 'data' is the key that holds the array of user data objects
      } else {
        throw new Error('User data does not exist');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

export { auth, logout, registerPatient, registerDoctor, loginAdmin, loginDoctor, getUsersByType, registerAdmin, toggleUserActivity };