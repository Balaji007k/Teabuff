import React, { useState } from "react";
import ApiService from "./Service/ApiService/product-api";
import { useTheme } from "../ThemeContext";
import { useEffect } from "react";
import LoadingPage from "./AssetComponents/LoadingPage";
import { useNavigate } from "react-router-dom";
import AlertMessage from "./AssetComponents/AlertMessage";
//import { useParams } from "react-router-dom";

export default function OrderConfirmation() {


  const {isAuthenticated} = useTheme();
  const [MyOrders,setOrderDetails] = useState(null);
  const [Loading,setLoading] = useState(false);
  const Navigate = useNavigate();
  const [AlertMessageMyOrders,setAlertMessage] = useState([]);
  //const { id } = useParams();

  // Get order by ID (GET)
const getUserAllOrders = async(Id)=> {
  setLoading(true);
  const { Result, Error } = await ApiService.fetchData(`/orders/${Id}`);
  setOrderDetails(Result);
  if(!Result){
    //console.log(Error);
    setLoading(false);
    setAlertMessage({message:Error,state:false})
    setTimeout(()=>{
      Navigate('/');
    },1500);
}}

// Get order by ID (GET)
// const getSingleUserOrder = async()=> {
//   const { Result, Error } = await ApiService.fetchData(`/orders/${isAuthenticated.userId}/${id}`);
//   // console.log(Result);
//   setOrderDetails(Result);
//   if(Error)console.log(Error);
// }

useEffect(() => {
    getUserAllOrders(isAuthenticated.userId);
}, [isAuthenticated]);

useEffect(()=>{
  if(MyOrders&&MyOrders.length)
  {
     setLoading(false);
  }
},[MyOrders])



  return (
      MyOrders&&MyOrders.length?MyOrders.slice().reverse().map((OrderDetails)=>(
        <div key={OrderDetails?._id} className="container mb-5" style={{marginTop:'75px'}}>
      <div className="card shadow border-0 p-4">
        <h2 className="h5 fw-semibold mb-3">Ordered: <span className="text-secondary">{new Date(OrderDetails?.createdAt).toLocaleDateString()}
</span></h2>
        {/* Header */}
<div className="row border-bottom pb-3 mb-4 align-items-center text-center text-md-start">
  <div className="col-12 col-md-8 mb-2 mb-md-0">
    <h1 className="h5 fw-semibold mb-0">
      Thank you for your order{" "}
      <span className="text-secondary">#{OrderDetails?.orderId}</span>
    </h1>
  </div>
  <div className="col-12 col-md-4 text-center text-md-end">
    <button onClick={()=>Navigate('/Menu')} className="btn-link fw-medium text-decoration-none">
      Continue Shopping
    </button>
  </div>
</div>


        {/* Delivery Info */}
<div className="border rounded p-3 mb-4">
  <p className="mb-4">
    🚚 We&apos;ll send you an email with tracking information when your item ships.
  </p>

  <div className="row mb-3 text-center text-md-start">
    {/* Order placed */}
    <div className="col-12 col-md-4 mb-3">
      <p className="text-muted fw-medium mb-1">Order placed</p>
      <p className="text-success fw-semibold mb-1">
        Value shipping <br /> Arrives by {new Date(OrderDetails?.deliveryDate).toDateString()} {new Date(OrderDetails?.deliveryDate).toTimeString()}
      </p>
      <p className="small text-muted mb-0">Order #{OrderDetails?.orderId}</p>
    </div>

    {/* Shipping address */}
    <div className="col-12 col-md-4 mb-3">
      <p className="text-muted fw-medium mb-1">Shipping address</p>
      <p className="fw-semibold mb-0">{OrderDetails?.customerName}</p>
      <p className="mb-0">{OrderDetails?.address}</p>
      <p className="small text-muted">{OrderDetails?.email}</p>
      <p className="small text-muted">{OrderDetails?.contact?(`+${OrderDetails?.contact}`):""}</p>
    </div>

    {/* Progress */}
    <div className="col-12 col-md-4 text-center">
      <p className="small fw-medium mb-2">Order status</p>
      <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
        <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle"
          style={{ width: "24px", height: "24px", fontSize: "12px" }}>
          ✔
        </div>
        <span className="small">Order placed</span>
      </div>
      <p className="small text-muted mt-1">
        Processing → Shipped → Delivered
      </p>
    </div>
  </div>

  {/* Products */}
  {OrderDetails?.products?.map((product, index) => (
    <div key={index} className="d-flex flex-column flex-md-row align-items-center gap-3 border-top pt-3">
      <img
        src={product.image}
        alt={product.name}
        className="rounded img-fluid"
        style={{ maxWidth: "80px", objectFit: "cover" }}
      />
      <div className="flex-grow-1 text-center text-md-start">
        <p className="fw-medium mb-1">{product.name}</p>
        <p className="small text-muted mb-0">
          Value shipping: Arrives by {new Date(OrderDetails?.deliveryDate).toLocaleDateString()}
        </p>
      </div>
      <p className="small mb-0">Qty: {product.qty}</p>
      <p className="fw-medium mb-0">₹{((product.categoryId==1?product.price/2:product.price) * product.qty).toFixed(2)}</p>
    </div>
  ))}
</div>


        {/* Order Summary / Payment / Billing */}
        <div className="row g-4 mb-4">
          {/* Order Summary */}
          <div className="col-md-4">
            <h2 className="h6 fw-semibold mb-2">Order summary</h2>
            <div className="d-flex justify-content-between small mb-1">
              <span>Subtotal ({OrderDetails?.products?.length} item)</span>
              <span>₹{OrderDetails?.subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Value shipping</span>
              <span>₹{OrderDetails?.shipping.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Est. tax</span>
              <span>₹{OrderDetails?.tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-semibold border-top pt-2">
              <span>Total</span>
              <span>₹{OrderDetails?.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="col-md-4">
            <h2 className="h6 fw-semibold mb-2">Payment type</h2>
            <div className="d-flex align-items-center gap-2">
              <img
                src={`https://upload.wikimedia.org/wikipedia/commons/0/04/${OrderDetails?.paymentType}_logo.svg`}
                alt={OrderDetails?.paymentType}
                className="img-fluid"
                style={{ width: "40px", height: "24px", objectFit: "contain" }}
              />
              <span className="small">Ending in {OrderDetails?.cardEnding}</span>
            </div>
          </div>

          {/* Billing */}
          <div className="col-md-4">
            <h2 className="h6 fw-semibold mb-2">Billing address</h2>
            <p className="fw-semibold mb-0">{OrderDetails?.customerName}</p>
            <p className="mb-0">{OrderDetails?.address}</p>
            <p className="small text-muted">{OrderDetails?.email}</p>
            <p className="small text-muted">{OrderDetails?.contact?(`+${OrderDetails?.contact}`):""}</p>
          </div>
        </div>

        {/* Cashback Banner */}
        {/* <div className="border-top pt-3 text-center">
          <p className="text-danger fw-bold fs-5 mb-1">
            Get $10 Cash Back & 10% cash back
          </p>
          <p className="text-muted small mb-2">
            on your next Walmart purchase!
          </p>
          <button className="btn btn-success px-4 py-2">
            Click Here
          </button>
          <p className="text-muted small mt-2">
            Courtesy of ShopSmarter.com
          </p>
        </div> */}
      </div>
    </div>
      )):Loading?<LoadingPage/>:AlertMessageMyOrders&&<AlertMessage message={AlertMessageMyOrders}/>
  );
}
