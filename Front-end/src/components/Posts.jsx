import { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import "../style/Post.css"
import ApiService from "./Service/ApiService/product-api";
import { formatShortTimeAgo } from "../TimeContext";

function Posts() {
  const { isAuthenticated,AllReview } = useTheme();
  const [flattenedReviews, setFlattenedReviews] = useState([]);
  //const [likes, setLikes] = useState({}); // track likes per review
  

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  useEffect(() => {
    if (AllReview && AllReview.length > 0) {
      const allReviews = [];

      AllReview.forEach((product) => {
        const { title, comments } = product;

        comments.forEach((commentBlock) => {
          commentBlock.User.forEach((userReview) => {
            allReviews.push({
              title,
              ...userReview,
            });
          });
        });
      });

      setFlattenedReviews(allReviews);
    }
  }, [AllReview]);

  // toggle like per review
  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="container mb-4" style={{ marginTop: "75px" }}>
      <div className="row g-3">
        {flattenedReviews.map((review) => (
          <div
            key={review._id}
            className="col-12 col-md-6" // 1 per row on mobile, 2 per row on desktop
          >
            
            <div className="card bg-dark text-white shadow-sm h-100 rounded-4 position-relative">
              <div className="card-body d-flex flex-column gap-2">
                <span className=" position-absolute top-0 end-0 p-3">{formatShortTimeAgo(review?.createdAt)}</span>
                {/* Title */}
                <h6 className="fw-bold">{review.title}</h6>

                {/* Rating stars */}
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "14px", color: "#FFD700" }}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={`fa-solid fa-star ${i + 1 <=review.ProductUserRating?'text-warning':'text-white'}`}></i>
                  ))}
                </div>

                {/* User info */}
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={`${ApiService.Backend+review?.userImage}`}
                    className="rounded-circle"
                    alt={review.username}
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    onError={(e) => {
    e.currentTarget.onerror = null; // avoid infinite loop
    e.currentTarget.src = "assets/user.png"; // fallback if image not found
  }}
                  />
                  <h6 className="mb-0">{review.username}</h6>
                </div>

                {/* Comment */}
                <p className="ps-1 mb-1">{review.comment}</p>

                {/* Actions */}
                {/* <div className="d-flex justify-content-start gap-5 pt-2">
                  <div
                    className="d-flex align-items-center gap-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLike(review._id)}
                  >
                    <i className="fa-solid fa-heart"></i>
                    <span>{likes[review._id] || 0}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="fa-solid fa-comment"></i>
                    <span>Reply</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="fa-solid fa-share-nodes"></i>
                    <span>Share</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
