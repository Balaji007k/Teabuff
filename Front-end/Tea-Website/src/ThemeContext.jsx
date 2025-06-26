import LoadingPage from './components/AssetComponents/LoadingPage';
import ApiService from './components/Service/ApiService/product-api';
import { createContext, useState, useContext, useEffect } from "react";

//  Create the context
const ThemeContext = createContext();

//  reate the provider
export const ThemeProvider = ({ children }) => {
    const [Review, setReview] = useState([]);
    const [cart, setUpdatedCart] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(null);
    const [image, setImage] = useState([]);
    const [productsItem, setProductsItem] = useState([]);
    const [category, setCategory] = useState([]);
    const [UserProductReviews, setUserProductReviews] = useState([]);
    const [ProductAvgRating, setProductAvgRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [UserLikedState, setUserLikedState] = useState(null);
    const [UpdatedProduct, setUpdatedProduct] = useState(null);

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
        //console.log(cart)
            if (cart?.items?.length <= 0) return alert('No items in Cart');
            const userId = isAuthenticated?.userId;
    
            if (!userId) {
                alert("User not authenticated");
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
                    Product_Url: item.url,
                    Rating: item.rating,
                    Description: item.description
                }))
                }
            }
    
            try {
                const response = await fetch(`http://localhost:5000/carts/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
    
                const data = await response.json();
                alert(data.message);
                setUpdatedCart(data?.UpdatedCart)
            } catch (err) {
                console.error("Error saving cart:", err);
                alert("Failed to save cart.");
            }
        };

    const fetchUserLikedState = async (UserId) => {
        const { Result, Error } = await ApiService.fetchData(`/users/State/${UserId}`);
        if (Result){
            setUserLikedState(Result?.UserState)
        }
        else console.log(Error);
    };

    const PostUserLikedState = async (UserId,ProductId,title, price, description, url, categoryId, rating, ingredients, features, purchaseLink,likedState) => {
        const NewUserState = {ProductId,title, price, description, url, categoryId, rating, ingredients, features, purchaseLink,likedState};
        const { Result, Error } = await ApiService.fetchData(`/users/State/${UserId}`,"POST",NewUserState);
        if (Result){
            setUserLikedState(Result.NewState?.UserState)
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

    const UpdateProduct = async (Id,UserId,userImage,username,ProductUserRating,comment) => {
        if(comment!==''){
        const NewComment = {UserId,userImage,username,ProductUserRating,comment}
        const { Result, Error } = await ApiService.fetchData(`/product/${Id}`,"PUT",NewComment);
        if (Result){
            console.log(Result.avgRating,Result.updatedProduct)
            setUserProductReviews(Result.updatedProduct.comments[0])
            setProductAvgRating(Result.avgRating)
            setUpdatedProduct(Result.updatedProduct)
        }
        else console.log(Error);
    }
    };

    const fetchCategories = async () => {
        const { Result, Error } = await ApiService.fetchData('/category');
        if (!Error) setCategory(Result?.categorys);
        else console.error(Error);
    };

    const handleCart = (productId, itemPrice, quantity, itemName, userId, Description, Product_Url, Rating, likes) => {
        if (quantity === 0) return alert("Minimum select one item")
    
        const newCart = { userId, productId, itemPrice, quantity, itemName, Product_Url, Rating, Description, likes }
    
        ApiService.fetchData('/carts', "POST", newCart)
          .then(({ Result,Error }) => {
            if (Error) {
              alert("Login failed: " + Error);
              return;
            }
            if (quantity !== 0) {
                console.log(Result)
              alert("Cart successfully Added")
              setUpdatedCart(Result?.usercart);
            }
          })
          .catch(err => console.log(err));
      }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/dashboard', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await res.json();
                
                if (data.userId) {
                    setAuthenticated(data);
                    await fetchCart(data.userId);
                    await fetchUserLikedState(data.userId)
                    fetchProductReviews()
                    console.log("User is authenticated:", data.userId);
                } else {
                    console.log("Not authenticated");
                }
                await Promise.all([
                    fetchReviews(),
                    fetchShops(),
                    fetchProducts(),
                    fetchCategories()
                ]);

            } catch (err) {
                console.log("'Not authenticated'",err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if(isLoading)return(
        <LoadingPage/>
    )

    if (!isAuthenticated) return !isLoading && (
        <ThemeContext.Provider value={{ Review, image, productsItem, category }}>
            {children}
        </ThemeContext.Provider>
    );

    if (isAuthenticated) return !isLoading && (
        <ThemeContext.Provider value={{ isAuthenticated, Review, image, productsItem, category, cart, handleCart, setUpdatedCart, PostSaveCart, PostUserLikedState, UserLikedState, UpdateProduct, UserProductReviews, fetchProductReviews, ProductAvgRating, UpdatedProduct }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
