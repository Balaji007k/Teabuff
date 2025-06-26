import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import '../style/ProductItem.css';
import { useMediaQuery } from "react-responsive";
import { useTheme } from '../ThemeContext';
import Footer from './footer';
import ProductCard from './AssetComponents/ProductCard';
import EmptyProductCard from './AssetComponents/EmptyProductCard';
import ViewMore from './AssetComponents/ViewMore';
import ProductFilters from './AssetComponents/ProductFilters';
import PageNotFound from './AssetComponents/PageNotFound';

function ProductItem({ isAuthenticated, Review, productsItem, cart, category }) {

  const { handleCart, PostUserLikedState, UserLikedState, UpdateProduct, UserProductReviews, fetchProductReviews, ProductAvgRating } = useTheme();

  const reviews = UserProductReviews?.User || [];
  const ratingCounts = [0, 0, 0, 0, 0]; // index 0 = 1-star, ..., index 4 = 5-star

  reviews.forEach(review => {
    const rating = review.ProductUserRating || review.rating;
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1]++;
    }
  });

  const totalRatings = ratingCounts.reduce((a, b) => a + b, 0);

  const ratingPercentages = ratingCounts.map(count => {
    return totalRatings === 0 ? 0 : Math.round((count / totalRatings) * 100);
  });




  const Location = useLocation();
  const small = useMediaQuery({ maxWidth: 600 });
  const { id } = useParams(); // get id from URL
  const [quantity, setquantity] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductReview, setselectedProductReview] = useState([]);
  const [suggestedproducts, setSuggestedProducts] = useState([]);
  const [items, setProducts] = useState([]);
  const [Show, setShow] = useState(true);
  const [Rating, setRating] = useState(0);
  const [comment, setcomment] = useState('');
  const [Editcomment, setEditcomment] = useState(false);
  const Navigate = useNavigate();
  const [Heart, setHeart] = useState(false);

  const ShowBar = () => {
    setShow(prev => !prev)
  }

  const handleEditcomment = () => {
    setEditcomment(prev => !prev)
  }

  const Products = (Products) => {
    setProducts(Products)
  }

  useEffect(() => {
    if (isAuthenticated && UserLikedState) {
      fetchProductReviews(id);
      const User = UserLikedState.find(u => u?.ProductId === id);
      setHeart(!!User?.likedState); // Set to true or false accordingly
    }
  }, [UserLikedState, id]);

  useEffect(() => {
    if (isAuthenticated) {
      window.scrollTo(0, 0);
      if (productsItem?.length > 0 && id) {
        const found = productsItem.find(item => item._id === id);
        setSelectedProduct(found);
        if (found) {
          const Filtered = Review.filter(reviews => reviews.review.toLowerCase().replace(/\s+/g, '').includes(found.title.toLowerCase().replace(/\s+/g, '')))
          setselectedProductReview(Filtered);
          const filtedCategory = productsItem.filter(group => group.categoryId === found.categoryId)
          setSuggestedProducts(filtedCategory)
        }
        if (cart && found) {
          const productQuantity = cart.items.find(item => item.productId === found._id)
          if (productQuantity?.quantity) {
            setquantity(productQuantity?.quantity);
          }
          else {
            setquantity(0)
          }
        }
      }
    }
  }, [isAuthenticated, Review, cart, productsItem, id, Location.pathname]);

  if (quantity < 0) return setquantity(0)

  if (!isAuthenticated) {
    setTimeout(() => {
      Navigate('/Login')
    }, 3000)
    return <PageNotFound Message={"Product"} />
  }
  if (!selectedProduct) return <div className='Cart-holder fs-5 fw-bolder text-center'>No product Found.</div>;

  if (isAuthenticated && selectedProduct) return (
    <>
      <div className='Product-Page-cart d-flex flex-column align-items-center' style={{ marginTop: '75px', color: 'var(--Background-white-text)' }}>
        <ProductFilters productsItem={productsItem} category={category} Products={Products} id={id} />

        {items.length === 0 &&
          <>
            <div className='w-100 my-4 d-flex flex-column align-items-center px-3'>
              <div className='Product-container d-flex justify-content-center gap-3' style={{ width: '95%' }}>
                <div className='Product image-product'>
                  <div className='image-holder p-3'>
                    <img className='Main-image' src={selectedProduct.url} alt={selectedProduct.title} />
                    <div className='Buttom-img'>
                      <img src={selectedProduct.url} alt={selectedProduct.title} />
                      <img src={selectedProduct.url} alt={selectedProduct.title} />
                      <img src={selectedProduct.url} alt={selectedProduct.title} />
                    </div>
                  </div>
                </div>
                <div className='Product details-product'>
                  <div className='details-holder p-3'>
                    <div className=' d-flex flex-column gap-3'>
                      <h1>{selectedProduct.title}</h1>
                      <h2>₹{selectedProduct.price}</h2>
                      <div className="Categories bg-white w-100 h-auto py-1 d-inline-flex align-items-center gap-2"><i class="fa-solid fa-circle-exclamation"></i><p>Order in <span className=' fw-bold'>02:30:25</span> to get next day delivery</p></div>
                      <span className=' w-100 fs-4 fw-bold w-75 d-flex justify-content-center align-items-center gap-3'>
                        <h3 className=' fw-bold'>Quantity:</h3><button onClick={() => setquantity(quantity - 1)}>-</button>{quantity}<button onClick={() => setquantity(quantity + 1)}>+</button>
                      </span>
                      <div className=' w-100 d-flex align-items-center gap-3'>
                        <button className='btn Cart-Button w-75 py-2' onClick={() => { handleCart(selectedProduct._id, selectedProduct.price, quantity, selectedProduct.title, isAuthenticated.userId, selectedProduct.description, selectedProduct.url, selectedProduct.rating, Heart) }}>Add to Cart</button><Link className=' w-25' to={quantity!==0&&`/${isAuthenticated?.userName+"Cart"}/${isAuthenticated?.userId}`}><button className='btn Cart-Button w-100 py-2' onClick={() => handleCart(selectedProduct._id, selectedProduct.price, quantity, selectedProduct.title, isAuthenticated.userId, selectedProduct.description, selectedProduct.url, selectedProduct.rating, Heart)}>Place Order</button></Link>
                        <span class={`material-symbols-outlined Product-icons heart ${Heart ? 'text-danger' : 'text-black'}`} onClick={() => PostUserLikedState(isAuthenticated.userId, selectedProduct._id, selectedProduct.title, selectedProduct.price, selectedProduct.description, selectedProduct.url, selectedProduct.categoryId, selectedProduct.rating, selectedProduct.ingredients, selectedProduct.features, selectedProduct.purchaseLink, !Heart && true, selectedProduct.comments)}>
                          favorite
                        </span>
                      </div>
                      <div className=' d-flex flex-column gap-3'>
                        <div className='div Description'>
                          <div className=' w-100 d-flex justify-content-between'><h4>Description & Ingredients</h4><span class="material-symbols-outlined Arrow" onClick={() => ShowBar()}>
                            keyboard_arrow_up
                          </span></div>
                          <div className='overflow-hidden'>
                            <div className={`cart-description ${Show ? 'show' : 'hide'}`}>
                              <span><b>Description:</b><p>{selectedProduct.description} </p></span>
                              <span><b>Ingredients:</b><p>{selectedProduct.ingredients} </p></span>
                            </div>
                          </div>
                        </div>
                        {/* <div className='div Shippings'>
                          <div className=' w-100 d-flex justify-content-between'><h4 className=' fw-bold'>Ingredients:</h4>
                            <span class="material-symbols-outlined Arrow">
                              keyboard_arrow_up
                            </span></div>
                             <p>{selectedProduct.ingredients} </p>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='' style={{ width: '99%' }}>
                <h2 className=' my-4'>Rating & Reviews</h2>
                <div className='Product-Rating-Review d-flex justify-content-between'>
                  <div className='User Rating'>
                    <div className='d-flex flex-column align-items-center' style={{ width: '40%' }}>
                      <div className=' d-flex align-items-end'><h1 className='Rating-value'>{Number(ProductAvgRating).toFixed(1)}</h1><span>/5</span></div>
                      <p>({UserProductReviews?.ProductId === selectedProduct?._id&&UserProductReviews?.User?.length||0} New Reviews)</p>
                    </div>
                    <div className='d-flex flex-column align-items-start gap-1' style={{ width: '60%' }}>
                      {[5, 4, 3, 2, 1].map((star) => (
                        <span key={star} className='starRating d-flex align-items-center gap-2'>
                          <i className="fa-solid fa-star" style={{ color: 'gold' }}></i>
                          {star}
                          <progress
                            value={ratingPercentages[star - 1]}
                            max="100"
                            disabled
                          />
                          <span>{ratingCounts[star - 1]}</span>
                        </span>
                      ))}


                    </div>
                  </div>

                  <div className='User Reviews'>
                    {UserProductReviews?.ProductId === selectedProduct?._id ? UserProductReviews.User.map(ProductReview => <div className=' d-flex flex-column gap-2'>
                      <div className=' d-flex align-items-center gap-2'><img src={ProductReview?.userImage} alt="loading" /><span className=' fs-4'>{ProductReview?.username}</span></div>
                      <div className=' d-flex align-items-center gap-2 mt-2'>{Array.from({ length: 5 }, (_, i) => (
                        <i key={i} class="fa-solid fa-star" style={{ color: i + 1 <= ProductReview?.ProductUserRating ? 'gold' : 'grey' }}></i>
                      ))}</div>
                      <p>{ProductReview.comment}</p>
                    </div>) : <div className=' d-flex flex-column gap-2'>
                      <div className=' d-flex align-items-center gap-2'><img src={selectedProductReview[0]?.image} alt="loading" /><span className=' fs-4'>{selectedProductReview[0]?.name ? selectedProductReview[0]?.name : 'Bot'}</span></div>
                      <div className=' d-flex align-items-center gap-2 mt-2'>{Array.from({ length: selectedProductReview[0]?.rating ? selectedProductReview[0]?.rating : 5 }, (_, i) => (
                        <i key={i} class="fa-solid fa-star"></i>
                      ))}</div>
                      <p>{selectedProductReview[0]?.review ? selectedProductReview[0]?.review : `${selectedProduct?.title} is very good!`}</p>
                    </div>}
                    <div className=' d-flex align-items-center gap-2 my-2'><button className=' rounded-circle bg-white d-flex justify-content-center align-items-center' onClick={() => { handleEditcomment(); setRating(0) }} style={{ width: '40px', height: '40px', border: '1px solid black', boxShadow: 'none' }}><span>+</span></button>Comments</div>
                    <div className=' d-flex flex-column overflow-hidden' style={{ height: Editcomment ? '100%' : '0px' }}>
                      <div className='d-flex gap-2'>
                        Select Rating:
                        {[1, 2, 3, 4, 5].map((star, index) => (
                          <i
                            key={index}
                            className="fa-solid fa-star"
                            style={{ color: star <= Rating ? 'gold' : 'grey', cursor: 'pointer' }}
                            onClick={() => setRating(star)}
                          ></i>
                        ))}
                      </div>

                      <textarea className=' my-2' rows={4} cols={5} value={comment} onChange={(e) => setcomment(e.target.value)} />
                      <button onClick={() => { UpdateProduct(selectedProduct._id, isAuthenticated.userId, "nothing", isAuthenticated.userName, Rating, comment); setcomment(''); setEditcomment(false) }}>Send</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </>}


      </div>

      {items.length === 0 &&
        <>
          <div className='Extra-products-container' style={{ color: 'var(--Background-white-text)' }}>
            <div className='Extra-products' id='suggestItems'>
              <h1 className=' text-center my-4'>You might also like</h1>
              <div className='scroll-items py-3 gap-3 bg-dark-subtle rounded-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', maxHeight: small ? '550px' : 'fit-content' }}>
                {suggestedproducts && suggestedproducts.length > 0 ? (
                  <>
                    {suggestedproducts.map((e) => (
                      id !== e._id && (
                        <ProductCard isAuthenticated={isAuthenticated} e={e} Navigate={Navigate} />
                      )
                    ))}
                    <ViewMore />
                  </>
                ) : (
                  <EmptyProductCard />
                )}

              </div>
            </div>

          </div>
        </>}

      {items.length > 0 &&
        <div>
          <div className='scroll-items py-3 gap-3 bg-dark-subtle rounded-3 mt-4' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', maxHeight: small ? '550px' : 'fit-content' }}>
            {items.length > 0 ?
              items.map((e) => (
                e._id !== id ? (
                  <>
                    <ProductCard isAuthenticated={isAuthenticated} e={e} Navigate={Navigate} />
                  </>) : <div className=' text-center'>Already Selected Item {selectedProduct?.title} {items.length === 1 && <b>Or No more Item Match Your search</b>}</div>
              ))
              :
              <>
                <EmptyProductCard />
              </>

            }
          </div>
        </div>
      }
      <Footer />
    </>
  );
}

export default ProductItem;
