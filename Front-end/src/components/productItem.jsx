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
import AlertMessage from './AssetComponents/AlertMessage';
import LoadingPage from './AssetComponents/LoadingPage';
import ApiService from './Service/ApiService/product-api';

function ProductItem({ isAuthenticated, Review, productsItem, cart, AlertMessageMain }) {

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
  const [items, setProducts] = useState(null);
  const [Show, setShow] = useState(true);
  const [Rating, setRating] = useState(0);
  const [comment, setcomment] = useState('');
  const [Editcomment, setEditcomment] = useState(false);
  const Navigate = useNavigate();
  const [Heart, setHeart] = useState(false);
  const [Loading,setLoading] = useState(true);
  const [SearchItem, setSearchItem] = useState("");
  const [AdditionalImages,setAdditionalImages] = useState(true);

  const ShowBar = () => {
    setShow(prev => !prev)
  }

  const handleEditcomment = () => {
    setEditcomment(prev => !prev)
  }

  const Products = (Products) => {
    setProducts(Products);
  }

  const [expanded, setExpanded] = useState({}); // object to track each review state

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle only this review
    }));
  };

  const PlaceOrder=(productId, itemPrice, quantity, itemName, categoryId, userId, Description, Product_Url, Rating, likes, placeOrder)=>{
    const Relocate = handleCart(productId, itemPrice, quantity, itemName, categoryId, userId, Description, Product_Url, Rating, likes, placeOrder);
    if (Relocate) Navigate(`/CheckOut/${productId}`);
    else Navigate(`/CheckOut`);
  };

  useEffect(()=>{
    if(AlertMessageMain&&AlertMessageMain.message) return setLoading(false);
  },[AlertMessageMain]);

  useEffect(() => {
    if(isAuthenticated){
      fetchProductReviews(id);
    }
    if (isAuthenticated && UserLikedState) {
      const User = UserLikedState.find(u => u?.ProductId === id);
      setHeart(!!User?.likedState); // Set to true or false accordingly
    }
  }, [UserLikedState, id]);

  const fetchProduct = async () => {
        const { Result, Error } = await ApiService.fetchData(`/product/${id}`);
        if(!Error) {
          setLoading(false);
        }
        setSelectedProduct(Result?.product);
        if (Result&&productsItem&&productsItem.length) {
          setLoading(false);
          const Filtered = Review.filter(reviews => reviews.review.toLowerCase().replace(/\s+/g, '').includes(Result?.product?.title.toLowerCase().replace(/\s+/g, '')))
          setselectedProductReview(Filtered);
          const filtedCategory = productsItem.filter(group => group.categoryId === Result?.product?.categoryId)
          setSuggestedProducts(filtedCategory);
        }
        if (cart && Result) {
          const productQuantity = cart.items.find(item => item.productId === Result?.product?._id)
          if (productQuantity?.quantity) {
            setquantity(productQuantity?.quantity);
          }
          else {
            setquantity(0);
          }
        }
    };

    // , Review, cart, productsItem, id, Location.pathname

  useEffect(() => {
    if(id&&isAuthenticated) setAdditionalImages(true);
    if (isAuthenticated) {
      fetchProduct();
      // if (productsItem?.length > 0 && id) {
      //   const found = productsItem.find(item => item._id === id);
      //   setSelectedProduct(found);
      //   //console.log(found)
        
      // }
    }
  }, [isAuthenticated,id,productsItem]);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[isAuthenticated,id]);

  useEffect(() => {
  if (quantity < 0) setquantity(0);
}, [quantity]);


  if (!isAuthenticated) {
    setTimeout(() => {
      Navigate('/Login');
    }, 3000);
    return <PageNotFound Message={"Product"} />
  };

  if (isAuthenticated&&Loading){
    return <LoadingPage/>
  }
  if (!selectedProduct) return <div className='Cart-holder fs-5 fw-bolder text-center'>No product Found.</div>;

  if (isAuthenticated && selectedProduct) return (
    <>
    {AlertMessageMain&&AlertMessageMain.message&&<AlertMessage message={AlertMessageMain}/>}
      <div className='Product-Page-cart d-flex flex-column align-items-center' style={{ marginTop: '75px', color: 'var(--Background-white-text)' }}>
        <ProductFilters Products={Products} id={id} searchingProduct={setSearchItem}/>

        {(!items||items.length === 0)&&
          <>
            <div className='w-100 my-4 d-flex flex-column align-items-center px-3'>
              <div className='Product-container d-flex justify-content-center gap-3' style={{ width: '95%' }}>
                <div className='Product image-product'>
                  <div className='image-holder p-3'>
                    <img className='Main-image' src={selectedProduct.url} alt={selectedProduct.title} onClick={()=>{setAdditionalImages(prev=>!prev)}}/>
                    {AdditionalImages&&<div className='Buttom-img'>
                      {Array.from({length:3},(_,i)=>(
                        <img key={i} src={selectedProduct.url} alt={selectedProduct.title} />
                      ))}
                    </div>}
                  </div>
                </div>
                <div className='Product details-product'>
                  <div className='details-holder p-3'>
                    <div className=' d-flex flex-column gap-3'>
                      <h1>{selectedProduct.title}</h1>
                      <h2>{selectedProduct.categoryId==1?<>₹<del>{(selectedProduct.price).toFixed(2)}</del> ₹{(selectedProduct.price/2).toFixed(2)}</>:<>₹{(selectedProduct.price).toFixed(2)}</>}</h2>
                      <div className="Categories bg-white w-100 h-auto py-1 d-inline-flex align-items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i><p>Order in <span className=' fw-bold'>{new Date().toLocaleDateString()}</span> to get next day delivery <span className=' fw-bold'>{new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span></p></div>
                      <span className=' w-100 fs-4 fw-bold w-75 d-flex justify-content-center align-items-center gap-3'>
                        <h3 className=' fw-bold'>Quantity:</h3>{quantity==0?<button className=' bg-body-secondary'>-</button>:<button onClick={() => setquantity(quantity - 1)}>-</button>}{quantity}<button onClick={() => setquantity(quantity + 1)}>+</button>
                      </span>
                      <div className=' w-100 d-flex align-items-center justify-content-between gap-2'>
                        <button className={`btn Cart-Button ${!small&&'w-50'} flex-grow-1 py-2`} onClick={() => { handleCart(selectedProduct._id, selectedProduct.price, quantity, selectedProduct.title, selectedProduct.categoryId, isAuthenticated.userId, selectedProduct.description, selectedProduct.url, selectedProduct.rating, Heart, false) ;setLoading(true)}}>Add to Cart</button>{cart?.items.length||quantity!==0?<button className={`btn Cart-Button ${!small&&'w-50'} py-2`} onClick={() => {PlaceOrder(selectedProduct._id, selectedProduct.price, quantity, selectedProduct.title, selectedProduct.categoryId, isAuthenticated.userId, selectedProduct.description, selectedProduct.url, selectedProduct.rating, Heart, true);setLoading(true)}}>Buy Now</button>:<button className=' bg-body-secondary'></button>}
                        {/* <span className={`material-symbols-outlined Product-icons heart ${Heart ? 'text-danger' : 'text-black'}`} onClick={() => PostUserLikedState(isAuthenticated.userId, selectedProduct._id, selectedProduct.title, selectedProduct.price, selectedProduct.description, selectedProduct.url, selectedProduct.categoryId, selectedProduct.rating, selectedProduct.ingredients, selectedProduct.features, selectedProduct.purchaseLink, !Heart && true, selectedProduct.comments)}>
                          favorite
                        </span> */}
                        <i className={`fa-solid fa-heart Product-icons heart ${Heart ? 'text-danger' : 'text-black'} fs-4`} onClick={() => PostUserLikedState(isAuthenticated.userId, selectedProduct._id, selectedProduct.title, selectedProduct.price, selectedProduct.description, selectedProduct.url, selectedProduct.categoryId, selectedProduct.rating, selectedProduct.ingredients, selectedProduct.features, selectedProduct.purchaseLink, !Heart && true, selectedProduct.comments)} ></i>
                      </div>
                      <div className=' d-flex flex-column gap-3'>
                        <div className='div Description'>
                          <div className=' w-100 d-flex justify-content-between'><h4>Description & Ingredients</h4><span className="material-symbols-outlined Arrow" onClick={() => ShowBar()}>
                            keyboard_arrow_up
                          </span></div>
                          <div className='overflow-hidden'>
                            <div className={`cart-description ${Show ? 'show' : 'hide'}`}>
                              <span><b>Description:</b><p>{selectedProduct.description} </p></span>
                              <span><b>Ingredients:</b><p>{selectedProduct.ingredients} </p></span>
                            </div>
                          </div>
                        </div>
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
                      <div className=' d-flex align-items-end'><span className='Rating-value'>{Number(ProductAvgRating).toFixed(1)}</span><span>/5</span></div>
                      <p>( <b className=' opacity-75'>{UserProductReviews?.ProductId === selectedProduct?._id&&UserProductReviews?.User?.length||0}</b> {UserProductReviews?.User?.length>1?'Reviews':'Review'} )</p>
                    </div>
                    <div className='d-flex flex-column align-items-start gap-2' style={{ width: '60%' }}>
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
                    <div className='Comment-box d-flex flex-column gap-2'>
                    {UserProductReviews?.ProductId === selectedProduct?._id ? UserProductReviews.User.map(ProductReview => <div key={ProductReview._id} className=' d-flex flex-column gap-2'>
                      <div className=' d-flex align-items-center gap-2'><img src={`${ApiService.Backend+ProductReview?.userImage}`} alt="loading" 
                      onError={(e) => {
    e.currentTarget.onerror = null; // avoid infinite loop
    e.currentTarget.src = "assets/user.png"; // fallback if image not found
  }} />
  <span className=' fs-4'>{ProductReview?.username}</span></div>
                      <div className=' d-flex align-items-center gap-2 mt-1'>{Array.from({ length: 5 }, (_, i) => (
                        <i key={i} className="fa-solid fa-star" style={{ color: i + 1 <= ProductReview?.ProductUserRating ? 'gold' : 'grey' }}></i>
                      ))}</div>
                      <div><p className={`${expanded[ProductReview._id]?'show':'hide'}`}>{ProductReview.comment}</p><span className=' fw-bold opacity-75' style={{cursor:'pointer'}} onClick={() => toggleReadMore(ProductReview._id)}>{!expanded[ProductReview._id] ? "Readmore" : "Readless..."}</span></div>
                    </div>) : <div className=' d-flex flex-column gap-2'>
                      <div className=' d-flex align-items-center gap-2'><img src={selectedProductReview[0]?.image} alt="loading" /><span className=' fs-4'>{selectedProductReview[0]?.name ? selectedProductReview[0]?.name : 'Bot'}</span></div>
                      <div className=' d-flex align-items-center gap-2 mt-2'>{Array.from({ length: selectedProductReview[0]?.rating ? selectedProductReview[0]?.rating : 5 }, (_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}</div>
                      <p>{selectedProductReview[0]?.review ? selectedProductReview[0]?.review : `${selectedProduct?.title} is very good!`}</p>
                    </div>}
                    </div>
                    <div className=' d-flex align-items-center gap-2 my-2'><button className=' rounded-circle bg-white d-flex justify-content-center align-items-center' onClick={() => { handleEditcomment(); setRating(0) }} style={{ width: '40px', height: '40px', border: '1px solid black', boxShadow: 'none' }}><span>+</span></button>Comments</div>
                    <div className=' d-flex flex-column overflow-hidden' style={{ height: !Editcomment && '0px' }}>
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
                      <button onClick={() => { UpdateProduct(selectedProduct._id, isAuthenticated.userId, "", isAuthenticated.userName, Rating, comment); setcomment(''); setEditcomment(false) }}>Send</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </>}


      </div>

      {(!items||items.length === 0)&&
        <>
          <div className='Extra-products-container' style={{ color: 'var(--Background-white-text)' }}>
            <div className='Extra-products' id='suggestItems'>
              <h1 className=' text-center my-4'>You might also like</h1>
              <div className='scroll-items py-3 gap-3 bg-dark-subtle rounded-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', maxHeight: small ? '550px' : 'fit-content' }}>
                {suggestedproducts && suggestedproducts.length > 0 ? (
                  <>
                    {suggestedproducts.map((e) => (
                      id !== e._id && (
                        <ProductCard key={e._id} isAuthenticated={isAuthenticated} e={e} Navigate={Navigate} />
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
          
            {items&&items.length > 0 ?
            <div className='scroll-items py-3 gap-3 bg-dark-subtle rounded-3 mt-4' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', maxHeight: small ? '550px' : 'fit-content' }}>
               {items.map((e) => (
                 e._id !== id ? (
                    <ProductCard key={e._id} isAuthenticated={isAuthenticated} e={e} Navigate={Navigate} />
                   ) : <div key={e._id} className=' text-center'>Already Selected Item {selectedProduct?.title} {items.length === 1 && <b>Or No more Item Match Your search</b>}</div>
               ))}
                          </div>
              :SearchItem!==""&&items?.length==0&&
                <div className='scroll-items py-3 gap-3 bg-dark-subtle rounded-3 mt-4' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', maxHeight: small ? '550px' : 'fit-content' }}>
                  <EmptyProductCard />
                  </div>
            }
      <Footer />
    </>
  );
}

export default ProductItem;
