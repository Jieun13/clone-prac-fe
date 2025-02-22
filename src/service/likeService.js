import axios from "axios";

const API_BASE_URL = "/api";

/**
 * 특정 포스트 좋아요
 * @param {number} postId - 좋아요할 포스트 ID
 * @returns {Promise} - 좋아요 결과
 */
export const likePost = async (postId) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
            `${API_BASE_URL}/posts/${postId}/likes`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("좋아요 추가 실패:", error);
        throw error;
    }
};

/**
 * 특정 포스트의 좋아요 목록 조회
 * @param {number} postId - 조회할 포스트 ID
 * @returns {Promise} - 좋아요한 사용자 목록
 */
export const getPostLikes = async (postId) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}/likes`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("좋아요 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 현재 로그인한 사용자가 좋아요한 포스트 목록 조회
 * @returns {Promise} - 좋아요한 포스트 목록
 */
export const getUserLikes = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_BASE_URL}/users/likes`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("사용자의 좋아요 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 좋아요 취소
 * @param {number} likeId - 취소할 좋아요 ID
 * @returns {Promise} - 삭제 결과
 */
export const unlikePost = async (likeId) => {
    try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`${API_BASE_URL}/likes/${likeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("좋아요 취소 실패:", error);
        throw error;
    }
};

/**
 * 특정 포스트의 좋아요 개수 조회
 * @param {number} postId - 조회할 포스트 ID
 * @returns {Promise<number>} - 좋아요 개수
 */
export const getPostLikesCnt = async (postId) => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}/likes`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("좋아요 목록 조회 실패:", error);
        throw error;
    }
};

