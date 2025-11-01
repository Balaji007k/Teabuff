import LoadingPage from './components/AssetComponents/LoadingPage';
import ApiService from './components/Service/ApiService/product-api';
import { createContext, useState, useContext, useEffect, useMemo } from "react";

//  Create the context
const ThemeContext = createContext();

//  reate the provider
export const ThemeProvider = ({ children }) => {
  const [Theme,setTheme] = useState(false);
    const [Review, setReview] = useState([]);
    const [AllReview, setAllReview] = useState([]);
    const [cart, setUpdatedCart] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(null);
    const [image, setImage] = useState([]);
    const [productsItem, setProductsItem] = useState([]);
    const [category, setCategory] = useState([]);
    const [UserProductReviews, setUserProductReviews] = useState([]);
    const [ProductAvgRating, setProductAvgRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [UserLikedState, setUserLikedState] = useState(null);
    const [Heart,setCurrentProductState] = useState(null);
    const [UpdatedProduct, setUpdatedProduct] = useState(null);
    const [AlertMessageTheme,setAlertMessage] = useState(null);
    const [OrderId,setOrderId] = useState(null);

    const fetchAllReviews = async () => {
        const { Result, Error } = await ApiService.fetchData('/allreviews');
        if (!Error) setAllReview(Result?.reviews);
        else console.error(Error);
    };

    const fetchReviews = async () => {
        const { Result, Error } = await ApiService.fetchData('/reviews');
        if (!Error) setReview(Result?.reviews);
        else console.error(Error);
    };

    const fetchCart = async (user) => {
        const { Result, Error } = await ApiService.fetchData(`/carts/${user}`);
        if (!Error) {setUpdatedCart(Result?.userIdcart);
        }
        else console.error(Error);
    };

    const PostSaveCart = async (cart,quantity) => {
            if (cart?.items?.length <= 0) return alert('No items in Cart');
            const userId = isAuthenticated?.userId;
    
            if (!userId) {
                setAlertMessage({message:"User not authenticated",state:false});
                return;
            }
            var payload;
            if(cart?.items){
            payload = {
                items: cart.items.map(item => ({
                    productId: item.productId,
                    itemName: item.itemName,
                    itemPrice: item.itemPrice,
                    quantity: quantity[item.productId] ?? item.quantity,
                    categoryId: item.categoryId,
                    Product_Url: item.Product_Url,
                    Rating: item.Rating,
                    Description: item.Description
                }))
            };
        }
            else{
                payload ={
                    items: cart?.map(item => ({
                    productId: item.ProductId,
                    itemName: item.title,
                    itemPrice: item.price,
                    quantity: quantity,
                    categoryId: item.categoryId,
                    Product_Url: item.url,
                    Rating: item.rating,
                    Description: item.description
                }))
                }
            }

        try {
        const { Result, Error } = await ApiService.fetchData(`/carts/${userId}`,"PUT",payload);
                setAlertMessage({message:Result.message,state:true});
                setUpdatedCart(Result?.UpdatedCart)
                if(Error) console.log(Error);
        } catch (error) {
            console.error("Error saving cart:", err);
                alert("Failed to save cart.");
        }
        };

    const fetchUserLikedState = async (UserId) => {
        const { Result, Error } = await ApiService.fetchData(`/user/State/${UserId}`);
        if (Result){
            setUserLikedState(Result?.UserState);
        }
        else console.log(Error);
    };

    const PostUserLikedState = async (UserId,ProductId,likedState) => {
        const NewUserState = {ProductId,likedState};
        const { Result, Error } = await ApiService.fetchData(`/users/State/${UserId}`,"POST",NewUserState);
        if (Result){
            setUserLikedState(Result.allStates||Result.newUser);
            setCurrentProductState(Result.productState?.likedState);
        }
        else console.log(Error);
    };

    const fetchShops = async () => {
        const { Result, Error } = await ApiService.fetchData('/shops');
        if (Result) setImage(Result?.shops);
        else console.log(Error);
    };

    const fetchProducts = async () => {
        const { Result, Error } = await ApiService.fetchData('/products');
        if (Result) setProductsItem(Result?.products);
        else console.log(Error);
    };

    const fetchProductReviews = async (id) => {
        if(id){
        const { Result, Error } = await ApiService.fetchData(`/products/Reviews/${id}`);
        if (!Error) {
            setUserProductReviews(Result?.Comments);
            setProductAvgRating(Result?.avgRating);
        }
        else console.error(Error);
        }
    };

    // const UpdateProduct = async (Id,UserId,userImage,username,ProductUserRating,comment) => {
    //     if(comment!==''){
    //     const NewComment = {UserId,userImage,username,ProductUserRating,comment}
    //     const { Result, Error } = await ApiService.fetchData(`/product/${Id}`,"PUT",NewComment);
    //     if (Result){
    //         setUserProductReviews(Result.updatedProduct.comments[0]);
    //         setProductAvgRating(Result.avgRating);
    //         setUpdatedProduct(Result.updatedProduct);
    //     }
    //     else console.log(Error);
    // }
    // };

    const UpdateProduct = async (Id, UserId, userImage, username, ProductUserRating, comment) => {
  if (comment !== '') {
    const NewComment = { UserId, userImage, username, ProductUserRating, comment };

    try {
      const { Result, Error } = await ApiService.fetchData(`/product/${Id}`, "PUT", NewComment);

      if (Result) {
        // Update local states
        setUserProductReviews(Result.updatedProduct.comments[0]);
        setProductAvgRating(Result.avgRating);
        setUpdatedProduct(Result.updatedProduct);

        // Update AllReview state
        const newReview = {
          Comments: Result.updatedProduct.comments[0],
          avgRating: Result.avgRating
        };

        setAllReview(prevReviews => {
          return prevReviews.map(product => {
            // If this is the same product
            if (product.comments.some(c => c.ProductId === Id)) {
              const updatedComments = product.comments.map(commentItem => 
                commentItem.ProductId === Id ? { ...commentItem, ...newReview.Comments } : commentItem
              );
              return { ...product, comments: updatedComments };
            } else {
              // If this product has no comments yet, append the new comment
              return product;
            }
          });
        });

      } else {
        console.log(Error);
      }
    } catch (err) {
      console.error(err);
    }
  }
};


    const fetchCategories = async () => {
        const { Result, Error } = await ApiService.fetchData('/category');
        if (!Error) setCategory(Result?.categories);
        else console.error(Error);
    };


     const handleCart = (productId, itemPrice, quantity, itemName, categoryId, userId, Description, Product_Url, Rating, likes, placeOrder=false) => {

  const newCart = { userId, productId, itemPrice, quantity, itemName, categoryId, Product_Url, Rating, Description, likes };
  if (quantity === 0&&!placeOrder) {
        setAlertMessage({ message: "Minimum select one item", state: false });
    return ;
  }
  else if(cart?.items.length&&quantity==0&&placeOrder){
    return false;
}
else if ((quantity>=0&&placeOrder&&!cart)||(placeOrder&&quantity!==0&&cart?.items.length)){
    ApiService.fetchData('/carts', "POST", newCart)
    .then(({ Result, Error }) => {
      if (Error) {
        setAlertMessage({ message: "Login failed: " + Error, state: false });
        return ;
      }
      setAlertMessage({ message: "Cart successfully added", state: true });
    //   console.log("theme",Result)
      setUpdatedCart(Result?.cart || Result?.usercart);
      //setFastPlaceOrder({cart:Result?.newItem,state:true});
    })
    .catch(err => console.log(err));
    return true;
}
else if(placeOrder&&quantity==0&&!cart){
    setAlertMessage({ message: "Minimum select one item", state: false });
    return false;
}
else{
    ApiService.fetchData('/carts', "POST", newCart)
    .then(({ Result, Error }) => {
      if (Error) {
        setAlertMessage({ message: "Login failed: " + Error, state: false });
        return ;
      }
      setAlertMessage({ message: "Cart successfully added", state: true });
        setUpdatedCart(Result?.cart || Result?.usercart);
    })
    .catch(err=>console.log(err));
    return false;
    }
};


// Create new order (POST)
const createOrder = async(orderData)=> {

  const { Result, Error } = await ApiService.fetchData('/orders',"POST",orderData);
  if(Result) {
    // console.log(Result?.newOrder);
    setOrderId(Result?.newOrder);
    return true};
  if(Error)console.log(Error);
}

    useEffect(() => {
  const fetchData = async () => {
    try {
      const { Result } = await ApiService.fetchData('/dashboard');
      if (Result.userId) {
        setAuthenticated(Result);
        await fetchCart(Result.userId);
        await fetchUserLikedState(Result.userId);
      }
    } catch (err) {
      console.log("'Not authenticated'", err);
    } finally {
      setIsLoading(false);
      await Promise.all([
        fetchAllReviews(),
        fetchReviews(),
        fetchShops(),
        fetchProducts(),
        fetchCategories()
      ]);
    }
  };
  fetchData();
}, []);


const contextValue = useMemo(() => {
  return {isAuthenticated,
    Theme,
    setTheme,
  AllReview,
  Review,
  image,
  productsItem,
  category,
  cart,
  handleCart,
  setUpdatedCart,
  PostSaveCart,
  PostUserLikedState,
  Heart,
  setCurrentProductState,
  UserLikedState,
  UpdateProduct,
  UserProductReviews,
  fetchProductReviews,
  ProductAvgRating,
  UpdatedProduct,
  AlertMessageTheme,
  createOrder,
  OrderId}
}, [
  isAuthenticated,
  Theme,
  AllReview,
  Review,
  image,
  productsItem,
  category,
  cart,
  UserLikedState,
  UserProductReviews,
  ProductAvgRating,
  UpdatedProduct,
  AlertMessageTheme,
  OrderId
]);




  useEffect(() => {
  if (AlertMessageTheme?.message) {
    // console.log(AlertMessageTheme)
    const timer = setTimeout(() => setAlertMessage(""), 1500);
    return () => clearTimeout(timer);
  }
}, [AlertMessageTheme]);

    if(isLoading)return(
        <LoadingPage Home={true}/>
    )

    if (!isAuthenticated) return !isLoading && (
        <ThemeContext.Provider value={{ AllReview, Review, image, productsItem, category }}>
            {children}
        </ThemeContext.Provider>
    );

    // if (isAuthenticated) return !isLoading && (
    //     <ThemeContext.Provider value={{ isAuthenticated, AllReview, Review, image, productsItem, category, cart, handleCart, setUpdatedCart, PostSaveCart, PostUserLikedState, UserLikedState, UpdateProduct, UserProductReviews, fetchProductReviews, ProductAvgRating, UpdatedProduct, AlertMessageTheme, createOrder, OrderId}}>
    //         {children}
    //     </ThemeContext.Provider>
    // );

    if (isAuthenticated) return !isLoading && (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );

};

export const useTheme = () => useContext(ThemeContext);
