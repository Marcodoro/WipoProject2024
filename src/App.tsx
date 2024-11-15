import React, { useState, useEffect } from 'react';
import './App.css';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from './firebase';

interface Comment {
  id: string;
  text: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  likes: number;
  dislikes: number;
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [userInteractions, setUserInteractions] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});

  const fetchComments = async () => {
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const commentsData: Comment[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text,
      timestamp: doc.data().timestamp,
      likes: doc.data().likes || 0,
      dislikes: doc.data().dislikes || 0
    }));
    setComments(commentsData);
  };

  const addComment = async () => {
    if (input.trim() === '') return;

    try {
      await addDoc(collection(db, "comments"), {
        text: input,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0
      });
      setInput('');
      fetchComments();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleLike = async (id: string, currentLikes: number, currentDislikes: number) => {
    const userAction = userInteractions[id];

    try {
      if (userAction === 'like') {
        // Remove like
        await updateDoc(doc(db, "comments", id), { likes: currentLikes - 1 });
        setUserInteractions(prev => ({ ...prev, [id]: null }));
      } else if (userAction === 'dislike') {
        // Switch from dislike to like
        await updateDoc(doc(db, "comments", id), {
          likes: currentLikes + 1,
          dislikes: currentDislikes - 1
        });
        setUserInteractions(prev => ({ ...prev, [id]: 'like' }));
      } else {
        // Add like
        await updateDoc(doc(db, "comments", id), { likes: currentLikes + 1 });
        setUserInteractions(prev => ({ ...prev, [id]: 'like' }));
      }
      fetchComments();
    } catch (e) {
      console.error("Error updating likes: ", e);
    }
  };

  const handleDislike = async (id: string, currentLikes: number, currentDislikes: number) => {
    const userAction = userInteractions[id];

    try {
      if (userAction === 'dislike') {
        // Remove dislike
        await updateDoc(doc(db, "comments", id), { dislikes: currentDislikes - 1 });
        setUserInteractions(prev => ({ ...prev, [id]: null }));
      } else if (userAction === 'like') {
        // Switch from like to dislike
        await updateDoc(doc(db, "comments", id), {
          likes: currentLikes - 1,
          dislikes: currentDislikes + 1
        });
        setUserInteractions(prev => ({ ...prev, [id]: 'dislike' }));
      } else {
        // Add dislike
        await updateDoc(doc(db, "comments", id), { dislikes: currentDislikes + 1 });
        setUserInteractions(prev => ({ ...prev, [id]: 'dislike' }));
      }
      fetchComments();
    } catch (e) {
      console.error("Error updating dislikes: ", e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="App">
      <header></header>
      <h1>Commentare oder so</h1>
      <div className="stuff">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Schreibe etwas.."
        />
        <button onClick={addComment}>Senden</button>
      </div>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.text}</p>
            <div className='buttons'>
              <button onClick={() => handleLike(comment.id, comment.likes, comment.dislikes)}>
                Like ({comment.likes})
              </button>
              <button onClick={() => handleDislike(comment.id, comment.likes, comment.dislikes)}>
                Dislike ({comment.dislikes})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
