import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import followService from '../service/followService';
import './Home.css';

const Home = () => {
    const [user, setUser] = useState(null);
    const [newNickname, setNewNickname] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [followersCount, setFollowersCount] = useState(0);
    const [followingsCount, setFollowingsCount] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
                setNewNickname(response.data.nickname);

                // 🔹 팔로워/팔로잉 수 가져오기
                const followers = await followService.getFollowersCount(response.data.id, token);
                const followings = await followService.getFollowingsCount(response.data.id, token);
                setFollowersCount(followers);
                setFollowingsCount(followings);

            } catch (error) {
                console.error('❌ 인증 오류:', error);
                localStorage.removeItem('access_token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleNicknameChange = async () => {
        if (!newNickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://localhost:8080/api/users/${user.id}`,
                { nickname: newNickname },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser((prevUser) => ({ ...prevUser, nickname: newNickname }));
            setIsEditing(false);

        } catch (error) {
            console.error("❌ 닉네임 변경 오류:", error);
            alert("닉네임 변경에 실패했습니다.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container" style={{
                width: '80%',
                display: 'flex',
                marginTop: '30px',
                marginBottom: '30px',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '50px 20px',
                border: '0.1px solid #d3d3d3'
            }}>
                <h1>Home</h1>
                {user ? (
                    <div>
                        <img src={"./profile_icon.png"} alt="profileIcon" className="profile-icon"/>
                        <h2>
                            안녕하세요,&nbsp;
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
                                        lineHeight: "1.2em"
                                    }}
                                />
                            ) : (
                                user.nickname
                            )}
                            님!
                        </h2>
                        <h4>가입된 이메일 : {user.email}</h4>

                        {isEditing ? (
                            <button onClick={handleNicknameChange}>
                                저장
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(true)}>
                                닉네임 변경
                            </button>
                        )}
                        <button onClick={() => navigate('/feed')}>나의 피드</button>
                    </div>
                ) : (
                    <p>로딩 중...</p>
                )}
                <div className="box-mini">
                    <div className="info-follow">
                        <p><strong>팔로워</strong> {followersCount}</p>
                        <p><strong>팔로잉</strong> {followingsCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
