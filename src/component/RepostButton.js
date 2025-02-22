import React, { useState } from "react";
import { createRepost, deleteRepost } from "../service/repostService";

const RepostButton = ({ postId, isReposted, repostId }) => {
    const [reposted, setReposted] = useState(isReposted);
    const [currentRepostId, setCurrentRepostId] = useState(repostId);

    const handleRepost = async () => {
        try {
            if (!reposted) {
                const repost = await createRepost(postId);
                setCurrentRepostId(repost.id);
            } else {
                await deleteRepost(currentRepostId);
                setCurrentRepostId(null);
            }
            setReposted(!reposted);
        } catch (error) {
            console.error("리포스트 처리 중 오류 발생:", error);
        }
    };

    return (
        <button onClick={handleRepost}>
            {reposted ? "리포스트 취소" : "리포스트"}
        </button>
    );
};

export default RepostButton;
