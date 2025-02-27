import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NevigateBar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []); // 초기 렌더링 시 한 번만 실행

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);  // 상태를 false로 변경하여 로그아웃 상태로 갱신
        navigate('/login');
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <Link to="/feed" className="home-link">
                    <strong>Home</strong>
                </Link>
            </div>
            <div className="navbar-right">
                <Link to="/search" className="my-link">사용자 검색 🔍</Link>
                <Link to="/" className="my-link">My</Link>
                {isLoggedIn ? (
                    <button className="logout" onClick={handleLogout}>
                        로그아웃
                    </button>
                ) : (
                    <button className="login" onClick={() => navigate('/login')}>
                        로그인
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;