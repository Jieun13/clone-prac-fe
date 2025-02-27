import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserSearch.css";

const UserSearch = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // ✅ 네비게이션 훅 사용

    useEffect(() => {
        if (query.trim() === "") {
            setUsers([]);
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/search?query=${encodeURIComponent(query)}`);
                setUsers(response.data);
            } catch (error) {
                console.error("사용자 검색 오류:", error);
            }
        };

        const timer = setTimeout(fetchUsers, 300); // ✅ 디바운스 적용
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="search-container">
            <h2 className="search-title">🔍 사용자 검색</h2>
            <input
                type="text"
                placeholder="사용자 이름을 입력하세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            <ul className="search-results">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} className="search-item"
                            onClick={() => navigate(`/profile/${user.id}`)}> {/* ✅ 클릭 시 사용자 프로필 페이지로 이동 */}
                            <div className="user-info">
                                <img src={user.profileImage || "/profile_icon.png"} alt="프로필" className="user-avatar" />
                                <div>
                                    <h4 className="user-name">{user.nickname}</h4>
                                    <p className="user-email">{user.username}</p>
                                    <p className="user-email">{user.email}</p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="search-empty">검색 결과가 없습니다.</li>
                )}
            </ul>
        </div>
    );
};

export default UserSearch;
