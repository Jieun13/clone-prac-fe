import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFeed } from "../service/postService";
import axios from "axios";
import { format } from "date-fns";
import LikeButton from "../component/LikeButton";
import RepostButton from "../component/RepostButton";
import PostAuthor from "../component/PostAuthor";
import commentService from "../service/commentService";
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

            const repostResponse = await axios.get("http://localhost:8080/api/users/reposts", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const reposts = repostResponse.data.map(repost => ({
                ...repost.post,
                isRepost: true
            }));

            setPosts([...feedData, ...reposts]);
            const mergedPosts = [...feedData, ...reposts];

            const postsWithComments = await Promise.all(
                mergedPosts.map(async (post) => {
                    try {
                        const comments = await commentService.getCommentsByPost(post.id, token);
                        return { ...post, commentCount: comments.length };
                    } catch (error) {
                        console.error(`댓글 조회 오류 (postId: ${post.id}):`, error);
                        return { ...post, commentCount: 0 };
                    }
                })
            );

            setPosts(postsWithComments);

        } catch (error) {
            console.error("인증 오류:", error);
            localStorage.removeItem("access_token");
            navigate("/login");
        }
    };

    const highlightHashtags = (text) => {
        return text.split(/(\s+)/).map((word, index) =>
            word.startsWith("#") ? (
                <span
                    key={index}
                    className="hashtag"
                    onClick={(e) => {
                        e.stopPropagation(); // 이벤트 버블링 중단
                        navigate(`/search/${word.substring(1)}`);
                    }}
                >
                {word}
            </span>
            ) : (
                word
            )
        );
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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
                    const formattedDate = format(new Date(post.createdAt), "yyyy-MM-dd h:mm aaa");

                    return (
                        <li>
                            <div className="post-item">
                                {post.isRepost && <p className="repost-label">🔁 {user.nickname}님이 리포스트함</p>}
                            <div className="post-header">
                                <PostAuthor author={post.author}/>
                                <p className="post-date">{formattedDate}</p>
                            </div>
                            <div key={post.id}
                                 className="post-details"
                                 onClick={() => navigate(`/posts/${post.id}`)}>
                                <h4>{post.title}</h4>
                                <p>{highlightHashtags(post.content)}</p>
                            </div>
                                <div className="post-actions">
                                    <span className="comment-container">
                                        <img
                                            src={"/comment_icon.png"}
                                            alt="comment"
                                            className="comment_icon"
                                            style={{cursor: "pointer"}}
                                        />{post.commentCount}</span>
                                    <RepostButton postId={post.id}/>
                                    <LikeButton postId={post.id}/>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PostFeed;
