import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useMediaQuery } from "react-responsive";

function Posts({ Review }) {
    const [Like,setLike] = useState(0);
    const {AllReview} = useTheme();

    return (
        <div style={{ marginTop: '65px' }}>
            <div>
                {AllReview.map(post => (
                    <div
                        key={post._id}
                        className="d-flex flex-column ps-5 pt-5 gap-2 bg-black text-white"
                        style={{ width: '100%' }}
                    >
                        <div className="star d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
                            {Array.from({ length: post.comments[0].User[0].ProductUserRating }, (_, i) => (
                                <i key={i} className="fa-solid fa-star"></i>
                            ))}
                        </div>
                        <div className="user">
                            <img
                                src={post.comments[0].User[0].userImage}
                                className="user-image"
                                alt="Image 2"
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                            <h5 className="mt-2">{post.comments[0].User[0].username}</h5>
                        </div>
                        <span className=" ps-5 m-0">{post.comments[0].User[0].comment}</span>
                        <div className="ps-5 d-flex fs-6 gap-5">
                            <div className=" d-flex align-items-center gap-1"><i class="fa-solid fa-heart" onClick={()=>setLike(1)}></i><span>{Like}</span></div>
                            <div className=" d-flex align-items-center gap-1"><i class="fa-solid fa-comment"></i><span>Replay</span></div>
                            <div className=" d-flex align-items-center gap-1"><i class="fa-solid fa-share-nodes"></i><span>Share</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Posts;