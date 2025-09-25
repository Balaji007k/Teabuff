import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/CartDetails.css';
import '../style/ExpressCheckout.css';
import { useTheme } from '../ThemeContext';
import PageNotFound from './AssetComponents/PageNotFound';
import { useMediaQuery } from 'react-responsive';
import ApiService from './Service/ApiService/product-api';
import AlertMessage from './AssetComponents/AlertMessage';
import LoadingPage from './AssetComponents/LoadingPage';
import ProductCard from './AssetComponents/ProductCard';

function CartDetails({ isAuthenticated, cart }) {
    const small = useMediaQuery({maxWidth:600});
    const Location = useLocation();
    const { setUpdatedCart,PostSaveCart, AlertMessageTheme } = useTheme();
    const [AlertMessagePlaceOrder,setAlertMessage] = useState([]);
    const [Loading,setLoading] = useState(false);

    const [quantity, setquantity] = useState({}); // track quantity by productId
    const Navigate = useNavigate();
    const [Order, setOrder] = useState(false);

    const handleCancelItem = async (productId) => {
        setLoading(true);
        const userId = isAuthenticated?.userId;

        if (!userId) {
            setAlertMessage({message:"User not authenticated",state:false})
            return ;
        }

        try {

            const { Result, Error } = await ApiService.fetchData(`/carts/${userId}/${productId}`,"DELETE");
            if(Result) {setLoading(false);}
            setAlertMessage({message:Result.message,state:true})
            setUpdatedCart(Result.cart);
        } catch (err) {
            console.error("Error removing item:", err);
            setAlertMessage({message:"Failed to remove item."+err,state:false});
        }
    };

    const OrderHandler = () => {
        if (cart.items.length <= 0) {
             setAlertMessage({message:"No items in Cart",state:false});
        }
        PostSaveCart(cart,quantity);
        setOrder(true);
    };

    useEffect(()=>{
        if(AlertMessageTheme&&AlertMessageTheme.message) setLoading(false);
    },[AlertMessageTheme])

    useEffect(() => {
  if (AlertMessagePlaceOrder?.message) {
    // console.log(AlertMessagePlaceOrder)
    const timer = setTimeout(() => setAlertMessage(""), 1500);
    return () => clearTimeout(timer);
  }
}, [AlertMessagePlaceOrder]);


    useEffect(() => {
        // Initialize quantities from cart
        if (cart?.items) {
            const initialQuantities = {};
            cart.items.forEach(item => {
                initialQuantities[item.productId] = item.quantity;
            });
            setquantity(initialQuantities);
        }
    }, [cart]);

    useEffect(() => {
        window.scrollTo(0,0);
    }, [])

    useEffect(()=>{
        setAlertMessage(AlertMessageTheme);
    },[AlertMessageTheme])

    const handleQuantityChange = (productId, delta) => {
        setOrder(false);
        setquantity(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] ?? 1) + delta)
        }));
    };

    if (!isAuthenticated) {
        setTimeout(() => {
            Navigate('/Login');
        }, 3000);
        return <PageNotFound Message={"Cart"} />
    }
    if (isAuthenticated&&isAuthenticated.userId){ return (
        <>
        {AlertMessagePlaceOrder&&AlertMessagePlaceOrder?.message?<AlertMessage message={AlertMessagePlaceOrder}/>:Loading&&<LoadingPage/>}
        <div className={` d-flex gap-2 pb-3 flex-column`} style={{ marginTop: '75px'}}>
            {(!cart || cart?.items.length <= 0) ? (
  <div className='w-100 text-center fs-2'>No Cart Here</div>
) : (
  (cart?.items?.length > 0) && (
    <div className='d-flex flex-wrap-reverse justify-content-between' style={{ color: 'var(--Background-white-text)' }}>
      <div className="w-100 d-flex justify-content-center">
        <div className='Cart-Products w-100' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', justifyItems: 'center' }}>
          {cart?.items.map((item) => (
            <div key={item._id} className='selected-item d-flex flex-column align-items-center gap-4'>
              <ProductCard 
                key={item._id} 
                isAuthenticated={isAuthenticated} 
                e={item} 
                Navigate={Navigate} 
                cart={true} 
                handleCancelItem={handleCancelItem}
              />
              <div className='w-100 d-flex flex-column gap-3 justify-content-between align-items-center'>
                <span className='plus-cart fs-4 fw-bold w-75 d-flex justify-content-between align-items-center gap-2'>
                  {quantity[item.productId] <= 1 
                    ? <button className='quantity-btn-All bg-body-secondary'>-</button>
                    : <button className='quantity-btn-All' onClick={() => handleQuantityChange(item.productId, -1)}>-</button>}
                  {quantity[item.productId] ?? item.quantity}
                  <button className='quantity-btn-All' onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                </span>
                <div className='d-flex align-items-center fs-5 fw-bolder'>
                  Total <h5>₹{((quantity[item.productId] ?? item.quantity) * (item.categoryId==1 ? item.itemPrice/2 : item.itemPrice)).toFixed(2)}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
)}

            {(cart?.items?.length ?? 0) > 0 && (<div className={`w-100 ${Location.pathname==='/CheckOut'||Location.pathname===`/CheckOut/${cart?.ProductId}`?'d-none':'d-block'} ${small&&'position-fixed bottom-0 py-2 bg-white'} d-flex justify-content-center gap-4`}>
                    {!Order && <><button className={`Save-cart-btn-CartDetails ${small&&'rounded-5'}`} onClick={() => {PostSaveCart(cart,quantity);setLoading(true)}}>Save Cart</button><button className={`Save-cart-btn-CartDetails ${small&&'rounded-5'}`} onClick={() => {OrderHandler();setLoading(true);Navigate('/CheckOut')}}>Place Order</button></>}
                </div>
                )}
        </div>
        </>
    );
}
}

export default CartDetails;