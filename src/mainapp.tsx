import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CommentPage from './Commentpage';

const MainApp: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/comment" element={<CommentPage />} />
    </Routes>
  </BrowserRouter>
);

export default MainApp;
