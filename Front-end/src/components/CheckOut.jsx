import { useEffect, useState } from "react"
import { useNavigate,useParams } from "react-router-dom"
import { useMediaQuery } from "react-responsive";
import ApiService from '../components/Service/ApiService/product-api';
import PlaceOrder from "./placeOrder";
import PageNotFound from "./AssetComponents/PageNotFound";

export default function CheckOut({isAuthenticated,cart}){
    const small = useMediaQuery({maxWidth:600})

    const Navigate = useNavigate();
    const {id} = useParams();
    const [contactEmail,setcontactEmail] = useState("");
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

      const fetchCheckOut = async () => {
        const { Result, Error } = await ApiService.fetchData(`/Checkouts/${isAuthenticated.userId}`);
        if (!Error) {setUserCheckOutData(Result?.UserCheckOut.ShippingDetails[0]);
        }
        else console.error(Error);
    };
      
      const PostCheckOut = async(e) => {
        e.preventDefault();
        alert("working")
        const NewCheckut = {
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
        const { Result, Error } = await ApiService.fetchData(`/NewCheckout/${isAuthenticated.userId}`,"POST",NewCheckut);
        if (Result){
            Navigate('/Payment')
        }
        else{
            console.log(Error)
        }
    };

    useEffect(()=>{
        window.scrollTo(0,0)
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
    setCheckoutReUse(true); // ✅ Add this line
  } else {
    setCheckoutReUse(false);
  }
}, [UserCheckOutData]);

    

    if(isAuthenticated?.userId===id){return(
        <div className={` w-100 d-flex ${!small?'flex-row-reverse':'flex-column'} `}>
        <div className="checkout-Cart-page overflow-y-scroll" style={{flex:'1 1 40%',height:'880px'}}><PlaceOrder isAuthenticated={isAuthenticated} cart={cart}/></div>
        <div className={` d-flex justify-content-center flex-grow-1 pb-3`} style={{marginTop:!small&&'75px',flex:'1 1 60%'}}>
                    <div className=' d-flex flex-column gap-4' style={{ width:!small? '80%' : '95%'}}>
                        <h2 className=" fw-bold">CheckOut</h2>
                        <form onSubmit={PostCheckOut} className=" d-flex flex-column gap-3">
                            <div className='Contact-information w-100 d-flex flex-column gap-3'>
                                <h2>Contact information</h2>
                            <input type='email' value={contactEmail} onChange={(e)=>setcontactEmail(e.target.value)} placeholder='Email'  required/>
                            <span className=' d-flex align-items-center gap-2'>
                                <input className='check-box' type='checkbox' /><label>Email me with news and offers</label>
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
                                    <input type='text' value={postcode} onChange={(e)=>setpostcode(e.target.value)} placeholder='Postcode' required/>
                                </div>
                                <input type='tel' name="phone" value={phone} onChange={(e)=>setphone(e.target.value)} minLength={10} maxLength={10} pattern="[0-9]{10}" placeholder='Phone [Optional]' />
                                <span className=' d-flex align-items-center gap-2'>
                                    <input className='check-box' checked={CheckoutReUse} onChange={()=>setCheckoutReUse(prev=>!prev)} type="checkbox" /><label>Save this information for next time</label>
                                </span>
                            </div>
                            <div className=' d-flex justify-content-between align-items-center'>
                                <span onClick={()=>Navigate(-1)} className=' text-info d-flex align-items-center' style={{cursor:'pointer'}}><span class="material-symbols-outlined">
                                    chevron_left
                                </span>Return to cart</span><button type="submit" className=' p-3 bg-success rounded-2'>Confirm Order</button>
                            </div>
                        </div>
                        </form>


                    </div>
                </div>
        </div>
    )}
    else{
        return(
            <div style={{marginTop:'75px'}}><PageNotFound Message={'User'}/></div>
        )
    }
}