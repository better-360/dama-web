import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyDWLur8hX6KGDdi88KNhYDvLbAQ51GAkSY",
  authDomain: "damadba-d44a6.firebaseapp.com",
  projectId: "damadba-d44a6",
  storageBucket: "damadba-d44a6.firebasestorage.app",
  messagingSenderId: "94145577768",
  appId: "1:94145577768:web:af87ee8f0049676bf1461d"
};

const app = initializeApp(firebaseConfig);
console.log(app);
export const fireStorage = getStorage(app);
console.log(fireStorage);