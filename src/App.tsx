import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import {  faContactCard, faQuestion, faHome, faThumbsUp, faThumbsDown, faComment, faChevronDown, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import QuestionPage from './Fragen';
import { Icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { Filter } from 'bad-words';


import { de } from 'date-fns/locale';

import gsap from 'gsap';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

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
        <Route path="/Ueberuns" element={<Ueberuns />} />      
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

  const filter = new Filter();
  filter.addWords('hitler', "nazi", "nigger", "nigga", "arsch")



  const fetchComments = async () => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text,
      timestamp: doc.data().timestamp,
      likes: doc.data().likes || 0,
      dislikes: doc.data().dislikes || 0,
    }));
    setComments(commentsData);
  };

  useEffect(() => {
    fetchComments();

  }, []);

  const addComment = async () => {
    if (input.trim()) {
      if (filter.isProfane(input)) {
        alert('Your comment contains inappropriate language.');
        return;
      }

      await addDoc(collection(db, 'comments'), {
        text: input,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
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
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
    navigate(`/comment?id=${id}&text=${encodeURIComponent(text)}`);
  };

  const [currentQuote, setCurrentQuote] = useState(0);
  const quoteRef = useRef<HTMLParagraphElement | null>(null);

  const quotes = [
    `"Alleine sind wir ein Tropfen,<br> zusammen sind wir ein Ozean."`,
    `"Zivilcourage beginnt bei kleinen Taten,<br> aber endet in großen Veränderungen."`,
    `"Die Stärke der Gemeinschaft<br> ist unser größtes Gut."`,
    `"Mut ist ansteckend – sei ein Vorbild,<br> und inspiriere andere."`,
    `"Ein kleiner Funke<br> kann ein großes Feuer entfachen."`,
    `"Gemeinsam können wir die Welt verändern,<br> Schritt für Schritt, Tag für Tag."`,
    `"Hilfe beginnt mit einem einfachen Wort,<br> und führt zu einem besseren Morgen."`,
    `"Jede große Reise beginnt<br> mit einem einzigen mutigen Schritt."`,
    `"Zusammenhalt macht uns stärker,<br> Mut macht uns unaufhaltsam."`
  ];
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (quoteRef.current) {
        // Fade out
        gsap.to(quoteRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            // Change the quote
            setCurrentQuote((prevQuote) => (prevQuote + 1) % quotes.length);

            // Fade in
            gsap.fromTo(
              quoteRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5 }
            );
          }
        });
      }
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [quotes.length]);


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
            Diese Website ist für den Europäischen Wettbewerb ausserdem haben wir dazu einen Instagram Account erstellt dem wir unsere website vermarkten und Leuten mit Civilcourage ermuten.
          </div>
        </div>
        <div className="zitat">
          <img src="./Zitat.svg" alt="" className="zitaaat" />
          <div
            ref={quoteRef}
            className="quote"
            dangerouslySetInnerHTML={{ __html: quotes[currentQuote] }} // Render HTML
          />
          <img src="./Zitat.svg" alt="" className="zitaat" />
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
        Website von Marco, Luca, Till und Henry

        <br />

        Bei fragen oder problemen kontaktiere luca.parr@ohg-monheim.eu

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  </div>
  );
};



