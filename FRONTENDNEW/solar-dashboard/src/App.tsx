import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import DashboardPage from './components/DashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
  switch (currentPage) {
    case 'home':
      return <HomePage onPageChange={setCurrentPage} />; // ✅ pass it
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'dashboard':
      return <DashboardPage onPageChange={setCurrentPage} />; // optional if you want back navigation
    default:
      return <HomePage onPageChange={setCurrentPage} />;
  }
};

  return (
    <div className="App">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;