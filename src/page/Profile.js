import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import followService from "../service/followService";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // 🔹 현재 로그인된 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                console.log("🔍 저장된 토큰:", token); // ✅ 콘솔로 토큰 확인

                if (!token) {
                    console.error("❌ 로그인된 사용자 없음");
                    navigate("/login");
                    return;
                }

                const userResponse = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ 현재 로그인한 유저 정보:", userResponse.data);
                setCurrentUserId(userResponse.data.id);
            } catch (error) {
                console.error("❌ 인증 오류:", error);
                localStorage.removeItem("access_token");
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]); // `navigate` 의존성 추가

    // 🔹 프로필 유저 데이터 및 팔로우 상태 가져오기
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUserId) return; // currentUserId가 설정된 후 실행

            try {
                const token = localStorage.getItem("access_token");

                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ 프로필 유저 정보:", response.data);
                setUser(response.data);

                const followingStatus = await followService.checkFollowing(userId, currentUserId);
                setIsFollowing(followingStatus);
            } catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUserId]); // currentUserId 변경될 때마다 실행

    // 🔹 팔로우/언팔로우 버튼 클릭 핸들러
    const handleFollow = async () => {
        try {
            const token = localStorage.getItem("access_token");
            console.log("🔍 저장된 토큰:", token); // ✅ 콘솔로 토큰 확인

            if (!token) {
                console.error("❌ 로그인된 사용자 없음");
                navigate("/login");
                return;
            }

            if (isFollowing) {
                await followService.unfollowUser(userId, token);
                console.log("✅ 언팔로우 완료");
                setIsFollowing(false);
            } else {
                await followService.followUser(userId, token);
                console.log("✅ 팔로우 완료");
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("❌ 팔로우 상태 변경 실패:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="profile-container">
            <h2>{user.nickname}</h2>
            <p>@{user.username}</p>
            <p>Email: {user.email}</p>
            <button className={isFollowing ? "unfollow" : "follow"} onClick={handleFollow}>
                {isFollowing ? "언팔로우" : "팔로우"}
            </button>
        </div>
    );
};

export default Profile;
