import React, { useState } from "react";
import { likePost, unlikePost } from "../service/likeService";

const LikeButton = ({ postId, isLiked, likeId }) => {
    const [liked, setLiked] = useState(isLiked);
    const [currentLikeId, setCurrentLikeId] = useState(likeId);

    const handleLike = async () => {
        try {
            if (!liked) {
                const like = await likePost(postId);
                setCurrentLikeId(like.id);
            } else {
                await unlikePost(currentLikeId);
                setCurrentLikeId(null);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("좋아요 처리 중 오류 발생:", error);
        }
    };

    return (
        <button onClick={handleLike}>
            {liked ? "좋아요 취소" : "좋아요"}
        </button>
    );
};

export default LikeButton;
