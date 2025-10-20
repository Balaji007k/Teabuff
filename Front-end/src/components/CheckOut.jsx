import { useEffect, useMemo, useState } from "react"
import { useNavigate,useParams } from "react-router-dom"
import { useMediaQuery } from "react-responsive";
import ApiService from '../components/Service/ApiService/product-api';
import PageNotFound from "./AssetComponents/PageNotFound";
import AlertMessage from "./AssetComponents/AlertMessage";
import LoadingPage from "./AssetComponents/LoadingPage";
import { useLocation } from "react-router-dom";
import PlaceOrderDetails from "./PlaceOrderDetails";
import { useTheme } from "../ThemeContext";

export default function CheckOut({isAuthenticated,cart}){
    const small = useMediaQuery({maxWidth:600})

    const {Theme} = useTheme();
    const Navigate = useNavigate();
    const Location = useLocation();
    const {id} = useParams();
    const [contactEmail,setcontactEmail] = useState(isAuthenticated?.userEmail);
      const [firstname,setfirstname] = useState("");
      const [lastname,setlastname] = useState("");
      const [company,setcompany] = useState("");
      const [address,setaddress] = useState("");
      const [apartment,setapartment] = useState("");
      const [city,setcity] = useState("");
      const [postcode,setpostcode] = useState("");
      const [phone,setphone] = useState("");
      const [CheckoutReUse,setCheckoutReUse] = useState(false);
      const [UserCheckOutData,setUserCheckOutData] = useState(null);
      const [AlertMessageCheckOut,setAlertMessage] = useState([]);
      const [Loading,setLoading] = useState(true);
      const [Filtered,setFiltered] = useState(null);
      const [updatedCart,setupdatedCart] = useState(null);

      useEffect(()=>{
        setFiltered(cart?.items.find((product)=>
            product.productId==id
        ));
      },[cart])

      useEffect(()=>{
        if((UserCheckOutData&&updatedCart)||updatedCart) setLoading(false);
      },[updatedCart,UserCheckOutData]);


      const fetchCheckOut = async () => {
        const { Result, Error } = await ApiService.fetchData(`/Checkouts/${isAuthenticated.userId}`);
        // console.log(Result)
        if (Result?.UserCheckOut) {
            setUserCheckOutData(Result?.UserCheckOut.ShippingDetails[0]);
        }
        else {
            console.error(`${'No UserCheckOut Data:' +Error}`);
        }
    };
      
      const PostCheckOut = async(e) => {
        e.preventDefault();
        setLoading(true);
        const NewCheckout = {
            contactEmail,
      firstname,
      lastname,
      company,
      address,
      apartment,
      city,
      postcode:Number(postcode),
      phone:Number(phone),
      CheckoutReUse
        };
        const { Result, Error } = await ApiService.fetchData(`/NewCheckout/${isAuthenticated.userId}`,"POST",NewCheckout);
        if (Result){
            setLoading(false);
            setAlertMessage({message:Result.message,state:true});
            setTimeout(()=>{
                setAlertMessage(null);
                Navigate('/Payment', { state: { cart: Location.pathname === `/CheckOut/${Filtered?.productId}` ? { items: [Filtered] } : updatedCart,  NewCheckout  } });
            },1500);
        }
        else{
            console.log(Error)
        }
    };

    const singleItemCart = useMemo(() => {
  if (!Filtered) return null;
  return { items: [Filtered], ProductId: Filtered?.productId };
}, [Filtered,cart]);


    useEffect(()=>{
        window.scrollTo(0,0);
        fetchCheckOut();
    },[])

    useEffect(() => {
  if (UserCheckOutData?.ReUseData === true) {
    setfirstname(UserCheckOutData.firstname || '');
    setlastname(UserCheckOutData.lastname || '');
    setcompany(UserCheckOutData.company || '');
    setaddress(UserCheckOutData.address || '');
    setapartment(UserCheckOutData.apartment || '');
    setcity(UserCheckOutData.city || '');
    setpostcode(UserCheckOutData.postcode || '');
    setphone(UserCheckOutData.phone || '');
    setCheckoutReUse(true); // Add this line
  } else {
    setCheckoutReUse(false);
  }
}, [UserCheckOutData]);

    

    if(isAuthenticated?.userId&&cart?.items.length>0){return(
        <>
        {AlertMessageCheckOut&&AlertMessageCheckOut?.message?<AlertMessage message={AlertMessageCheckOut}/>:Loading&&<LoadingPage/>}
        <div className={`checkout-Cart-page w-100 d-flex gap-2 ${!small?'flex-row-reverse':'flex-column'} ${Theme?'text-white':'text-black'}`} style={{marginTop:!small&&'70px'}}>
        <div className=" overflow-y-scroll" style={{marginTop:small&&'70px',flex:'1 1 40%',height:'880px'}}>
            <PlaceOrderDetails isAuthenticated={isAuthenticated} setupdatedCart={setupdatedCart} cart={Location.pathname==`/CheckOut/${Filtered?.productId}`&&singleItemCart?singleItemCart:cart}/>
        </div>
        <div className={` d-flex justify-content-center flex-grow-1`} style={{flex:'1 1 60%'}}>
                    <div className='CheckOut-Page d-flex flex-column gap-4 p-3' style={{ width:!small? '80%' : '100%'}}>
                        <h2 className=" fw-bold">CheckOut</h2>
                        <form onSubmit={PostCheckOut} className=" d-flex flex-column gap-3">
                            <div className='Contact-information w-100 d-flex flex-column gap-3'>
                                <h2>Contact information</h2>
                            <input className=" bg-body-secondary" type='email' value={contactEmail} onChange={(e)=>setcontactEmail(e.target.value)} placeholder='Email' required disabled={contactEmail}/>
                            <span className=' d-flex align-items-center gap-2'>
                                <input className='check-box' type='checkbox' /><label style={{color:'inherit'}}>Email me with news and offers</label>
                            </span>
                        </div>


                        <div className='ShippingAddress w-100 d-flex flex-column gap-3'>
                            <h2>Shipping address</h2>
                            <div className=' d-flex flex-column gap-3'>
                                <div className=' d-flex gap-2'>
                                    <input type='text' value={firstname} onChange={(e)=>setfirstname(e.target.value)} placeholder='First name' required/>
                                    <input type='text' value={lastname} onChange={(e)=>setlastname(e.target.value)} placeholder='Last name' />
                                </div>
                                <input type='text' value={company} onChange={(e)=>setcompany(e.target.value)} placeholder='Company [Optional]' />
                                <input type='text' value={address} onChange={(e)=>setaddress(e.target.value)} placeholder='Address' required/>
                                <input type='text' value={apartment} onChange={(e)=>setapartment(e.target.value)} placeholder='Apartment [Optional]' />
                                <div className=' d-flex gap-2'>
                                    <input type='text' value={city} onChange={(e)=>setcity(e.target.value)} placeholder='City' required/>
                                    <input type='text' value={postcode} onChange={(e)=>setpostcode(e.target.value)} placeholder='Pin code' required/>
                                </div>
                                <input type='tel' name="phone" value={phone} onChange={(e)=>setphone(e.target.value)} minLength={10} maxLength={10} pattern="[0-9]{10}" placeholder='Phone' required/>
                                <span className=' d-flex align-items-center gap-2'>
                                    <input className='check-box' checked={CheckoutReUse} onChange={()=>setCheckoutReUse(prev=>!prev)} type="checkbox" /><label style={{color:'inherit'}}>Save this information for next time</label>
                                </span>
                            </div>
                            <div className=' d-flex justify-content-between align-items-center'>
                                <span  onClick={()=>Navigate(`/${isAuthenticated?.userName+"Cart"}/${isAuthenticated ? isAuthenticated?.userId : 'No_user'}`)} className='d-flex align-items-center' style={{cursor:'pointer',color:'inherit'}}><span className="material-symbols-outlined">
                                    chevron_left
                                </span>Return to cart</span><button type="submit" disabled={(updatedCart?.items.length==1&&updatedCart?.items[0].itemPrice==0)} className={`confirm-order-btn ${small?'p-2':'p-3'} bg-success`}>Confirm Order</button>
                            </div>
                        </div>
                        </form>


                    </div>
                </div>
        </div>
        </>
    )}
    else{
        return(
            <div style={{marginTop:'75px'}}><PageNotFound Message={'Checkout Data'}/></div>
        )
    }
}