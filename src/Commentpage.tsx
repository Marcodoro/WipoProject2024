import React from 'react';
import { useLocation } from 'react-router-dom';

const CommentPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const commentId = params.get('id');
  const commentText = params.get('text');

  return (
    <div className="comment-page">
      <h2>Comment Details</h2>
      {commentId ? (
        <div>
          <p><strong>Comment ID:</strong> {commentId}</p>
          <p><strong>Comment Text:</strong> {decodeURIComponent(commentText || '')}</p>
        </div>
      ) : (
        <p>No comment data available.</p>
      )}
    </div>
  );
};

export default CommentPage;
