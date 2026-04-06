import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import Header from './components/Header';
import UserPage from './pages/UserPage';
import { AnimatePresence, motion } from 'framer-motion';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageWrapper><Header /><Home /></PageWrapper>} />
        <Route path='/about' element={<PageWrapper><Header /><About /></PageWrapper>} />
        <Route path='/sign-in' element={<PageWrapper><SignIn /></PageWrapper>} />
        <Route path='/sign-up' element={<PageWrapper><SignUp /></PageWrapper>} />
        <Route path='/search' element={<PageWrapper><Header /><Search /></PageWrapper>} />
        <Route path='/user/:userId' element={<PageWrapper><Header /><UserPage /></PageWrapper>} />
        
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path='/create-post' element={<PageWrapper><Header /><CreatePost /></PageWrapper>} />
        </Route>
        
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/update-post/:postId' element={<PageWrapper><Header /><UpdatePost /></PageWrapper>} />
        </Route>
        
        <Route path='/post/:postSlug' element={<PageWrapper><Header /><PostPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
