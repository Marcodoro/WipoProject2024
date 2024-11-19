import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

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
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = async () => {
    if (input.trim()) {
      const newComment = {
        text: input,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0
      };
      await addDoc(collection(db, "comments"), newComment);
      fetchComments();
      setInput('');
    }
  };

  const handleLike = async (id: string, currentLikes: number, currentDislikes: number) => {
    const userAction = userInteractions[id];
    let newLikes = currentLikes;
    let newDislikes = currentDislikes;

    try {
      if (userAction === 'dislike') {
        newDislikes -= 1;
        newLikes += 1;
        setTimeout(() => {
          //Nothing
        }, 2000);
      } else if (userAction === 'like') {
        newLikes -= 1;
        setTimeout(() => {
          //Nothing
        }, 2000);
      } else {
        newLikes += 1;
        setTimeout(() => {
          //Nothing
        }, 2000);
      }

      await updateDoc(doc(db, "comments", id), { likes: newLikes, dislikes: newDislikes });
      setUserInteractions(prev => ({ ...prev, [id]: userAction === 'like' ? null : 'like' }));
      fetchComments();
    } catch (e) {
      console.error("Error updating likes: ", e);
    }
  };

  const handleDislike = async (id: string, currentLikes: number, currentDislikes: number) => {
    const userAction = userInteractions[id];
    let newLikes = currentLikes;
    let newDislikes = currentDislikes;



    try {
      if (userAction === 'like') {
        newLikes -= 1;
        newDislikes += 1;
        setTimeout(() => {
          //Nothing
        }, 2000);
      } else if (userAction === 'dislike') {
        newDislikes -= 1;
        setTimeout(() => {
          //Nothing
        }, 2000);
      } else {
        newDislikes += 1;
        setTimeout(() => {
          //Nothing
        }, 2000);
      }

      await updateDoc(doc(db, "comments", id), { likes: newLikes, dislikes: newDislikes });
      setUserInteractions(prev => ({ ...prev, [id]: userAction === 'dislike' ? null : 'dislike' }));
      fetchComments();
    } catch (e) {
      console.error("Error updating dislikes: ", e);
    }
  };

  const handleCommentClick = (id: string, text: string) => {
    navigate(`/comment?id=${id}&text=${encodeURIComponent(text)}`);
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="commentpart">
        <div className="App">
          <header></header>
          <div className="title">
          <h1>Commentare oder so</h1>
          </div>
          <div className="stuff">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Schreibe etwas.."
            />
            <button onClick={addComment}>Senden</button>
          </div>
          <div className="comments">
            <div className="commentss">
            {comments.map((comment) => (
              <div key={comment.id} className="comment" onClick={() => handleCommentClick(comment.id, comment.text)}>
                <p>{comment.text}</p>
                <div className='buttons'>
                  <button onClick={(e) => { e.stopPropagation(); handleLike(comment.id, comment.likes, comment.dislikes); }}>
                    Like ({comment.likes})
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDislike(comment.id, comment.likes, comment.dislikes); }}>
                    Dislike ({comment.dislikes})
                  </button>
                </div>
              
              </div>
              
            ))}
            </div>
            <div className="right"></div>
          </div>
        </div>
        </div>
      } />
      <Route path="/comment" element={<CommentPage />} />
    </Routes>
  );
}

const CommentPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const commentId = queryParams.get('id');
  const commentText = queryParams.get('text');

  return (
    <div className="comment-page">
      <h2>Commentar</h2>
      {commentId && commentText ? (
        <div>
          <p><strong>Commentar ID:</strong> {commentId}</p>
          <p><strong>Commentar Text:</strong> {decodeURIComponent(commentText)}</p>
          <br />
          <br />
          <a href="./">Zurueck</a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
