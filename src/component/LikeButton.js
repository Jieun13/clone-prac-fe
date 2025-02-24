import { useState, useEffect } from "react";
import axios from "axios";
import "./LikeButton.css";

const LikeButton = ({ postId }) => {
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const fetchLikeData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    console.error("❌ 로그인된 사용자 없음");
                    return;
                }

                const likeResponse = await axios.get(`http://localhost:8080/api/posts/${postId}/like`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (likeResponse.status === 200) {
                    setLiked(true);
                    setLikeId(likeResponse.data.id);
                } else if (likeResponse.status === 204) {
                    setLiked(false);
                    setLikeId(null);
                }
            } catch (error) {
                if (error.response && error.response.status === 204) {
                    setLiked(false);
                    setLikeId(null);
                } else {
                    console.error("❌ 좋아요 여부 확인 실패:", error);
                }
            }

            try {
                const countResponse = await axios.get(`http://localhost:8080/api/posts/${postId}/likes`);
                setLikeCount(countResponse.data.length);
            } catch (error) {
                console.error("❌ 좋아요 개수 조회 실패:", error);
            }
        };

        fetchLikeData();
    }, [postId]);

    const handleLikeToggle = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("❌ 로그인된 사용자 없음");
                return;
            }

            if (liked) {
                if (!likeId) {
                    console.error("❌ 좋아요 ID 없음");
                    return;
                }

                await axios.delete(`http://localhost:8080/api/likes/${likeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLiked(false);
                setLikeId(null);
                setLikeCount(prev => prev - 1);
            } else {
                const response = await axios.post(`http://localhost:8080/api/posts/${postId}/likes`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.id) {
                    setLiked(true);
                    setLikeId(response.data.id);
                    setLikeCount(prev => prev + 1);
                } else {
                    console.error("❌ 서버에서 좋아요 ID를 받지 못함");
                }
            }
        } catch (error) {
            console.error("❌ 좋아요 상태 변경 실패:", error);
        }
    };

    return (
        <div className="like-container">
            <img
                src={liked ? "/liked_icon.png" : "/like_icon.png"}
                alt={liked ? "Liked" : "Like"}
                className="action-icon"
                onClick={handleLikeToggle}
                style={{ cursor: "pointer" }}
            />
            <span>{likeCount}</span>
        </div>
    );
};

export default LikeButton;
