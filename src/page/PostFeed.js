import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFeed } from "../service/postService";
import axios from "axios";
import { format } from "date-fns";
import LikeButton from "../component/LikeButton";
import RepostButton from "../component/RepostButton";
import PostAuthor from "../component/PostAuthor"; // ✅ 추가
import "./PostFeed.css";

const PostFeed = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchPosts = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const userResponse = await axios.get("http://localhost:8080/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(userResponse.data);

            const feedData = await getUserFeed(token);
            setPosts(feedData);
        } catch (error) {
            console.error("인증 오류:", error);
            localStorage.removeItem("access_token");
            navigate("/login");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [navigate]);

    const handlePostSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const token = localStorage.getItem("access_token");
        try {
            await axios.post("http://localhost:8080/api/posts", { title, content }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTitle("");
            setContent("");

            await fetchPosts();
        } catch (error) {
            console.error("포스트 작성 오류:", error);
        }
    };

    if (!user) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="container">
            <div className="post-input">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="post-title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="무슨 일이 있었나요?"
                    className="post-content"
                />
                <button onClick={handlePostSubmit}>Post</button>
            </div>

            <ul className="post-list">
                {posts.map(post => {
                    // 날짜 변환 (UTC -> 로컬 타임존 반영)
                    const formattedDate = format(new Date(post.createdAt), "yyyy-MM-dd h:mm aaa");

                    return (
                        <li key={post.id} className="post-item">
                            <div className="post-header">
                                <PostAuthor author={post.author} /> {/* ✅ 변경된 부분 */}
                                <p className="post-date">{formattedDate}</p>
                            </div>
                            <h4>{post.title}</h4>
                            <p>{post.content}</p>
                            <div className="post-actions">
                                <img
                                    src={"/like_icon.png"}
                                    alt="Like"
                                    className="action-icon"
                                    onClick={() => LikeButton(post.id)}
                                />
                                <img
                                    src={"/repost_icon.png"}
                                    alt="Comment"
                                    className="action-icon"
                                    onClick={() => RepostButton(post.id)}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PostFeed;
