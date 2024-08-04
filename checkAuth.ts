import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const useCheckAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            switch (userData.userType) {
              case 'admin':
                router.push('/admin/dashboard');
                break;
              case 'doctor':
                router.push('/doctor/dashboard');
                break;
              case 'patient':
                router.push('/patient/dashboard');
                break;
              default:
                console.error('Unknown user type');
                router.push('/');
                break;
            }
          } else {
            console.error('User document does not exist');
            router.push('/');
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
          router.push('/');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);
};

export default useCheckAuth;
