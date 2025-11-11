import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from "../../ThemeContext";
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export default function ProductCard({ isAuthenticated, product, Navigate, LikedState, handleCancelItem, cart = false }) {

  const { UserLikedState, PostUserLikedState, UpdatedProduct, Theme, category } = useTheme();
  const Location = useLocation();
  const [Heart, setHeart] = useState(false);
  const small = useMediaQuery({ maxWidth: 600 });
  
  // Handle both direct product data and nested productDetails structure
  const productData = cart ? product : (product?.productDetails || product);

  // Get offer for this product's category
  const offerPercent = useMemo(() => {
    const categoryId = cart ? 
      Number(product?.categoryId) : 
      Number(productData?.categoryId);
    const matched = category?.find(c => c.categoryId === categoryId);
    return matched?.offer || 0; // default 0 if no offer found
  }, [category, product?.categoryId, productData?.categoryId, cart]);

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    const price = cart ? 
      Number(product?.itemPrice || 0) : 
      Number(productData?.price || 0);
    return price - (price * (offerPercent / 100));
  }, [product?.itemPrice, productData?.price, offerPercent, cart]);

  //console.log("UserLikedState:", UserLikedState);

  // Wishlist state
  useEffect(() => {
    const source = Location.pathname === '/WishList' ? LikedState : UserLikedState;
    // Try to match by both ProductId and _id to handle all cases
    const User = source?.find(u => 
      String(u.ProductId) === String(productData?._id) || 
      String(u.ProductId) === String(product?.ProductId) ||
      String(u.productDetails?._id) === String(productData?._id)
    );
    setHeart(User?.likedState === true);
    //
  }, [UserLikedState, LikedState, productData?._id, product?.ProductId, Location.pathname]);

  return (
    <div key={cart ? product?._id : productData?._id} className={`product-item ${Theme ? 'bg-white text-black shadow border border-1 border-black' : 'bg-black text-white'}`}>
      <img 
        src={cart ? (product?.Product_Url || product?.url) : productData?.url} 
        className='Shop-slid' 
        alt={cart ? (product?.itemName || product?.title) : productData?.title} 
      />
      <div className='d-flex flex-column w-100 mt-1'>
        <div className={`product_name_price d-flex ${small && cart ? 'flex-column align-items-start gap-2' : 'align-items-center'} justify-content-between`}>
          <h4 className='card-text'>{cart ? (product?.itemName || product?.title) : productData?.title}</h4>

          {/* Dynamic Price Display */}
          <h4 className={`display-product-text-price d-flex ${small && cart ? 'flex-row gap-1' : 'flex-column'}`}>
            {offerPercent > 0 ? (
              <>
                <del>₹{cart ? (product?.itemPrice || 0).toFixed(2) : (productData?.price || 0).toFixed(2)}</del>
                ₹{discountedPrice.toFixed(2)}
              </>
            ) : (
              <>₹{cart ? (product?.itemPrice || 0).toFixed(2) : (productData?.price || 0).toFixed(2)}</>
            )}
          </h4>
        </div>

        <p className='Poduct-Description'>{cart ? (product?.Description || product?.description) : productData?.description}</p>

        {!cart && isAuthenticated?.userId && (
          <div className='d-flex justify-content-between p-1'>
            <p>
              <i className="fa-solid fa-star text-warning me-1"></i>
              {UpdatedProduct?._id === productData?._id ? Number(UpdatedProduct?.rating).toFixed(1) : Number(productData?.rating).toFixed(1)}
            </p>

            <p className='d-flex align-items-center'>
              {Heart ? (
                <i
                  className='fa-solid fa-heart text-danger mx-1 fs-5'
                  onClick={() =>
                    PostUserLikedState(
                      isAuthenticated?.userId,
                      product?.ProductId || productData?._id,
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
                      product?.ProductId || productData?._id,
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
        <button className='product-card-OrderNow-btn w-100 text-center' onClick={() => handleCancelItem(product?.productId || product?._id)}>
          Cancel
        </button>
      ) : (
        <button
          className="product-card-OrderNow-btn text-center"
          onClick={() => {
            if (!isAuthenticated && Location.pathname === '/Login') {
              window.scrollTo(0, 0);
            } else if (isAuthenticated) {
              Navigate(`/product/${productData?._id}`);
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
