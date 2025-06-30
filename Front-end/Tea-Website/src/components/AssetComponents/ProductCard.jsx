import React, { useEffect, useState } from 'react';
import { useTheme } from "../../ThemeContext"
import { useLocation } from 'react-router-dom';

export default function ProductCard({ isAuthenticated, e, Navigate, LikedState }) {

  const { UserLikedState, PostUserLikedState, UpdatedProduct } = useTheme();
  const Location = useLocation();
  const [Heart, setHeart] = useState(false);
  
  useEffect(() => {
  const source = Location.pathname === '/WishList' ? LikedState : UserLikedState;

  const User = source?.find(u => String(u.ProductId) === String(e.ProductId||e._id));
  setHeart(User?.likedState === true);

}, [UserLikedState, LikedState, e._id]);

        return (
          <div key={e._id} className='product-item'>
            <img src={e.url} className='Shop-slid' alt={e.title} />
            <div className='d-flex flex-column w-100'>
              <div className='d-flex justify-content-between align-items-center'>
                <h4 className='card-text my-2'>{e.title}</h4>
                <h4 className='display-product-text-price my-2'>₹{e.price}</h4>
              </div>
              <p className='Poduct-Description'>{e.description}</p>
              <div className=' d-flex justify-content-between p-1'>
                <p><i className="fa-solid fa-star text-warning me-1"></i>{UpdatedProduct?._id===e._id?Number(UpdatedProduct?.rating).toFixed(1):Number(e.rating).toFixed(1)}</p>
                {isAuthenticated?.userId && <p className='d-flex align-items-center'>
                  {Heart?<i className={`fa-solid fa-heart text-danger mx-1 fs-5`} onClick={() => { isAuthenticated?.userId && PostUserLikedState(isAuthenticated?.userId, e.ProductId || e._id, e.title, e.price, e.description, e.url, e.categoryId, e.rating, e.ingredients, e.features, e.purchaseLink, !Heart && true) }}></i>
                  :<i className='fa-solid fa-heart-crack text-white mx-1 fs-5' onClick={() => { isAuthenticated?.userId && PostUserLikedState(isAuthenticated?.userId, e.ProductId || e._id, e.title, e.price, e.description, e.url, e.categoryId, e.rating, e.ingredients, e.features, e.purchaseLink, !Heart && true) }}></i>}
                </p>}
              </div>
            </div>
            <button
              className="order-button rounded-5 p-2 w-100 text-center" style={{color:'var(--btn-color)'}}
              onClick={() => {
                if (!isAuthenticated && Location.pathname === '/Login') {
                  window.scrollTo(0, 0);
                } else if (isAuthenticated) {
                  Navigate(`/product/${e.ProductId || e._id}`);
                } else {
                  Navigate('/Login');
                }
              }}
            >
              Order Now
            </button>

          </div>
        );
}