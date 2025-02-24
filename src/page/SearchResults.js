import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css";
import PostAuthor from "../component/PostAuthor";
import LikeButton from "../component/LikeButton";
import RepostButton from "../component/RepostButton";

const SearchResults = () => {
    const { hashtag } = useParams(); // ✅ URL 파라미터에서 해시태그 가져오기
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate(); // ✅ useNavigate를 최상위에서 선언

    useEffect(() => {
        const fetchPostsByHashtag = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/search?hashtag=${hashtag}`);
                setPosts(response.data);
            } catch (error) {
                console.error("해시태그 검색 오류:", error);
            }
        };

        fetchPostsByHashtag();
    }, [hashtag]);

    // 해시태그 강조 및 네비게이션 처리
    const highlightHashtags = (text) => {
        return text.split(/(\s+)/).map((word, index) =>
            word.startsWith("#") ? (
                <span
                    key={index}
                    className="hashtag"
                    onClick={() => navigate(`/search/${word.substring(1)}`)} // ✅ 클릭 시 이동
                >
                    {word}
                </span>
            ) : (
                word
            )
        );
    };

    return (
        <div className="search-container">
            <h2 className="search-title">🔍 #{hashtag} 검색 결과</h2>
            <ul className="search-results">
                {posts.map((post) => (
                    <li key={post.id} className="search-item">
                        <div className="search-header">
                            <div className="search-author">
                                <PostAuthor author={post.author}/>
                            </div>
                            <p className="search-date">{post.date}</p>
                        </div>
                        <h4>{post.title}</h4>
                        <p>{highlightHashtags(post.content)}</p>
                        <div className="post-actions">
                            <RepostButton postId={post.id}/>
                            <LikeButton postId={post.id}/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;
