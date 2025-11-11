import { useEffect, useState } from "react"
import ProductCard from "./AssetComponents/ProductCard";
import { useTheme } from "../ThemeContext";
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import Footer from "./footer";
import EmptyProductCard from "./AssetComponents/EmptyProductCard";
import PageNotFound from "./AssetComponents/PageNotFound";
import AlertMessage from "./AssetComponents/AlertMessage";

function Wishlist({ isAuthenticated }) {
    const {UserLikedState,PostSaveCart,AlertMessageTheme,Theme} = useTheme();
    const Navigate = useNavigate();
    const small = useMediaQuery({ maxWidth:600 });
    const [LikedProducts,setLikedProducts] = useState();

    useEffect(()=>{
        // Filter products and ensure they have the correct structure
        const LikedProducts = UserLikedState?.filter(product => product.likedState === true)
            ?.map(product => ({
                ProductId: product.ProductId,
                likedState: product.likedState,
                productDetails: product.productDetails || product
            }));
        setLikedProducts(LikedProducts);
    },[UserLikedState])

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])

    if(!isAuthenticated) { 
    setTimeout(()=>{
        Navigate('/Login')
    },3000)
    return <PageNotFound Message={"WishList"}/>
    }

    return(
        <>
        {AlertMessageTheme&&AlertMessageTheme?.message&&<AlertMessage message={AlertMessageTheme}/>}
        <div className='Extra-products-container py-3 d-flex flex-column gap-4' style={{marginTop:'75px',marginBottom:'75px'}}>
            <h1 className={`fw-bold text-center ${Theme?'text-white':'text-black'}`}>Wishlist</h1>
                <div className='Extra-products'>
                 <div className="scroll-items d-grid" style={{ justifyContent: small && 'space-around', flexWrap: small && 'wrap' }}>
                {LikedProducts?.length>0 ? LikedProducts.map(product => (
                   <ProductCard 
                     key={product.productDetails?._id} 
                     isAuthenticated={isAuthenticated} 
                     LikedState={UserLikedState} 
                     Navigate={Navigate} 
                     product={product}  // This now contains {ProductId, likedState, productDetails}
                   />
                )) : (
                    <EmptyProductCard/>
                )}
            </div>
            </div>
            </div>
            {(LikedProducts&&LikedProducts?.length>0)&&<div className="w-100 d-flex justify-content-center bg-white py-2 position-fixed bottom-0 z-2"><button className="Save-cart-btn-CartDetails" onClick={()=>PostSaveCart(LikedProducts,null)}>Move to Cart</button></div>}
            </>
    )
}
export default Wishlist;