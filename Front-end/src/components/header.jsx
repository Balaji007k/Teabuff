import { useMediaQuery } from "react-responsive";
import { useState, useRef, useEffect } from "react";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Link as ScrollLink } from "react-scroll";
import ApiService from "./Service/ApiService/product-api";
import { useTheme } from "../ThemeContext";

function Header({ userinputFocus, isAuthenticated, cart, setAlertMessage, HideNav }) {

    const small = useMediaQuery({maxWidth:600});
    const {OrderId} = useTheme();

    const [BarVisible, setBarVisible] = useState(false);
    const [Showprofile, setShowProfile] = useState(false);
    const Location = useLocation();
    const match = Location.pathname.match(/^\/product\/([^/]+)/);
    const id = match ? match[1] : undefined;
    const accountNavRef = useRef(null);
    const buttonRef = useRef(null);
    const [preview, setPreview] = useState('assets/ProfileImage.svg');
    const Navigate = useNavigate();

    const fetchProfileImage = async () => {
        const { Result, Error } = await ApiService.fetchData(`/userProfileImage/${isAuthenticated.userId}`);
        if (Result?.profileImage) {
            setPreview(`${ApiService.Backend+Result?.profileImage}`);
        }
    };

useEffect(()=>{
    if(!HideNav){setBarVisible(false);}
},[HideNav])


useEffect(()=>{
    if (isAuthenticated) fetchProfileImage();
},[]);


    const HideBar = () => {
        setBarVisible(prev => !prev);
        setShowProfile(false);
    }
    const Hideprofile = () => {
        setShowProfile(prev=> !prev);
    }

    const Logout = async () => {
        const LogoutConfirm = window.confirm('Are you sure you want to Logout')
        if (LogoutConfirm) {
            const payload = {
                UserId:isAuthenticated.userId
            };

            const { Result, Error } = await ApiService.fetchData(`/Logout/${isAuthenticated.userId}`,"POST",payload);
            console.log(Result);
                setAlertMessage({message:Result?.message,state:true});
                setTimeout(()=>{
                    setAlertMessage(null);
                    window.location.reload();
                },1500);
            if(Error){
                console.log(Error);
            }
        }
    };


    const CartLength = cart?.items?.length;

    useEffect(()=>{
        setBarVisible(false);
    },[Location.pathname])

    useEffect(() => {
        
        const handleClickOutside = (event) => {
            if (
                BarVisible &&
                accountNavRef.current &&
                !accountNavRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setBarVisible(prev=>!prev);
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        
    }, [BarVisible]);


    return (
        <>
            <div className='header' style={{ borderRadius: !small&&BarVisible ? '0px 0px 0px 20px' : '0px 0px 20px 20px' }}>
                <div className="logo name">
                    <h1 className=" fs-3 m-0">Teabuff</h1>
                </div>
        <div className="right-Line position-fixed end-0 top-0"></div>
                <nav ref={small?accountNavRef:null} className={`navbar ${small&&BarVisible?'show':'hide'}`}>
                    {small&&<i className="fa-solid fa-xmark position-absolute top-0 end-0 p-4 fs-3" style={{cursor:'pointer'}} onClick={()=>setBarVisible(false)}></i>}
                    <ul className="nav-list p-0 m-0 overflow-x-hidden">
                        {small&&<div className="w-100 d-flex flex-column align-items-center">
                                    <div className="UserProfileImage">
                                <img src={preview} alt="Profile" height={'125px'} width={'125px'} className=" rounded-circle bg-black" 
                                onClick={()=>{Navigate(`/Profile/${isAuthenticated?.userId}`)}}
                                onError={(e) => {
    e.currentTarget.onerror = null; // avoid infinite loop
    e.currentTarget.src = "assets/ProfileImage.svg"; // fallback if image not found
  }} />
                                <i className="fa-solid fa-pen-to-square" onClick={()=>{Navigate(`/Profile/${isAuthenticated?.userId}`)}} style={{top:'60px'}}></i>
                                    </div>
                            <span className=" fs-3 text-white">{isAuthenticated?.userName}</span>
                                </div>}
                        <li data-aos="fade-down" data-aos-duration="600">{Location.pathname==='/'?<ScrollLink offset={-70} to="Home">Home</ScrollLink>:<Link to="/">Home</Link>}</li>
                        {Location.pathname === `/product/${id}` ? <li data-aos="fade-down" data-aos-duration="1000"><ScrollLink offset={-70} to="suggestItems">Suggested items</ScrollLink></li> :<li data-aos="fade-down" data-aos-duration="1200"><Link to="/About">About</Link></li>}
                        {Location.pathname === `/product/${id}` ? <li data-aos="fade-down" data-aos-duration="1400"><Link to="/Menu">More items</Link></li>:<li data-aos="fade-down" data-aos-duration="1400"><Link to={'/Menu'}>Menu</Link></li>}
                        {Location.pathname === `/product/${id}` ? null : Location.pathname==='/'?<li data-aos="fade-down" data-aos-duration="1800"><ScrollLink offset={-70} to="Service_id">Service</ScrollLink></li>:<li data-aos="fade-down" data-aos-duration="1800"><Link to="/Service">Service</Link></li>}
                        {Location.pathname === `/product/${id}` ? null : Location.pathname==='/'?<li data-aos="fade-down" data-aos-duration="2200"><ScrollLink offset={-70} to="Contact_id">Contact Us</ScrollLink></li>:<li data-aos="fade-down" data-aos-duration="2200"><Link to="/Contact_Us">Contact Us</Link></li>}
                        {small&&<li><Link to={'/WishList'}>Wishlist</Link></li>}
                        <li><Link to={`/${isAuthenticated?.userName+"Cart"}/${isAuthenticated ? isAuthenticated?.userId : 'No_user'}`}><i className="fa-solid fa-cart-shopping">  {!CartLength?0:CartLength} </i></Link></li>
                        {small&&<><li><Link to={'/Login'}>Add Account</Link></li>
                        <li><Link to={`/MyOrders/${OrderId}`}>My Orders</Link></li>
                        <li onClick={() => Logout()}><Link 
    to="/Logout" 
    onClick={(e) => {
      e.preventDefault(); // prevent navigation
    }}
  >
    Logout
  </Link></li></>}
                    </ul>
                </nav>
                <div className='logo button'>
                    {!isAuthenticated ? <nav>
                        <Link to='/Login' onClick={() => {userinputFocus()}}>
                            <button className='lobu'>Login</button>
                        </Link>
                    </nav> : <button ref={buttonRef} className='lobu fs-5' onClick={() => HideBar()}><i className="fa-solid fa-bars"></i></button>}
                    {!small&&<nav ref={accountNavRef} className={`AccountNav ${BarVisible ? 'show' : 'hide'} position-fixed end-0`} style={{ top: '65px' }}>
                        <ul className="py-0 d-flex flex-column justify-content-around px-2 mx-2 w-100 h-100">
                            <div>
                                <div className="w-100 d-flex flex-column align-items-center my-4">
                                    <div className="UserProfileImage">
                                <img
  src={preview}
  alt="Profile"
  height="125px"
  width="125px"
  className="rounded-circle bg-black"
  onClick={()=>{Navigate(`/Profile/${isAuthenticated?.userId}`)}}
  onError={(e) => {
    e.currentTarget.onerror = null; // avoid infinite loop
    e.currentTarget.src = "assets/ProfileImage.svg"; // fallback if image not found
  }}
/>

                                <i className="fa-solid fa-pen-to-square" onClick={()=>{Navigate(`/Profile/${isAuthenticated?.userId}`)}}></i>
                                    </div>
                            <span className=" fs-3 text-black">{isAuthenticated?.userName}</span>
                                </div>
                            <div className=" w-100">
                                {Location.pathname==='/'?<ScrollLink offset={-70} to="Home"><h3 className=' mt-1'><i className="fa-solid fa-house"></i>Home</h3></ScrollLink>:<Link to={"/"}><h3 className=' mt-1'><i className="fa-solid fa-house"></i>Home</h3></Link>}
                                <h3 onClick={()=>Hideprofile()}><i className="fa-solid fa-user"></i>Profile</h3>
                                <div className={`profile-details ${Showprofile?'show':'hide'} d-flex flex-column align-items-center`}>
                                    <input type="text" className="lobu rounded-0 m-0 bg-transparent" disabled placeholder="Name" value={isAuthenticated?.userName || "No user"}/>
                                    <input type="text" className="lobu rounded-0 m-0 bg-transparent" disabled placeholder="Email" value={isAuthenticated?.userEmail || ""}/>
                                    <input type="text" className="lobu rounded-0 m-0 bg-transparent" disabled placeholder="Password" value={'**********'}/>
                                </div>
                                <h3><i className="fa-solid fa-gift"></i>Offers</h3>
                                <Link to={'/WishList'}><h3><i className="fa-solid fa-heart"></i>WishList</h3></Link>
                                {Location.pathname==='/'?<ScrollLink offset={-70} to="Contact_id"><h3><i className="fa-solid fa-phone"></i>Contact Us</h3></ScrollLink>:<Link to={'/Contact_Us'}><h3><i className="fa-solid fa-phone"></i>Contact Us</h3></Link>}
                                <Link to={'/Login'}><h3><i className="fa-solid fa-user-plus"></i>Add Account</h3></Link>
                                <Link to={`/MyOrders/${isAuthenticated?.userId}`}><h3><i className="fa-solid fa-box-open"></i>My Orders</h3></Link>
                                
                            </div>
                            </div>
                            <div>
                                <h3><i className="fa-solid fa-gear"></i>Settings</h3>
                                <h3 onClick={() => Logout()}><i className="fa-solid fa-right-from-bracket"></i>Logout</h3>
                            </div>
                        </ul>
                    </nav>}
                </div>
            </div>
        </>
    )
}
export default Header;