
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserDataInterface } from '@/types/userData';
import { get } from 'http';

const auth = getAuth();

const logout = async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

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
        additionalInfo: additionalInfo,
      };
  
      await setDoc(doc(db, 'users', uid), userData);
  
      console.log('User registered and data added to Firestore');
      await auth.signOut();
    } catch (error) {
      console.error('Error registering user:', error);
    }
}

const disableAccount = async (uid: string) => {
  try {
      // Reference to the user document
      const userDocRef = doc(db, 'users', uid);

      // Fetch the user document
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
          console.error('No such document!');
          return;
      }

      // Update the user document
      await setDoc(userDocRef, { disabled: true }, { merge: true });

      console.log('User account disabled successfully');
  } catch (error) {
      console.error('Error disabling account:', error);
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

// Example usage
export { auth, logout, registerPatient, registerDoctor, loginAdmin, loginDoctor, getUsersByType, registerAdmin };