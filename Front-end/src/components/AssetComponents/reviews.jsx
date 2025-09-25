import React, { useEffect, useState } from 'react';
import { useTheme } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../Service/ApiService/product-api';

const ReviewSlider = () => {
  const { isAuthenticated,AllReview,fetchAllReviews } = useTheme(); // Review = [ { title, comments: [ { User: [reviewers...] } ] } ]
  const Navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flattenedReviews, setFlattenedReviews] = useState([]);

  // Utility to shuffle array
const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

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

    // Shuffle before setting
    const shuffled = shuffleArray(allReviews);
    setFlattenedReviews(shuffled);
  }
}, [AllReview]);


  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        flattenedReviews.length === 0 ? 0 : (prevIndex + 1) % flattenedReviews.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [flattenedReviews]);

  return (
    <div className="overflow-hidden relative" style={{ height: '160px' }}>
      <div
        className="reviews-shower"
        style={{
          transform: `translateY(${currentIndex * -160}px)`,
          transition: 'all .8s',
        }}
      >
        {flattenedReviews.length === 0 ? (
          <div style={{ height: '160px' }}>Loading...</div>
        ) : (
          flattenedReviews.map((user, idx) => (
            <div
              key={idx}
              onClick={() => Navigate('/Posts')}
              className="d-flex flex-column gap-2 px-3"
              style={{ width: '100%', height: '160px' }}
            >
              <h6 className="fw-bold">{user.title}</h6>
              <div className="star d-flex align-items-center gap-1" style={{ fontSize: '14px' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className={`fa-solid fa-star ${i + 1 <=user.ProductUserRating?"text-warning":"text-white"}`}></i>
                ))}
              </div>
              <div className="user d-flex align-items-center gap-2">
                <img
                  // src={user.userImage}
                  src={`${ApiService.Backend+user?.userImage}`}
                  className="user-image"
                  alt={user.username}
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  onError={(e) => {
    e.currentTarget.onerror = null; // avoid infinite loop
    e.currentTarget.src = "assets/user.png"; // fallback if image not found
  }}
                />
                <h5 className="m-0">{user.username}</h5>
              </div>
              <p className="review ps-2 m-0">{user.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSlider;
