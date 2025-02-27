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
    const [isEditing, setIsEditing] = useState(false);
    const [newNickname, setNewNickname] = useState("");
    const [followersCount, setFollowersCount] = useState(0);  // 🔹 팔로워 수 상태 추가
    const [followingsCount, setFollowingsCount] = useState(0); // 🔹 팔로잉 수 상태 추가

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const userResponse = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setCurrentUserId(userResponse.data.id);
            } catch (error) {
                console.error("❌ 인증 오류:", error);
                localStorage.removeItem("access_token");
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUserId) return;

            try {
                const token = localStorage.getItem("access_token");

                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);

                if (currentUserId.toString() !== userId) {
                    try {
                        const isFollowing = await followService.checkFollowing(userId, currentUserId, token);
                        setIsFollowing(isFollowing);
                    } catch (error) {
                        console.error("❌ 팔로우 상태 확인 실패:", error);
                    }
                }
                const followers = await followService.getFollowersCount(userId, token);
                const followings = await followService.getFollowingsCount(userId, token);
                setFollowersCount(followers);
                setFollowingsCount(followings);
            } catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUserId]);

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                navigate("/login");
                return;
            }

            if (isFollowing) {
                await followService.unfollowUser(userId, token);
                setIsFollowing(false);
                setFollowersCount((prev) => Math.max(0, prev - 1));  // 🔹 언팔로우 시 팔로워 수 감소
            } else {
                await followService.followUser(userId, token);
                setIsFollowing(true);
                setFollowersCount((prev) => prev + 1);  // 🔹 팔로우 시 팔로워 수 증가
            }
        } catch (error) {
            console.error("❌ 팔로우 상태 변경 실패:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="profile-container">
            <img src={"/profile_icon.png"} alt="profileIcon" className="profile-icon" />
            <h2>{user.nickname}</h2>
            <h4>가입된 이메일 : {user.email}</h4>

            {currentUserId?.toString() !== userId && (
                <button className={isFollowing ? "unfollow" : "follow"} onClick={handleFollow}>
                    {isFollowing ? "언팔로우" : "팔로우"}
                </button>
            )}
            <div className="box-mini">
                <div className="info-follow">
                    <p><strong>팔로워</strong> {followersCount}</p>
                    <p><strong>팔로잉</strong> {followingsCount}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;