import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AccessTokenProvider } from './contexts/AccessProvider';
import { UserDataProvider } from './contexts/UserProvider';

// Import components
import { Navbar } from './components/Navbar';
import { AlertMessages } from './components/AlertMessages';
import { TokenRefresher } from './components/TokenRefresher';

// Import pages
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import MyProfile from './pages/MyProfile';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NoPage';
import Faq from './pages/Faq';

function App() {

  return (
    <>
      <Router>
        <AccessTokenProvider>
          <UserDataProvider>
            <TokenRefresher />
            <AlertMessages />
            <Routes>
              {/* Navbar pages */}
              <Route element={<Navbar />}>
                <Route index element={<Home />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="students" element={<Students />} />
                <Route path="my-profile" element={<MyProfile />} />
                <Route path="create-quiz" element={<CreateQuiz />} />
                <Route path='faq' element={<Faq />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
              </Route>

              {/* Out of navbar pages */}
              <Route path="*" element={<NoPage />} />
            </Routes>
          </UserDataProvider>
        </AccessTokenProvider>
      </Router>
    </>
  );
}

export default App;
