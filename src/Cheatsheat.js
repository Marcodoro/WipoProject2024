<title>Get a Reference to a Collection:</title>
const commentsRef = collection(db, 'comments');

<title>Get a Reference to a Document:</title>
const docRef = doc(db, 'comments', 'commentId');

<title>Add a Document:</title>

await addDoc(collection(db, 'comments'), {
  text: 'Great post!',
  timestamp: new Date(),
  likes: 0,
  dislikes: 0,
});


<title>Get a Document:</title>

const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log(docSnap.data());
} else {
  console.log('No such document!');
}

<title>Update a Document:</title>

import { updateDoc, doc } from 'firebase/firestore';
await updateDoc(docRef, {
  likes: 10,
});

<title>Delete a Document:</title>

import { deleteDoc, doc } from 'firebase/firestore';
await deleteDoc(docRef);

<title>Get All Documents in a Collection:</title>

const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});

<title>React with Firebase:</title>

Use Firebase with useEffect (For Fetching Data):
useEffect(() => {
  const fetchData = async () => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map(doc => doc.data());
    setComments(commentsData);
  };
  fetchData();
}, []);

<title>Manage State with useState:</title>

const [input, setInput] = useState('');
const [comments, setComments] = useState([]);

<title>Handle Form Submission (Add Comment):</title>

const addComment = async () => {
  if (input.trim()) {
    await addDoc(collection(db, 'comments'), {
      text: input,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
    });
    setInput('');
  }
};

<title>Update Document (Likes/Dislikes):</title>

const handleLike = async (id, currentLikes) => {
  await updateDoc(doc(db, 'comments', id), { likes: currentLikes + 1 });
  fetchComments();
};

const handleDislike = async (id, currentDislikes) => {
  await updateDoc(doc(db, 'comments', id), { dislikes: currentDislikes + 1 });
  fetchComments();
};

<title>Firestore Functions Overview:</title>

getDocs() - Retrieves all documents from a collection (or a query).
getDoc() - Retrieves a single document by reference.
addDoc() - Adds a new document to a collection.
updateDoc() - Updates an existing document's fields.
deleteDoc() - Deletes a document from Firestore.

<title>Common Operations:</title>

Add New Document:
await addDoc(collection(db, 'comments'), { ... });

Read Document Data:
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  const data = docSnap.data();
  console.log(data);
}

<title>Update Document:</title>

await updateDoc(docRef, { likes: 10 });


<title>Delete Document:</title>

await deleteDoc(docRef);


<title>Get All Documents in a Collection (Ordered by Timestamp):</title>

const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
const querySnapshot = await getDocs(q);
querySnapshot.forEach(doc => console.log(doc.id, doc.data()));

<title>State Management in React:</title>

<title>Initialize State with useState:</title>

const [input, setInput] = useState('');
const [comments, setComments] = useState([]);

<title>Update State:</title>

setComments(newComments);
setInput(newInputValue);

<title>Firebase Query Functions:</title>

query() - Filters, sorts, and combines Firestore queries.
const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));

orderBy() - Orders results by a specific field (like timestamp).
const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));

where() - Filters results based on conditions.
const q = query(collection(db, 'comments'), where('likes', '>', 5));

<title>Async Handling:</title>
Always use await when calling Firestore functions that return a promise (e.g., getDoc(), addDoc()).
Use async function to handle these asynchronous operations:
const fetchComments = async () => {
  const querySnapshot = await getDocs(q);
  // Do something with querySnapshot
};

<title>Error Handling:</title>
Always catch errors when dealing with async operations:
try {
  await addDoc(collection(db, 'comments'), { ... });
} catch (error) {
  console.error('Error adding document: ', error);
}

<title>Tips:</title>
Always Check for Document Existence:
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  // Document exists, proceed with the data
} else {
  console.log('Document not found!');
}

<title>Using updateDoc() to Increment/Decrement:</title>
await updateDoc(docRef, { likes: increment(1) });
