import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./PostDetail.css";
import commentService from "../service/commentService";
import PostAuthor from "../component/PostAuthor";
import RepostButton from "../component/RepostButton";
import LikeButton from "../component/LikeButton"; // 댓글 서비스 임포트

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = localStorage.getItem("access_token"); // 로컬 스토리지에서 토큰 가져오기
    const [editingComment, setEditingComment] = useState(null);
    const [editedComment, setEditedComment] = useState("");


    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPost(response.data);
            setEditedTitle(response.data.title);
            setEditedContent(response.data.content);
        } catch (error) {
            console.error("포스트 불러오기 오류:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await commentService.getCommentsByPost(postId, token);
            setComments(data);
            console.log(data);
        } catch (error) {
            console.error("댓글 불러오기 오류:", error);
        }
    };

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;
        try {
            await commentService.createComment(postId, { content: newComment }, token);
            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("댓글 작성 오류:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            await commentService.deleteComment(commentId, token);
            fetchComments();
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setIsMenuOpen(false);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/api/posts/${postId}`, {
                title: editedTitle,
                content: editedContent,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditing(false);
            fetchPost();
        } catch (error) {
            console.error("포스트 수정 오류:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/posts");
        } catch (error) {
            console.error("포스트 삭제 오류:", error);
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

    if (!post) return <p>로딩 중...</p>;

    return (
        <div className="post-detail-container">
            {editing ? (
                <div className="post-input">
                    <input
                        type="text"
                        value={editedTitle}
                        className="post-input"
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <textarea
                        className="post-input textarea"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="post-buttons">
                        <button className="cancel-button" onClick={() => setEditing(false)}>취소</button>
                        <button className="save-button" onClick={handleSave}>저장</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="post-item">
                        <div className="post-header">
                            <PostAuthor author={post.author}/>
                            <p className="post-date">
                                {format(new Date(post.updatedAt ?? post.createdAt), "yyyy-MM-dd hh:mm")}{" "}
                                {post.updatedAt ? "수정됨" : "작성됨"}
                            </p>
                        </div>
                        <div key={post.id}
                             className="post-details"
                             onClick={() => navigate(`/posts/${post.id}`)}>
                            <h4>{post.title}</h4>
                            <p>{highlightHashtags(post.content)}</p>
                        </div>
                        <div className="post-actions">
                            <RepostButton postId={post.id}/>
                            <LikeButton postId={post.id}/>
                            <div className="menu-container">
                                <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</button>
                                {isMenuOpen && (
                                    <div className="menu-dropdown">
                                        <button onClick={handleEdit}>수정</button>
                                        <button onClick={handleDelete}>삭제</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="comments-section">
                <h5>댓글 {comments.length}</h5>
                <ul className="comments-list">
                    {comments.map(comment => (
                        <li key={comment.id} className="post-item">
                            {editingComment === comment.id ? (
                                <div className="post-input">
                        <textarea
                            className="post-input textarea"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        />
                                    <div className="post-buttons">
                                        <button className="cancel-button" onClick={() => setEditingComment(null)}>취소
                                        </button>
                                        <button className="save-button"
                                                onClick={() => commentService.createComment(comment.id)}>저장
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="post-header">
                                        <PostAuthor author={comment.author}/>
                                        <p className="post-date">{format(new Date(comment.createdAt), "yyyy-MM-dd hh:mm")} 작성됨</p>
                                    </div>
                                    <div className="post-details">
                                        <p>{highlightHashtags(comment.content)}</p>
                                    </div>
                                    <div className="post-actions">
                                        <button className="delete-comment-button"
                                                onClick={() => handleDeleteComment(comment.id)}>삭제
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            <div className="comment-input">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder=" 댓글을 입력하세요"
                    />
                    <button onClick={handleCreateComment} className="save-button">작성</button>
                </div>
            </div>
    </div>
)
    ;
};

export default PostDetail;
