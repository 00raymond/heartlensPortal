import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

interface WithAuthProps {}

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const uid = user.uid;
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().userType === 'admin') {
              console.log(`${userDoc.data().name} is an admin`);
              setLoading(false);
            } else {
              console.log('Not an admin, redirecting to home.');
              router.push('/');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            router.push('/');
          }
        } else {
          console.log('Not authenticated, redirecting to home.');
          router.push('/');
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      // Optionally, render a loading spinner or placeholder while checking auth state
      return <div>Loading...</div>;
    }

    // Render the wrapped component once auth check is complete
    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}

export default withAuth;
