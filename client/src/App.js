// 1. Import `Routes` in addition to `Route`
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import io from 'socket.io-client'

import PageRender from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Alert from "./components/alert/Alert";
import Header from "./components/header/Header";
import Footer from "./components/header/Footer";
import StatusModal from "./components/StatusModal";
import { refreshToken } from "./redux/actions/authAction";
import { getPosts } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionsAction";
import { getNotifies } from "./redux/actions/notifyAction";
import { getConversations } from "./redux/actions/messageAction";

import AdminDashboard from "./pages/adminDashboard";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import SocketClient from "./SocketClient";

function App() {
  const { auth, status, modal, userType } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    const socket = io('http://localhost:8080');
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  }, [dispatch]);


  useEffect(() => {
    if (auth.token && auth.user) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
      dispatch(getConversations({ auth }));
    }
  }, [dispatch, auth.token, auth.user]);

  useEffect(() => {
    if (!("Notification" in window)) {
      // Consider replacing this alert with a non-blocking UI element.
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {

    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
        }
      });
    }
  }, [])

  
  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && "mode"}`}>
        {userType === "user" && auth.token && <Header />}
        {status && <StatusModal />}
        {auth.token && <SocketClient />}

        <main className="main">
          <Routes>
            {/* 3. Use the 'element' prop with JSX instead of the 'component' prop */}
            <Route
              path="/"
              element={
                auth.token ? (
                    userType === "user" ? <Home /> : <AdminDashboard />
                ) : (
                  <Login />
                )
              }
            />

            {/* Public route for registration */}
            <Route path="/register" element={<Register />} />

            {/* 4. Use the new Private Router wrapper pattern */}
            <Route element={<PrivateRouter />}>
                <Route path="/:page" element={<PageRender />} />
                <Route path="/:page/:id" element={<PageRender />} />
            </Route>
          </Routes>
        </main>

        {userType === "user" && auth.token && <Footer />}
      </div>
    </Router>
  );
}

export default App;
