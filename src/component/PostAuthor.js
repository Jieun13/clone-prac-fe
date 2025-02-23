import { useNavigate } from "react-router-dom";

const PostAuthor = ({ author }) => {
    const navigate = useNavigate();

    return (
        <div
            className="post-author"
            onClick={() => navigate(`/profile/${author.id}`)}
            style={{ cursor: "pointer" }} // 마우스를 올리면 클릭 가능한 것처럼 보이게
        >
            <img src={"/profile_icon.png"} alt="profile" className="profile-img-feed"/>
            <h3 className="nickname">{author.nickname}</h3>
            <p className="username">@{author.username}</p>
        </div>
    );
};

export default PostAuthor;
