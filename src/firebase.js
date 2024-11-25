import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };

/**
 *  npm i --save @fortawesome/fontawesome-svg-core
 *  npm i --save @fortawesome/free-solid-svg-icons
    npm i --save @fortawesome/free-regular-svg-icons
    npm i --save @fortawesome/free-brands-svg-icons
    npm install gsap
    npm install firebase
 */
