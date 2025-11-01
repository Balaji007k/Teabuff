import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from "../../ThemeContext";
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export default function ProductCard({ isAuthenticated, product, Navigate, LikedState, handleCancelItem, cart = false }) {

  const { UserLikedState, PostUserLikedState, UpdatedProduct, Theme, category } = useTheme();
  const Location = useLocation();
  const [Heart, setHeart] = useState(false);
  const small = useMediaQuery({ maxWidth: 600 });

  // Get offer for this product's category
  const offerPercent = useMemo(() => {
    const matched = category?.find(c => c.categoryId === Number(product.categoryId));
    return matched?.offer || 0; // default 0 if no offer found
  }, [category, product.categoryId]);

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    const price = Number(product.price || product.itemPrice);
    return price - (price * (offerPercent / 100));
  }, [product.price, product.itemPrice, offerPercent]);

  // Wishlist state
  useEffect(() => {
    const source = Location.pathname === '/WishList' ? LikedState : UserLikedState;
    const User = source?.find(u => String(u.ProductId) === String(product.ProductId || product._id));
    setHeart(User?.likedState === true);
  }, [UserLikedState, LikedState, product._id, product.ProductId, Location.pathname]);

  return (
    <div key={product._id} className={`product-item ${Theme ? 'bg-white text-black shadow border border-1 border-black' : 'bg-black text-white'}`}>
      <img src={product.url || product.Product_Url} className='Shop-slid' alt={product.title} />
      <div className='d-flex flex-column w-100 mt-1'>
        <div className={`product_name_price d-flex ${small && cart ? 'flex-column align-items-start gap-2' : 'align-items-center'} justify-content-between`}>
          <h4 className='card-text'>{product.title || product.itemName}</h4>

          {/* Dynamic Price Display */}
          <h4 className={`display-product-text-price d-flex ${small && cart ? 'flex-row gap-1' : 'flex-column'}`}>
            {offerPercent > 0 ? (
              <>
                <del>₹{(product.price || product.itemPrice).toFixed(2)}</del>
                ₹{discountedPrice.toFixed(2)}
              </>
            ) : (
              <>₹{(product.price || product.itemPrice).toFixed(2)}</>
            )}
          </h4>
        </div>

        <p className='Poduct-Description'>{product.description || product.Description}</p>

        {!cart && isAuthenticated?.userId && (
          <div className='d-flex justify-content-between p-1'>
            <p>
              <i className="fa-solid fa-star text-warning me-1"></i>
              {UpdatedProduct?._id === product._id ? Number(UpdatedProduct?.rating).toFixed(1) : Number(product.rating || product.Rating).toFixed(1)}
            </p>

            <p className='d-flex align-items-center'>
              {Heart ? (
                <i
                  className='fa-solid fa-heart text-danger mx-1 fs-5'
                  onClick={() =>
                    PostUserLikedState(
                      isAuthenticated?.userId,
                      product.ProductId || product._id,
                      !Heart && true
                    )
                  }
                ></i>
              ) : (
                <i
                  className='fa-solid fa-heart-crack mx-1 fs-5'
                  onClick={() =>
                    PostUserLikedState(
                      isAuthenticated?.userId,
                      product.ProductId || product._id,
                      !Heart && true
                    )
                  }
                ></i>
              )}
            </p>
          </div>
        )}
      </div>

      {cart ? (
        <button className='product-card-OrderNow-btn w-100 text-center' onClick={() => handleCancelItem(product.productId)}>
          Cancel
        </button>
      ) : (
        <button
          className="product-card-OrderNow-btn text-center"
          onClick={() => {
            if (!isAuthenticated && Location.pathname === '/Login') {
              window.scrollTo(0, 0);
            } else if (isAuthenticated) {
              Navigate(`/product/${product.ProductId || product._id}`);
            } else {
              Navigate('/Login');
            }
          }}
        >
          {small?'Buy Now':'Order Now'} {offerPercent>0&&<span className='text-success' style={{fontSize:small&&'10px'}}>({offerPercent}% OFF)</span>}
        </button>
      )}
    </div>
  );
}
