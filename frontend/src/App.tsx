import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';
import Tasks from './pages/Tasks';
import Learning from './pages/Learning';
import { jwtDecode } from 'jwt-decode';
import Lessons from './pages/Lessons';
import Lesson from './pages/Lesson';
import UserPage from './pages/UserPage';

const App: React.FC = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      console.log('Token expired. Redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/tasks' element={<Tasks />} />
        <Route path='/learning' element={<Learning />} />
        <Route path='/lessons' element={<Lessons />} />
        <Route path='/lesson/:lessonId' element={<Lesson />} />
        <Route path='/user' element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
