import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./PostDetail.css";

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 드롭다운 메뉴 상태

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
            setPost(response.data);
            setEditedTitle(response.data.title);
            setEditedContent(response.data.content);
        } catch (error) {
            console.error("포스트 불러오기 오류:", error);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setIsMenuOpen(false); // 수정 버튼 클릭하면 메뉴 닫기
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/api/posts/${postId}`, {
                title: editedTitle,
                content: editedContent,
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
            await axios.delete(`http://localhost:8080/api/posts/${postId}`);
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
                    onClick={() => navigate(`/search/${word.substring(1)}`)}
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
                    <div className="post-header">
                        <h3>{post.title}</h3>
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
                    <p>{highlightHashtags(post.content)}</p>
                    <p className="post-date">{format(new Date(post.createdAt), "yyyy-MM-dd h:mm aaa")}</p>
                </>
            )}
        </div>
    );
};

export default PostDetail;
