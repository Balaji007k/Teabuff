import React, { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './AssetComponents/counter';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import ProductCard from './AssetComponents/ProductCard';
import EmptyProductCard from './AssetComponents/EmptyProductCard';
import ViewMore from './AssetComponents/ViewMore';
import OfferSlider from './AssetComponents/OfferSlider';

function Product({ isAuthenticated, productsItem, category, setHideNavbar }) {
  const small = useMediaQuery({ maxWidth: 600 })
  const Location = useLocation();
  const [value, setValue] = useState(0);
  const [items, setProducts] = useState([]);
  const [SearchItem, setSearchItem] = useState("");
  const Navigate = useNavigate();



  const Popularref = useRef();

  const popularNext = () => {
    Popularref.current.scrollLeft += 316;
  };

  const popularPrv = () => {
    Popularref.current.scrollLeft -= 316;
  };


  const sliderRef = useRef();

  const handleNext = () => {
    sliderRef.current.scrollLeft += 316;
  };

  const handlePrev = () => {
    sliderRef.current.scrollLeft -= 316;
  };
  const Slideref = useRef();

  const HandleNext = () => {
    Slideref.current.scrollLeft += 316;
  };

  const HandlePrev = () => {
    Slideref.current.scrollLeft -= 316;
  };

  const handleCategorySelect = async (categoryId) => {
    if (productsItem.length > 0) {
      if (categoryId !== 0) {
        const filtered = await productsItem.filter(product => product.categoryId === parseInt(categoryId));
        setProducts(filtered);
      } else {
        setProducts(productsItem);
      }
    }
    setValue(categoryId);
  };

  const handleSearch = async (Searched_item) => {
    if (productsItem.length > 0) {
      if (Searched_item !== "") {
        const filtered_Item = await productsItem.filter(product => product.title.toLowerCase().replace(/\s+/g,'').includes(Searched_item.toLowerCase().replace(/\s+/g,'')));
        setProducts(filtered_Item);
      } else {
        setProducts(productsItem);
        setValue(0);
      }
    }
  };

  useEffect(() => {

    setProducts(productsItem)

  }, [productsItem])


  return (
    <>
    <OfferSlider setHideNavbar={setHideNavbar}/>
    <div className='Product d-flex justify-content-center' id="Product_id">
      <div className='product-inner-box'>
        <div className='search'>
          <div className='product top home-search px-2'>
            <select
              value={value}
              className='item category'
              onChange={(e) => handleCategorySelect(parseInt(e.target.value))}
              required
              style={{ color: value === 0 ? 'grey' : 'var(--color)', backgroundColor: 'var(--bOX-background-color)' }}
            >
              <optgroup style={{ color: 'var(--color)' }}>
                <option value={0} defaultValue>All</option>
                {category.map((e) => (
                  <option key={e?.categoryId} value={e?.categoryId}>{e?.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <h1 className='menu-head fw-bolder'>Menu</h1>
          <div className='top home-search d-flex align-items-center'>
            <input type='search' className='item search-tag' onKeyUp={() => handleSearch(SearchItem)} onChange={(e) => setSearchItem(e.target.value.trim().toLowerCase())} placeholder='search' />
            <button type='submit' className='search-i-product' onClick={() => handleSearch(SearchItem)}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        {SearchItem==""&&<>
        <div className='Home-Products w-100 d-flex justify-content-between align-items-center'><h1 className=' m-0'>Popular</h1><span className="material-symbols-outlined d-md-none" onClick={()=>{Navigate('/Menu')}} >
              arrow_forward_ios
            </span></div>
        <div className='product content d-flex align-items-center'>
          <div className='Next left-scroll' onClick={popularPrv}>
            <span className="material-symbols-outlined">
              arrow_back_ios
            </span>
          </div>

          {/* SCROLLABLE CONTAINER */}
          <div
            className="slider-container d-flex flex-wrap"
            ref={Popularref}
          >
            <div
              className="scroll-items"
              style={{
                display: 'flex',
                gap: '20px',
                maxHeight: small ? '550px' : 'auto'
              }}
            >
              {items && items.length > 0 ? (
                <>
                  {items.map((e) => (
                    e.rating >= 4.5 && (
                     <ProductCard key={e._id} isAuthenticated={isAuthenticated} e={e} Navigate={Navigate}/>
                    )
                  ))}
                  <ViewMore/>
                </>
              ) : (
                <EmptyProductCard/>
                
              )}

            </div>
          </div>

          <div className='Next right-scroll' onClick={popularNext}>
            <span className="material-symbols-outlined">
              arrow_forward_ios
            </span>
          </div>
        </div>

<OfferSlider setHideNavbar={setHideNavbar}/>
        <div className='Home-Products w-100 d-flex justify-content-between align-items-center'><h1 className=' m-0'>Fresh Tea</h1><span className="material-symbols-outlined d-md-none" onClick={()=>{Navigate('/Menu')}}>
              arrow_forward_ios
            </span></div>
        <div id='Fresh_Tea' className='product content d-flex align-items-center'>
          <div className='Next left-scroll' onClick={HandlePrev}>
            <span className="material-symbols-outlined">
              arrow_back_ios
            </span>
          </div>

          {/* SCROLLABLE CONTAINER */}
          <div
            className="slider-container d-flex flex-wrap"
            ref={Slideref}
          >
            <div
              className="scroll-items"
              style={{
                display: 'flex',
                gap: '20px',
                maxHeight: small ? '550px' : 'auto'
              }}
            >
              {items && items.length > 0 ? (
                <>
                  {items.map((e) => (
                    e.categoryId === 1 && (
                      <ProductCard key={e._id} isAuthenticated={isAuthenticated} e={e} Navigate={Navigate}/>
                    )
                  ))}
                  <ViewMore/>
                </>
              ) : (
                <EmptyProductCard/>
              )}
            </div>
          </div>

          <div className='Next right-scroll' onClick={HandleNext}>
            <span className="material-symbols-outlined">
              arrow_forward_ios
            </span>
          </div>
        </div>

<OfferSlider setHideNavbar={setHideNavbar}/>
<div className='Home-Products w-100 d-flex justify-content-between align-items-center'><h1 className=' m-0'>Recommended</h1><span className="material-symbols-outlined d-md-none" onClick={()=>{Navigate('/Menu')}}>
              arrow_forward_ios
            </span></div>
        
        <div className='product content d-flex align-items-center'>
          <div className='Next left-scroll' onClick={handlePrev}>
            <span className="material-symbols-outlined">
              arrow_back_ios
            </span>
          </div>

          {/* SCROLLABLE CONTAINER */}
          <div
            className="slider-container d-flex flex-wrap"
            ref={sliderRef}
          >
            <div
              className="scroll-items"
              style={{
                display: 'flex',
                gap: '20px',
                maxHeight: small ? '550px' : 'auto'
              }}
            >
              {items && items.length > 0 ? (
                <>
                  {items.map((e) => (
                    e.categoryId !== 1 && e.rating >=2.5 && (
                      <ProductCard key={e._id} isAuthenticated={isAuthenticated} e={e} Navigate={Navigate}/>
                    )
                  ))}
                  <ViewMore/>
                </>
              ) : (
                <EmptyProductCard/>
              )}
            </div>
          </div>

          <div className='Next right-scroll' onClick={handleNext}>
            <span className="material-symbols-outlined">
              arrow_forward_ios
            </span>
          </div>
        </div>
        </>
        }


        {SearchItem!==""&&<>
        <h1>Searching Item</h1>
        <div className='product content d-flex align-items-center'>
          <div className='Next left-scroll' onClick={popularPrv}>
            <span className="material-symbols-outlined">
              arrow_back_ios
            </span>
          </div>

          {/* SCROLLABLE CONTAINER */}
          <div
            className="slider-container d-flex flex-wrap"
            ref={Popularref}
          >
            <div
              className="scroll-items"
              style={{
                display: 'flex',
                gap: '20px',
                maxHeight: small ? '550px' : 'auto'
              }}
            >
              {items && items.length > 0 ? (
                <>
                  {items.map((e) => (
                    (
                     <ProductCard key={e._id} isAuthenticated={isAuthenticated} e={e} Navigate={Navigate}/>
                    )
                  ))}
                  <ViewMore/>
                </>
              ) : (
                <EmptyProductCard/>
                
              )}

            </div>
          </div>

          <div className='Next right-scroll' onClick={popularNext}>
            <span className="material-symbols-outlined">
              arrow_forward_ios
            </span>
          </div>
        </div>
        </>
        }


        <div className='product exp d-flex justify-content-around my-3'>
          <div><AnimatedCounter endValue={3} label={'+'} /><span>Projects Completed</span></div>
          <div><AnimatedCounter endValue={6} label={'+'} /><span>Month Experience</span></div>
          <div><AnimatedCounter endValue={100} label={'%'} /><span>Client satisfaction</span></div>
          <div><AnimatedCounter endValue={""} label={''} /><span>Support Available</span></div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Product;