const CommentPage: React.FC = () => {
  interface Comment {
    id: string;
    text: string;
    timestamp: Date | null;
    likes: number;
    dislikes: number;
  }

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const commentId = queryParams.get('id');
  const commentText = queryParams.get('text');

  const [replies, setReplies] = useState<Comment[]>([]);
  const [newReply, setNewReply] = useState('');

  const filter = new Filter();
  filter.addWords('hitler', "nazi", "nigger", "nigga", "arsch")


  const fetchReplies = async () => {
    if (commentId) {
      const q = query(
        collection(db, 'comments', commentId, 'replies'),
        orderBy('likes', 'desc') // Default sorting by likes
      );
      const querySnapshot = await getDocs(q);
      const fetchedReplies = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          timestamp: data.timestamp?.seconds
            ? new Date(data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1e6)
            : null,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
        };
      }) as Comment[];
      setReplies(fetchedReplies);
    }
  };

  useEffect(() => {
    fetchReplies();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top

  }, [commentId]);

  const addReply = async () => {
    if (newReply.trim() && commentId) {
      if (filter.isProfane(newReply)) {
        alert('Schlimme wörter bitte nicht');
        return;
      }

      const reply = {
        text: newReply,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
      };
      await addDoc(collection(db, 'comments', commentId, 'replies'), reply);
      setNewReply('');
      fetchReplies();
    }
  };

  const handleVote = async (id: string, type: 'like' | 'dislike') => {
    const localStorageKey = `vote-${id}`;
    const existingVote = localStorage.getItem(localStorageKey);

    if (existingVote === type) return; // Prevent multiple same votes

    const reply = replies.find(r => r.id === id);
    if (!reply) return;

    const updatedLikes = type === 'like' ? reply.likes + 1 : reply.likes - (existingVote === 'like' ? 1 : 0);
    const updatedDislikes = type === 'dislike' ? reply.dislikes + 1 : reply.dislikes - (existingVote === 'dislike' ? 1 : 0);

    await updateDoc(doc(db, 'comments', commentId!, 'replies', id), {
      likes: updatedLikes,
      dislikes: updatedDislikes,
    });

    localStorage.setItem(localStorageKey, type); // Store vote in localStorage
    fetchReplies(); // Refresh replies
  };

  return (
    <div className="commentpage">
      <a href="./">
        <button className="bt2" type="button">
          <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] z-10 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
              <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#ffffff" />
              <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#ffffff" />
            </svg>
          </div>
        </button>
      </a>
      {commentId && commentText ? (
        <div>
          <p className="fragetxt">
            <strong> </strong> {decodeURIComponent(commentText)}
          </p>
          <div className="reply_section">
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Add a reply..."
              className="reply-input"
            />
            <button className="bt3" onClick={addReply}>
              <FontAwesomeIcon icon={faPlus as IconProp} className="arrow3" /> Add Reply
            </button>
          </div>
          <div className="replies">
            {replies.map(reply => (
              <div key={reply.id} className="cmt2">
                <div className="cmt3">
                  <div className="timestamp">
                    {reply.timestamp
                      ? `vor ${formatDistanceToNow(reply.timestamp, { locale: de })}`
                      : 'Timestamp unavailable'}
                  </div>
                  <div>{reply.text}</div>
                  <div className="vote-buttons">
                    <button
                      className="upvote"
                      onClick={() => handleVote(reply.id, 'like')}
                    >
                      <FontAwesomeIcon icon={faArrowUp  as IconProp} /> {reply.likes}
                    </button>
                    <button
                      className="downvote"
                      onClick={() => handleVote(reply.id, 'dislike')}
                    >
                      <FontAwesomeIcon icon={faArrowDown  as IconProp} /> {reply.dislikes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
      <a className='Home' href="/">
      <FontAwesomeIcon icon={faHome as IconProp} />
      </a>
    </div>
    <div className="linksunten">
      <a className='Home' href="/fragen">
      <FontAwesomeIcon icon={faQuestion as IconProp} />
      </a>
    </div>
    <div className="linksunten">
      <a className='Home' href="/Ueberuns">
      <FontAwesomeIcon icon={faContactCard as IconProp} />
      </a>
    </div>
  </footer>
);

const Ueberuns: React.FC = () => (
  <div className="ueberuns">
    Ueber uns!
    <div className="text2135">
     Wir sind Schuüler vom Otto-Hahn-Gymnasium, in der 9 Klasse. Dies ist ein Project von dem Wipo Diff. Kurs geleitet voon Herr Götzinger. Gemeinsam haben wir diese Website und den Insta Acc errichted, denn GEMEINSAM SIND WIR STARK!!
    </div>
    <div className="insta">
      Folge uns auf Insta <br />
      <a href="https://www.instagram.com/zusammen_mutig_2024?">
      <FontAwesomeIcon icon={faInstagram as IconProp} className="Instaf" /></a>
    </div>
  </div>
)