import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const followService = {
    getUser: async (userId, token) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("❌ 사용자 데이터 불러오기 실패:", error);
            return null;
        }
    },

    checkFollowing: async (userId, currentUserId, token) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}/followers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const followers = response.data;
            return followers.some(f => f.followerId === currentUserId);
        } catch (error) {
            console.error("❌ 팔로우 상태 확인 실패:", error);
            return false;
        }
    },

    followUser: async (userId, token) => {
        try {
            await axios.post(`${API_URL}/${userId}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("❌ 팔로우 요청 실패:", error.response?.data || error.message);
        }
    },

    unfollowUser: async (userId, token) => {
        try {
            await axios.delete(`${API_URL}/${userId}/follow`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("❌ 언팔로우 요청 실패:", error.response?.data || error.message);
        }
    },

    // 🔹 팔로워 수 가져오기
    getFollowersCount: async (userId, token) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}/followers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.length;
        } catch (error) {
            console.error("❌ 팔로워 수 불러오기 실패:", error);
            return 0;
        }
    },

    // 🔹 팔로잉 수 가져오기
    getFollowingsCount: async (userId, token) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}/followings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.length;
        } catch (error) {
            console.error("❌ 팔로잉 수 불러오기 실패:", error);
            return 0;
        }
    }
};

export default followService;