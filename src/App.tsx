import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { faThumbsUp, faThumbsDown, faComment, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import QuestionPage from './Questionpage';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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

export default function App() {
  return (
    <>
      <Headeroben />
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/comment" element={<CommentPage />} />
        <Route path="/fragen" element={<QuestionPage />} />
      </Routes>
      <Footerseite />
    </>
  );
}

const Startseite: React.FC = () => {
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [userInteractions, setUserInteractions] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
  const navigate = useNavigate();

  const fetchComments = async () => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map(doc => ({
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
      await addDoc(collection(db, 'comments'), {
        text: input,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0
      });
      fetchComments();
      setInput('');
    }
  };

  const handleLike = async (id: string, currentLikes: number, currentDislikes: number) => {
    const userAction = userInteractions[id];
    let newLikes = currentLikes;
    let newDislikes = currentDislikes;

    if (userAction === 'dislike') {
      newDislikes -= 1;
      newLikes += 1;
    } else if (userAction === 'like') {
      newLikes -= 1;
    } else {
      newLikes += 1;
    }

    await updateDoc(doc(db, 'comments', id), { likes: newLikes, dislikes: newDislikes });
    setUserInteractions(prev => ({ ...prev, [id]: userAction === 'like' ? null : 'like' }));
    fetchComments();
  };

  const handleDislike = async (id: string, currentLikes: number, currentDislikes: number) => {
    const userAction = userInteractions[id];
    let newLikes = currentLikes;
    let newDislikes = currentDislikes;

    if (userAction === 'like') {
      newLikes -= 1;
      newDislikes += 1;
    } else if (userAction === 'dislike') {
      newDislikes -= 1;
    } else {
      newDislikes += 1;
    }

    await updateDoc(doc(db, 'comments', id), { likes: newLikes, dislikes: newDislikes });
    setUserInteractions(prev => ({ ...prev, [id]: userAction === 'dislike' ? null : 'dislike' }));
    fetchComments();
  };

  const handleCommentClick = (id: string, text: string) => {
    navigate(`/comment?id=${id}&text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="commentpart">
      <div className="App">
        <main>
          <img src="https://media.licdn.com/dms/image/v2/C5612AQG4f0cFMxqegg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1564736158747?e=2147483647&v=beta&t=l7BtZ2GRnllm0JqX42XUdgk1A7eCtZ2BS0er664Dw78" className='imagebg' alt="" />
          <div className="titlemain">
            <div className="texttitle">
              Zusammen Mutig sein
            </div>
            <div className="untertitle">
              Civil courage text untertitle keine ahnung
            </div>
          </div>
          <div className="line"></div>
        </main>
        <div className="title">
          <h1>Commentare oder so</h1>
        </div>
        <div className="comments">
          <div className="commentss">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p onClick={() => handleCommentClick(comment.id, comment.text)}>{comment.text}</p>
                <div className='buttons'>
                  <button className='like' onClick={(e) => { e.stopPropagation(); handleLike(comment.id, comment.likes, comment.dislikes); }}>
                  <FontAwesomeIcon className='likeicon' icon={faThumbsUp as IconProp} /> {comment.likes}
                  </button>
                  <button className='dislike' onClick={(e) => { e.stopPropagation(); handleDislike(comment.id, comment.likes, comment.dislikes); }}>
                    <FontAwesomeIcon icon={faThumbsDown as IconProp} />
                  </button>
                  <button>
                    <FontAwesomeIcon icon={faComment as IconProp} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="right"></div>
        </div>
      </div>
    </div>
  );
};

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
          <a href="./">Zurueck</a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const Headeroben: React.FC = () => (
  <header>
    <div className="link5">
      <a href="/fragen" className="icon2">
        <img className="" src="" alt="" />
      </a>
    </div>
    <div className="link2">
      <a href="/" className="title2">Zusammen Stark</a>
    </div>
    <div className="linkse">
      <div className="link3">
        <a href="/wir">Ueber uns  <FontAwesomeIcon className='likeicon' icon={faChevronDown as IconProp} /></a>
      </div>
      <div className="link3">
        <a href="/fragen">Frage Stellen <FontAwesomeIcon className='likeicon'icon={faChevronDown as IconProp} /></a>
      </div>
      <div className="link4">
        <a href="/fragen"><FontAwesomeIcon className='likeicon' icon={faSearch as IconProp} /> </a>
      </div>
    </div>
  </header>
);

const Footerseite: React.FC = () => (
  <footer>
    <div className="linksunten">
      <a className='Home' href="">Home</a>
    </div>
    <div className="linksunten">
      <a className='Home' href="">Fragen</a>
    </div>
    <div className="linksunten">
      <a className='Home' href="">Home</a>
    </div>
  </footer>
);
