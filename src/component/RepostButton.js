import { useState, useEffect } from "react";
import axios from "axios";
import "./RepostButton.css";

const RepostButton = ({ postId }) => {
    const [reposted, setReposted] = useState(false);
    const [repostId, setRepostId] = useState(null);
    const [repostCount, setRepostCount] = useState(0); // 리포스트 개수 상태 추가

    useEffect(() => {
        const fetchRepostData = async () => {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("❌ 로그인된 사용자 없음");
                    return;
                }

                // ✅ 현재 사용자의 리포스트 여부 확인
                const repostResponse = await axios.get(`http://localhost:8080/api/posts/${postId}/repost`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (repostResponse.status === 200) {
                    setReposted(true);
                    setRepostId(repostResponse.data.id);
                } else if (repostResponse.status === 204) {
                    setReposted(false); // 리포스트 안 했으면 false
                    setRepostId(null);
                }
            } catch (error) {
                if (error.response && error.response.status === 204) {
                    setReposted(false);
                    setRepostId(null);
                } else {
                    console.error("❌ 리포스트 여부 확인 실패:", error);
                }
            }

            try {
                // ✅ 전체 리포스트 개수 가져오기
                const countResponse = await axios.get(`http://localhost:8080/api/posts/${postId}/reposts`);
                setRepostCount(countResponse.data.length);
            } catch (error) {
                console.error("❌ 리포스트 개수 조회 실패:", error);
            }
        };

        fetchRepostData();
    }, [postId]);

    const handleRepostToggle = async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                console.error("❌ 로그인된 사용자 없음");
                return;
            }

            if (reposted) {
                if (!repostId) {
                    console.error("❌ 리포스트 ID 없음");
                    return;
                }

                await axios.delete(`http://localhost:8080/api/reposts/${repostId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setReposted(false);
                setRepostId(null);
                setRepostCount(prev => prev - 1); // 리포스트 개수 감소
            } else {
                const response = await axios.post(`http://localhost:8080/api/posts/${postId}/reposts`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.id) {
                    setReposted(true);
                    setRepostId(response.data.id);
                    setRepostCount(prev => prev + 1); // 리포스트 개수 증가
                } else {
                    console.error("❌ 서버에서 리포스트 ID를 받지 못함");
                }
            }
        } catch (error) {
            console.error("❌ 리포스트 상태 변경 실패:", error);
        }
    };

    return (
        <div className="repost-container">
            <img
                src={reposted ? "/reposted_icon.png" : "/repost_icon.png"} // ✅ 리포스트 여부에 따라 아이콘 변경
                alt={reposted ? "Reposted" : "Repost"}
                className="action-icon"
                onClick={handleRepostToggle}
                style={{ cursor: "pointer" }}
            />
            <span>{repostCount}</span> {/* ✅ 리포스트 개수 표시 */}
        </div>
    );
};

export default RepostButton;
