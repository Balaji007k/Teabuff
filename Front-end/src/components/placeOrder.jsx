import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/PlaceOrder.css';
import '../style/ExpressCheckout.css';
import { useTheme } from '../ThemeContext';
import PageNotFound from './AssetComponents/PageNotFound';
import { useMediaQuery } from 'react-responsive';
import ApiService from './Service/ApiService/product-api';
import AlertMessage from './AssetComponents/AlertMessage';
import LoadingPage from './AssetComponents/LoadingPage';
import ProductCard from './AssetComponents/ProductCard';

function PlaceOrder({ isAuthenticated, cart }) {
    const small = useMediaQuery({maxWidth:600});
    const Location = useLocation();
    const { setUpdatedCart,PostSaveCart, AlertMessageTheme } = useTheme();
    const [AlertMessagePlaceOrder,setAlertMessage] = useState([]);
    const [Loading,setLoading] = useState(false);

    const [quantity, setquantity] = useState({}); // track quantity by productId
    const Navigate = useNavigate();
    const [Order, setOrder] = useState(false);

    // Compute total amount
    const grandTotal = cart?.items?.reduce((acc, item) => {
        const qty = quantity[item.productId] ?? item.quantity;
        return acc + qty * (item.categoryId==1?item.itemPrice/2:item.itemPrice);
    }, 0);

    //const Discount = (grandTotal * 10 / 100);
    const Tax = (grandTotal * 18 / 100);
    const Total = (grandTotal + Tax)?.toFixed(2)

    const handleCancelItem = async (productId) => {
        setLoading(true);
        const userId = isAuthenticated?.userId;

        if (!userId) {
            setAlertMessage({message:"User not authenticated",state:false})
            return ;
            // setTimeout(()=>{
            //     setAlertMessage(null);
            // },1500);
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
            //  setTimeout(()=>{
            //     setAlertMessage(null);
            //  },1500);
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
            Navigate('/Login')
        }, 3000)
        return <PageNotFound Message={"Cart"} />
    }
    if (isAuthenticated&&isAuthenticated.userId){ return (
        <>
        {AlertMessagePlaceOrder&&AlertMessagePlaceOrder?.message?<AlertMessage message={AlertMessagePlaceOrder}/>:Loading&&<LoadingPage/>}
        <div className={` d-flex gap-2 pb-3 ${Location.pathname==='/CheckOut'||Location.pathname===`/CheckOut/${cart?.ProductId}`?'flex-column-reverse':'flex-column'}`} style={{ marginTop: '75px'}}>
            {Location.pathname===`/CheckOut`||Location.pathname===`/CheckOut/${cart?.ProductId}`?
            <div className='bill items-page w-100'>
            <table className=' w-100 d-flex flex-column align-items-center'>
                <tr className='text-center fs-4'>
                    <th className=' fw-bold'>Item</th>
                    <th className=' fw-bold'>Quantity</th>
                    <th className=' fw-bold'>Total</th>
                </tr>
                {cart?.items.map((item) => (
                    <tr className=' fs-5' key={item._id}>
                        <td className=' d-flex flex-column align-items-center'><img className=' rounded-2' src={item.Product_Url} alt='Loading'height={'100%'} width={'100%'}/><span>{item.itemName}</span></td>
                        <td>{item.quantity}</td>
                        <td>₹{((quantity[item.productId] ?? item.quantity) * (item.categoryId==1?item.itemPrice/2:item.itemPrice)).toFixed(2)}</td>
                    </tr>
                ))}
            </table>
            </div>
            :<div className=' d-flex flex-wrap-reverse justify-content-between' style={{ color: 'var(--Background-white-text)' }}>

                <div className={`w-100 d-flex justify-content-center`}>
                    <div className='Cart-Products w-100' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', justifyItems: 'center' }}>
                        {cart?.items.map((item) => (
                                <div key={item._id} className='selected-item d-flex flex-column align-items-center gap-4'>
                                    {/* <div key={item.productId} className='product-item'>
                                        <img src={item.Product_Url} className='Shop-slid' alt={item.itemName} />
                                        <div className='d-flex flex-column w-100'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <h4 className='card-text my-2'>{item.itemName}</h4>
                                                <h4 className='display-product-text-price my-2'>₹{item.itemPrice}</h4>
                                            </div>
                                            <p className='Poduct-Description'>{item.Description}</p>
                                            <div className=' d-flex justify-content-between p-1'>
                                                <p><i className="fa-solid fa-star text-warning me-1"></i>{(item.Rating).toFixed(1)}</p>
                                            </div>
                                        </div>
                                        <button className='order-button rounded-5 p-2 w-100 text-center' onClick={() => handleCancelItem(item.productId)}>Cancel</button>
                                    </div> */}
                                    <ProductCard key={item._id} isAuthenticated={isAuthenticated} e={item} Navigate={Navigate} cart={true} handleCancelItem={handleCancelItem}/>
                                    <div className='w-100 d-flex flex-column gap-3 justify-content-between align-items-center'>
                                        <span className='plus-cart fs-4 fw-bold w-75 d-flex justify-content-between align-items-center gap-2'>
                                            {quantity[item.productId]<=1?<button className=' bg-body-secondary'>-</button>:<button onClick={() => handleQuantityChange(item.productId, -1)}>-</button>}
                                            {quantity[item.productId] ?? item.quantity}
                                            <button onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                                        </span>

                                        <div className='d-flex align-items-center fs-5 fw-bolder'>Total <h5>₹{((quantity[item.productId] ?? item.quantity) * (item.categoryId==1?item.itemPrice/2:item.itemPrice)).toFixed(2)}</h5>
                                        </div>
                                    </div>
                                </div>
                        ))}
                    </div>
                </div>
            </div>}
            
            {cart?.items?.length <= 0|| !cart ? <div className=' w-100 text-center fs-2'>No Cart Here</div> : <div className=' w-100 d-flex flex-column align-items-center flex-wrap'>
                {( Location.pathname==='/CheckOut'||Location.pathname===`/CheckOut/${cart?.ProductId}`)&&(
                    <>
                    <h3>Selected Items {cart?.items.length}</h3>
                        <div className='d-flex justify-content-center align-items-center'>
                            <input className='promo' type="text" placeholder='Gift or promo code' /><button className='promo'>Apply</button>
                        </div>
                        <div className='bill total-page w-100'>
                            <table className='w-100 d-flex flex-column align-items-center'>
                                <tr>
                                    <th>
                                        Subtotal
                                    </th>
                                    <td>
                                        ₹{(grandTotal)?.toFixed(2)}
                                    </td>
                                </tr>
                                {/* <tr>
                                    <th>
                                        Welcome Offer - 10% Off
                                    </th>
                                    <td>
                                        - ₹{(Discount)?.toFixed(2)}
                                    </td>
                                </tr> */}
                                <tr>
                                    <th>
                                        Tax
                                    </th>
                                    <td>
                                        ₹{(Tax)?.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        Shipping
                                    </th>
                                    <td>
                                        Free
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        GrandTotal
                                    </th>
                                    <td className=' fs-3 fw-bolder'>
                                        ₹{(Total)}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </>
                )}
                <div className={`w-100 ${Location.pathname==='/CheckOut'||Location.pathname===`/CheckOut/${cart?.ProductId}`?'d-none':'d-block'} ${small&&'position-fixed bottom-0 py-2 bg-white'} d-flex justify-content-center gap-2`}>
                    {!Order && <><button className={`cart-btn px-3 ${small&&'rounded-5 py-1'}`} onClick={() => {PostSaveCart(cart,quantity);setLoading(true)}}>Save Cart</button><Link to={`/CheckOut`}><button className={`cart-btn px-3 ${small&&'rounded-5'}`} onClick={() => {OrderHandler();setLoading(true)}}>Place Order</button></Link></>}
                </div>
            </div>}

        </div>
        </>
    );
}
else{
    return(
        <div style={{marginTop:'75px'}}><PageNotFound Message={'User'}/></div>
    )
}
}

export default PlaceOrder;