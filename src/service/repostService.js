import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * 특정 포스트 리포스트
 * @param {number} postId - 리포스트할 포스트 ID
 * @returns {Promise} - 리포스트 결과
 */
export const createRepost = async (postId) => {
    try {
        const response = await axios.post(`/posts/${postId}/reposts`);
        return response.data;
    } catch (error) {
        console.error("리포스트 생성 실패:", error);
        throw error;
    }
};

/**
 * 특정 리포스트 조회
 * @param {number} repostId - 조회할 리포스트 ID
 * @returns {Promise} - 리포스트 데이터
 */
export const getRepostById = async (repostId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reposts/${repostId}`);
        return response.data;
    } catch (error) {
        console.error("리포스트 조회 실패:", error);
        throw error;
    }
};

/**
 * 현재 로그인한 사용자의 리포스트 목록 조회
 * @returns {Promise} - 리포스트 목록
 */
export const getUserReposts = async () => {
    try {
        const response = await axios.get("/users/reposts");
        return response.data;
    } catch (error) {
        console.error("사용자 리포스트 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 특정 리포스트 삭제 (리포스트 취소)
 * @param {number} repostId - 삭제할 리포스트 ID
 * @returns {Promise} - 삭제 결과
 */
export const deleteRepost = async (repostId) => {
    try {
        await axios.delete(`${API_BASE_URL}/reposts/${repostId}`);
    } catch (error) {
        console.error("리포스트 삭제 실패:", error);
        throw error;
    }
};
