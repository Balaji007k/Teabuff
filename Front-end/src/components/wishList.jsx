import { useEffect, useState } from "react"
import ProductCard from "./AssetComponents/ProductCard";
import { useTheme } from "../ThemeContext";
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import Footer from "./footer";
import EmptyProductCard from "./AssetComponents/EmptyProductCard";
import PageNotFound from "./AssetComponents/PageNotFound";

function Wishlist({ isAuthenticated }) {
    const {UserLikedState,PostSaveCart} = useTheme();
    const Navigate = useNavigate();
    const small = useMediaQuery({ maxWidth:600 });
    const [LikedProducts,setLikedProducts] = useState();

    useEffect(()=>{
        const LikedProducts = UserLikedState?.filter(Product=>Product.likedState===true)
        setLikedProducts(LikedProducts)
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
        <div className='Extra-products-container py-3' style={{marginTop:'75px'}}>
            <h1 className=" fw-bold text-center">Wishlist</h1>
                <div className='Extra-products'>
                 <div className="scroll-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', gap: '20px', maxHeight: small ? '100%' : 'auto' }}>
                {LikedProducts?.length>0?LikedProducts.map(e=>(
                   <ProductCard isAuthenticated={isAuthenticated} LikedState={UserLikedState} Navigate={Navigate} e={e} />
                )) : (
                    <EmptyProductCard/>
                )}
            </div>
            </div>
            <center><button className=" px-2 my-4 rounded-2" onClick={()=>PostSaveCart(LikedProducts,null)}>Move to Cart</button></center>
            </div>
            <Footer/>
            </>
    )
}
export default Wishlist;