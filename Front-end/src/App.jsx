import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Main from './mainComponent/main';
import Header from './components/header';
import ProductItem from './components/productItem';
import CartDetails from './components/CartDetails';
import { useTheme } from './ThemeContext';
import Admin from './Admin_page/Admin';
import Users from './Admin_page/Admin_Component/Users';
import Products from './Admin_page/Admin_Component/Products';
import Reviews from './Admin_page/Admin_Component/Reviews';
import Category from './Admin_page/Admin_Component/Category';
import Menu from './components/Menu';
import Posts from './components/Posts';
import Wishlist from './components/wishList';
import CheckOut from './components/CheckOut';
import Contact from './components/contact';
import About from './components/about';
import Service from './components/service';
import PageNotFound from './components/AssetComponents/PageNotFound';
import Payment from './components/AssetComponents/Payment';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  const { isAuthenticated, cart, image, Review, AllReview, productsItem, category, AlertMessageTheme } = useTheme();
  const userInput = useRef();
  const location = useLocation();
  const [AlertMessage,setAlertMessage] = useState(null);
  const [HideNavbar,setHideNavbar] = useState(true);


  useEffect(() => {
    if (location.pathname === '/Login') {
      userInput.current?.focus();
    }
  }, [location.pathname]);

  useEffect(()=>{
    setAlertMessage(AlertMessageTheme);
  },[AlertMessageTheme])

  const userinputFocus = () => {
    userInput.current?.focus();
  };

  const isAdminPage = location.pathname.startsWith('/Admin');

  return (
    <>
      {!isAdminPage && (
        <Header
          userinputFocus={userinputFocus}
          isAuthenticated={isAuthenticated}
          setAlertMessage={setAlertMessage}
          cart={cart}
          HideNav={HideNavbar}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={<Main setHideNavbar={setHideNavbar} AlertMessageMain={AlertMessage}/>}
        />
        <Route
          path="/Login"
          element={<Main userInput={userInput} AlertMessageMain={AlertMessage}/>}
        />
        <Route
          path="/Register"
          element={<Main AlertMessageMain={AlertMessage}/>}
        />
        <Route
          path="/Menu"
          element={<Menu isAuthenticated={isAuthenticated} productsItem={productsItem} />}
        />
        <Route
          path="/Posts"
          element={<Posts isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/product/:id"
          element={<ProductItem cart={cart} category={category} productsItem={productsItem} isAuthenticated={isAuthenticated} Review={Review} AlertMessageMain={AlertMessage} />}
        />
        <Route
          path={`/${isAuthenticated?.userName+"Cart"}/:id`}
          element={<CartDetails cart={cart} isAuthenticated={isAuthenticated} />}
        />
        <Route path='/WishList' element={<Wishlist isAuthenticated={isAuthenticated}/>} />
        <Route path="/Admin" element={<Admin AllReview={AllReview} productsItem={productsItem} category={category}/>}>
          <Route
            path="UserDetails"
            element={<Users />}
          />
          <Route
            path="Products"
            element={<Products productsItem={productsItem} />}
          />
          <Route
            path="Reviews"
            element={<Reviews AllReview={AllReview} />}
          />
          <Route
            path="Categorys"
            element={<Category category={category} />}
          />
        </Route>
        <Route
            path="/CheckOut"
            element={<CheckOut isAuthenticated={isAuthenticated} cart={cart}/>}
          />
          <Route
            path="/CheckOut/:id"
            element={<CheckOut isAuthenticated={isAuthenticated} cart={cart}/>}
          />
          <Route
            path="/About"
            element={<About image={image}/>}
          />
          <Route
            path="/Service"
            element={<Service/>}
          />
          <Route
            path="/Contact_Us"
            element={<Contact/>}
          />
          <Route
            path="/Payment"
            element={<Payment/>}
          />
          <Route
            path={`/MyOrders/:id`}
            element={<OrderConfirmation/>}
          />
          <Route path="*" element={<PageNotFound Message={'Match Page'} />} />
      </Routes>
    </>
  );
}

export default App;
