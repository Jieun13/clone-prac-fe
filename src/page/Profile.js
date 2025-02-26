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

    // 🔹 현재 로그인된 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("❌ 로그인된 사용자 없음");
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

    // 🔹 프로필 유저 데이터 및 팔로우 상태 가져오기
    // 🔹 프로필 유저 데이터 및 팔로우 상태 가져오기
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUserId) return;

            try {
                const token = localStorage.getItem("access_token");

                // 🔹 유저 정보 가져오기
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);

                // 🔹 현재 로그인한 유저가 아닌 경우에만 팔로우 상태 조회
                if (currentUserId.toString() !== userId) {
                    try {
                        await axios.get(`http://localhost:8080/api/users/${userId}/follow`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setIsFollowing(true);
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            setIsFollowing(false);
                        } else {
                            console.error("❌ 팔로우 상태 확인 실패:", error);
                        }
                    }
                }
            } catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUserId]);

    // 🔹 닉네임 변경 핸들러
    const handleNicknameChange = async () => {
        if (!newNickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                `http://localhost:8080/api/users/${user.id}`,
                { nickname: newNickname },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser((prevUser) => ({ ...prevUser, nickname: newNickname }));
            setIsEditing(false);
        } catch (error) {
            console.error("닉네임 변경 오류:", error);
            alert("닉네임 변경에 실패했습니다.");
        }
    };

    // 🔹 팔로우/언팔로우 버튼 클릭 핸들러
    const handleFollow = async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                console.error("❌ 로그인된 사용자 없음");
                navigate("/login");
                return;
            }

            if (isFollowing) {
                await followService.unfollowUser(userId, token);
                setIsFollowing(false);
            } else {
                await followService.followUser(userId, token);
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

            <img src={"/profile_icon.png"} alt="profileIcon" className="profile-icon"/>
            <h2>
                {isEditing ? (
                    <input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        style={{
                            width: "20%",
                            fontSize: "15px",
                            padding: "5px",
                            marginRight: "5px",
                            verticalAlign: "middle",
                            lineHeight: "1.2em"  // h2와 높이 맞추기
                        }}
                    />
                ) : (
                    user.nickname
                )}
            </h2>
            <h4>가입된 이메일 : {user.email}</h4>

            {currentUserId?.toString() === userId && (
                isEditing ? (
                    <>
                        <button className="cancel-button" onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>취소</button>
                        <button className="save-button" onClick={handleNicknameChange}>저장</button>
                    </>
                ) : (
                    <button className="update-button" onClick={() => setIsEditing(true)}>닉네임 변경</button>
                )
            )}

            {currentUserId?.toString() !== userId && (
                <button className={isFollowing ? "unfollow" : "follow"} onClick={handleFollow}>
                    {isFollowing ? "언팔로우" : "팔로우"}
                </button>
            )}



        </div>
    );
};

export default Profile;
