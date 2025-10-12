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
        const LikedProducts = UserLikedState?.filter(Product=>Product.likedState===true)
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
        <div className='Extra-products-container py-3 d-flex flex-column gap-5' style={{marginTop:'75px'}}>
            <h1 className={`fw-bold text-center ${Theme?'text-white':'text-black'}`}>Wishlist</h1>
                <div className='Extra-products'>
                 <div className="scroll-items" style={{ justifyContent: small && 'space-around', flexWrap: small && 'wrap' }}>
                {LikedProducts?.length>0?LikedProducts.map(e=>(
                   <ProductCard key={e._id} isAuthenticated={isAuthenticated} LikedState={UserLikedState} Navigate={Navigate} e={e} />
                )) : (
                    <EmptyProductCard/>
                )}
            </div>
            </div>
            {(LikedProducts&&LikedProducts?.length>0)&&<center><button className="Save-cart-btn-CartDetails" onClick={()=>PostSaveCart(LikedProducts,null)}>Move to Cart</button></center>}
            </div>
            <Footer/>
            </>
    )
}
export default Wishlist;