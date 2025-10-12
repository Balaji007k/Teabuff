// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import ProductCard from "./AssetComponents/ProductCard";
// import Footer from "./footer";
// import EmptyProductCard from "./AssetComponents/EmptyProductCard";
// import ProductFilters from "./AssetComponents/ProductFilters";
// import { useMediaQuery } from "react-responsive";

// function Menu({ isAuthenticated }) {
//     const small = useMediaQuery({ maxWidth: 600 });
//      const { productsItem } = useTheme();
//     const Location = useLocation();
//     const Navigate = useNavigate();
//     const [items, setProducts] = useState(null);
//     const [SearchItem, setSearchItem] = useState("");

//     const Products = (Products) => {
//         setProducts(Products)
//     }

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [])

//     return (
//         <div className=" w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '75px' }}>
//             <div className=" w-100 h-100 inner-Menu d-flex flex-column">


//                 <ProductFilters Products={Products} searchingProduct={setSearchItem}/>

//                 {/* {small&&<h1 className=" fw-bold text-center">Menu</h1>} */}

//                 <div className='Extra-products-container py-3'>
//                     <div className='Extra-products'>
//                         <div className="scroll-items" style={{justifyContent:small&&'space-around',flexWrap:small&&'wrap'}}>

// {items&&items.length?items.map(product=>(
//     <ProductCard key={product._id} isAuthenticated={isAuthenticated} e={product} Navigate={Navigate}/>
// )):productsItem && productsItem.length > 0&&SearchItem=="" ? (
// productsItem.map((item) => 
// <ProductCard key={item._id} isAuthenticated={isAuthenticated} e={item} Navigate={Navigate} />)):
// <EmptyProductCard/>}
//                         </div>
//                     </div>
//                 </div>


//             </div>
//             <Footer />
//         </div>
//     )
// }

// export default Menu;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import ProductCard from "./AssetComponents/ProductCard";
import Footer from "./footer";
import EmptyProductCard from "./AssetComponents/EmptyProductCard";
import ProductFilters from "./AssetComponents/ProductFilters";
import { useMediaQuery } from "react-responsive";

function Menu({ isAuthenticated }) {
    const small = useMediaQuery({ maxWidth: 600 });
    const { productsItem } = useTheme();
    const Navigate = useNavigate();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchItem, setSearchItem] = useState("");

    // Called by ProductFilters when filtering
    const handleFilter = (products) => {
        setFilteredProducts(products);
    };

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Determine what to render
    const hasFilterApplied = filteredProducts && filteredProducts.length > 0;
    const showEmpty = filteredProducts && filteredProducts.length === 0 && searchItem !== "";

    return (
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '75px' }}>
            <div className="w-100 h-100 inner-Menu d-flex flex-column">

                {/* 🔍 Filters/Search */}
                <ProductFilters Products={handleFilter} searchingProduct={setSearchItem} />

                <div className='Extra-products-container py-3'>
                    <div className='Extra-products'>
                        <div className="scroll-items"
                             style={{ justifyContent: small && 'space-around', flexWrap: small && 'wrap' }}>

                            {/* Conditional rendering */}
                            {filteredProducts === null ? (
  // No filter → show all
  productsItem?.map((item) => (
    <ProductCard key={item._id} isAuthenticated={isAuthenticated} e={item} Navigate={Navigate} />
  ))
) : filteredProducts.length > 0 ? (
  // Filtered results
  filteredProducts.map((product) => (
    <ProductCard key={product._id} isAuthenticated={isAuthenticated} e={product} Navigate={Navigate} />
  ))
) : (
  // No results
  <EmptyProductCard />
)}

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Menu;
