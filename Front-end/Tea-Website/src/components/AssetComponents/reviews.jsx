import React, { useEffect, useState } from 'react';
import { useTheme } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';

const ReviewSlider = () => {
  const {Review} = useTheme();
  const Navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0)

  // Automatically change reviews every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Review.length); // Loop back to the first review
    }, 4000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [Review.length]); // Trigger the effect when the Review array length changes

  return (
    <div className="overflow-hidden relative">
      <div
        className="reviews-shower"
        style={{
          transform: `translateY(${currentIndex * -150}px)`, transition: 'all .8s' // Move container vertically by the height of one review
        }}
      >
        {!Review || Review.length === 0 ? (<div>
          Loading...
        </div>) : (Review.map((user) => (
          <div
            key={user._id} onClick={()=>Navigate('/Posts')}
            className="d-flex flex-column gap-2"
            style={{ width: '100%', height: '150px' }}
          >
            <div className="star d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
              {Array.from({ length: user.rating }, (_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <div className="user">
              <img
                src={user.image}
                className="user-image"
                alt="Image 2"
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              <h5 className="mt-2">{user.name}</h5>
            </div>
            <p className="review ps-4">{user.review}</p>
          </div>
        )))}
      </div>
    </div>
  );
};

export default ReviewSlider;
