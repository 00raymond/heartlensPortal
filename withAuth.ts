import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Define an interface for additional props, if needed
interface WithAuthProps {}

// Define the HOC
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data().userType === 'admin') {
            // User is authenticated and is an admin
            console.log(userDoc.data().name + ' is an admin');
            return;
          } else {
            // Not an admin, redirect to home
            router.push('/');
          }
        } else {
          // Not authenticated, redirect to home
          router.push('/');
        }
      });

      return () => unsubscribe();
    }, [router]);

    // Using React.createElement to render WrappedComponent with props
    return React.createElement(WrappedComponent, props);
  };

  return ComponentWithAuth;
}

export default withAuth;
