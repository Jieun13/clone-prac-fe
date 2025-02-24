import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginSuccess from "./page/LoginSuccess";
import Home from "./page/Home";
import Login from "./page/Login";
import NevigateBar from "./component/NevigateBar";
import PostFeed from "./page/PostFeed";
import Profile from "./page/Profile";
import SearchResults from "./page/SearchResults";
import PostDetail from "./page/PostDetail";

function App() {
    return (
        <Router>
            <NevigateBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/loginSuccess" element={<LoginSuccess />} />
                <Route path="/feed" element={<PostFeed />} />
                <Route path="/profile/:userId" element={<Profile />} /> {/* ✅ 추가 */}
                <Route path="/search/:hashtag" element={<SearchResults />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
            </Routes>
        </Router>
    );
}

export default App;