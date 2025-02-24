import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/posts";

/**
 * 새로운 포스트를 생성
 * @param {Object} postData - { title, content }
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} 생성된 포스트 데이터
 */
export const createPost = async (postData, token) => {
    try {
        const response = await axios.post(API_BASE_URL, postData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("포스트 생성 오류:", error);
        throw error;
    }
};

/**
 * 전체 포스트 조회
 * @returns {Promise} 포스트 목록
 */
export const getAllPosts = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("포스트 조회 오류:", error);
        throw error;
    }
};

/**
 * 로그인한 사용자의 피드 조회
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} 피드 포스트 목록
 */
export const getUserFeed = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/feed`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("피드 조회 오류:", error);
        throw error;
    }
};

/**
 * 특정 사용자의 포스트 조회
 * @param {number} authorId - 조회할 사용자의 ID
 * @returns {Promise} 해당 사용자의 포스트 목록
 */
export const getPostsByAuthor = async (authorId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${authorId}`);
        return response.data;
    } catch (error) {
        console.error("사용자 포스트 조회 오류:", error);
        throw error;
    }
};

/**
 * 포스트 수정
 * @param {number} postId - 수정할 포스트 ID
 * @param {Object} postData - { title, content }
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} 수정된 포스트 데이터
 */
export const updatePost = async (postId, postData, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${postId}`, postData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("포스트 수정 오류:", error);
        throw error;
    }
};

/**
 * 포스트 삭제
 * @param {number} postId - 삭제할 포스트 ID
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} 성공 여부
 */
export const deletePost = async (postId, token) => {
    try {
        await axios.delete(`${API_BASE_URL}/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("포스트 삭제 오류:", error);
        throw error;
    }
};
