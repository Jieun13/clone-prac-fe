import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // 백엔드 URL에 맞게 변경

const commentService = {
    // 댓글 생성
    createComment: async (postId, commentData, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/post/${postId}/comments`,
                commentData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('댓글 생성 오류:', error);
            throw error;
        }
    },

    // 대댓글 생성
    createReply: async (commentId, commentData, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/comments/${commentId}/replies`,
                commentData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('대댓글 생성 오류:', error);
            throw error;
        }
    },

    // 특정 게시글의 댓글 목록 조회
    getCommentsByPost: async (postId, token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/post/${postId}/comments`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('댓글 조회 오류:', error);
            throw error;
        }
    },

    // 댓글 삭제
    deleteComment: async (commentId, token) => {
        try {
            await axios.delete(
                `${API_BASE_URL}/comments/${commentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (error) {
            console.error('댓글 삭제 오류:', error);
            throw error;
        }
    },
};

export default commentService;
