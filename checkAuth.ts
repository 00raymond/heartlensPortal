import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const useCheckAuth = () => {
  const router = useRouter();

  useEffect(() => {
  }, []);
};

export default useCheckAuth;
