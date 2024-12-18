import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import {  faContactCard, faQuestion, faHome, faThumbsUp, faThumbsDown, faComment, faChevronDown, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import QuestionPage from './Fragen';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import gsap from 'gsap';
import "./Badwords.json";

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
    gsap.to(".texttitle", {
      duration: 0.3,
      opacity: 1,
    })
    gsap.to(".imagebg", {
      opacity: 1,
      duration: 0.8
    })
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
    setTimeout(() => {
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
  
      updateDoc(doc(db, 'comments', id), { likes: newLikes, dislikes: newDislikes });
      setUserInteractions(prev => ({ ...prev, [id]: userAction === 'like' ? null : 'like' }));
      fetchComments();
    }, 1000);
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
          <div className="zitat">
          <img src="./Zitat.svg" alt="" className='zitaaat' />

            "Alleine Sind wir ein Tropfen, <br />
            Zusammen sind wir ein Ozean"
            <img src="./Zitat.svg" alt="" className='zitaat' />
          </div>
          <div className="line"></div>
        </main>
        <div className="fragen">
          <div className="frage">
              <div className="titlefra">
                Wofür ist diese Website?
              </div>
              <div className="antwort">
              Unsere Website möchte sich für mehr Zivilcourage und Zusammenhalt einsetzen. Auf dieser Website finden sie Ideen als auch Tipps und Tricks wie sie sich für ihre Mitmenschen einsetzen ,und denen die Hilfe brauchen helfen können. Bei Fragen oder weiteren Ideen benutzen sie gerne unsere Website um sich mit anderen Leuten auszutauschen und vieleicht sogar jemanden aus ihrem bekannten Kreis dazu zu inspirieren auch mit Zivilcourage zu beginnen.
              </div>
          </div>
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
        <div className="bottom">
          Website von Marco
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

  const commentadd = async () => {
      //comment
  }

  return (
    <div className="commentpage">
        
          <a href="./"><button className="bt2" type="button">
      <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px" className='arrowback2'>
          <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#ffffff" />
          <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#ffffff" />
        </svg>
      </div>
    </button>
    </a>
      {commentId && commentText ? (
        <div>
          <p className='fragetxt'><strong></strong> {decodeURIComponent(commentText)}</p>
          <button className='bt3'><FontAwesomeIcon icon={faPlus as IconProp} className='arrow3' />Kommentar hinzüfügen</button>
          <div className="cmt2">
          <div className="cmt3">
              Die erde ist gruen weil ajsdflkasjflj falksj fask slfakjs lkjf
            </div>
          </div>
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
        <img className="logo123" src="./logoprojjekt-removebg-preview.png" alt="" />
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
      <a className='Home' href="">
      <FontAwesomeIcon icon={faHome as IconProp} />
      </a>
    </div>
    <div className="linksunten">
      <a className='Home' href="/fragen">
      <FontAwesomeIcon icon={faQuestion as IconProp} />
      </a>
    </div>
    <div className="linksunten">
      <a className='Home' href="">
      <FontAwesomeIcon icon={faContactCard as IconProp} />
      </a>
    </div>
  </footer>
);
