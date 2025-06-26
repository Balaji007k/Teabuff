import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import ProductCard from "./AssetComponents/ProductCard";
import Footer from "./footer";
import EmptyProductCard from "./AssetComponents/EmptyProductCard";
import ProductFilters from "./AssetComponents/ProductFilters";

function Menu({ isAuthenticated }) {
    const { productsItem, category } = useTheme();
    const Location = useLocation();
    const Navigate = useNavigate();
    const [items, setProducts] = useState([]);

    const Products = (Products) => {
        setProducts(Products)
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className=" w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '75px' }}>
            <div className=" w-100 h-100 inner-Menu d-flex flex-column">


                <ProductFilters productsItem={productsItem} category={category} Products={Products} />

                <h1 className=" fw-bold text-center">Menu</h1>

                <div className='Extra-products-container py-3'>
                    <div className='Extra-products'>
                        <div className="scroll-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', justifyItems: 'center', gap: '20px', maxHeight:'100%'}}>
                            {items.length > 0 ? items.map((e) => (
                                <ProductCard isAuthenticated={isAuthenticated} e={e} Navigate={Navigate} />
                            )) : (
                                <EmptyProductCard />
                            )
                            }
                        </div>
                    </div>
                </div>


            </div>
            <Footer />
        </div>
    )
}

export default Menu;