import { useMediaQuery } from "react-responsive";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function Header({ userinputFocus, isAuthenticated, cart }) {

    const small = useMediaQuery({maxWidth:600});

    const [BarVisible, setBarVisible] = useState(false);
    const [Showprofile, setShowProfile] = useState(false);
    const Location = useLocation();
    const match = Location.pathname.match(/^\/product\/([^/]+)/);
    const id = match ? match[1] : undefined;
    const accountNavRef = useRef(null);
    const buttonRef = useRef(null);

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
            await fetch(`http://localhost:5000/Logout/${isAuthenticated.userId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    alert(data.message)
                    window.location.reload();
                })
                .catch(err => console.log(err));
        }
    };


    const CartLength = cart?.items?.length

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                BarVisible &&
                accountNavRef.current &&
                !accountNavRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setBarVisible(false);
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [BarVisible, Location.pathname]);


    return (
        <>
            {Location.pathname === '/' || Location.pathname === '/Login' || Location.pathname === '/Register' || isAuthenticated ? (<div className='header' style={{ borderRadius: !small&&BarVisible ? '0px 0px 0px 20px' : '0px 0px 20px 20px' }}>
                <div className="logo name">
                    <h1 className=" fs-3 m-0">Teabuff</h1>
                </div>
                <nav ref={small?accountNavRef:null} className={`navbar ${small&&BarVisible?'show':'hide'}`}>
                    <ul className="nav-list p-0 m-0">
                        <li data-aos="fade-down" data-aos-duration="600">{Location.pathname==='/'?<a href="#">Home</a>:<Link to={"/"}>Home</Link>}</li>
                        {Location.pathname === `/product/${id}` ? <li data-aos="fade-down" data-aos-duration="1000"><a href="#suggestItems">Suggested items</a></li> :Location.pathname==='/'?<li data-aos="fade-down" data-aos-duration="1000"><a href="#About">About</a></li>:<li data-aos="fade-down" data-aos-duration="2200"><Link to="/About">About</Link></li>}
                        {Location.pathname === `/product/${id}` ? <li data-aos="fade-down" data-aos-duration="1400"><Link to="/Menu">More items</Link></li>:<li data-aos="fade-down" data-aos-duration="1400"><Link to={'/Menu'}>Menu</Link></li>}
                        {Location.pathname === `/product/${id}` ? null : Location.pathname==='/'?<li data-aos="fade-down" data-aos-duration="1800"><a href="#Service_id">Service</a></li>:<li data-aos="fade-down" data-aos-duration="1800"><Link to="/Service">Service</Link></li>}
                        {Location.pathname === `/product/${id}` ? null : Location.pathname==='/'?<li data-aos="fade-down" data-aos-duration="2200"><a href="#Contact_id">Contact Us</a></li>:<li data-aos="fade-down" data-aos-duration="2200"><Link to="/Contact_Us">Contact Us</Link></li>}
                        {small&&<li><Link to={'/WishList'}>Wishlist</Link></li>}
                        <li><Link to={`/${isAuthenticated?.userName+"Cart"}/${isAuthenticated ? isAuthenticated?.userId : 'No_user'}`}><i class="fa-solid fa-cart-shopping">  {!CartLength?0:CartLength} </i></Link></li>
                    </ul>
                </nav>
                <div className='logo button'>
                    {!isAuthenticated ? <nav>
                        <Link to='/Login' onClick={() => userinputFocus()}>
                            <button className='lobu'>Login</button>
                        </Link>
                    </nav> : <button ref={buttonRef} className='lobu fs-5' onClick={() => HideBar()}><i class="fa-solid fa-bars"></i></button>}
                    {!small&&<nav ref={accountNavRef} className={`AccountNav ${BarVisible ? 'show' : 'hide'} position-fixed end-0`} style={{ top: '65px' }}>
                        <ul className="py-0 d-flex flex-column justify-content-around px-2 mx-2 w-100 h-100">
                            <div>
                                <div className="w-100 d-flex flex-column align-items-center">
                                <img src="hi.jpg" alt="Loading" height={'100px'} width={'100px'} className=" rounded-circle bg-black" />
                                <span className=" fs-3 text-black">{isAuthenticated?.userName}</span>
                            </div>
                            <div className=" w-100">
                                {Location.pathname==='/'?<a href="#"><h3 className=' mt-1'><i class="fa-solid fa-house"></i>Home</h3></a>:<Link to={"/"}><h3 className=' mt-1'><i class="fa-solid fa-house"></i>Home</h3></Link>}
                                <h3 onClick={()=>Hideprofile()}><i class="fa-solid fa-user"></i>Profile</h3>
                                <div className={`profile-details ${Showprofile?'show':'hide'} d-flex flex-column align-items-center`}>
                                    <input type="text" className="lobu rounded-0 m-0 bg-transparent" disabled placeholder="Name" value={isAuthenticated?.userName}/>
                                    <input type="text" className="lobu rounded-0 m-0 bg-transparent" disabled placeholder="Email"/>
                                    <input type="text" className="lobu rounded-0 m-0 bg-transparent" disabled placeholder="Password"/>
                                </div>
                                <h3><i class="fa-solid fa-gift"></i>Offers</h3>
                                <Link to={'/WishList'}><h3><i class="fa-solid fa-heart"></i>WishList</h3></Link>
                                {Location.pathname==='/'?<a href="#Contact_id"><h3><i class="fa-solid fa-phone"></i>Contact Us</h3></a>:<Link to={'/Contact_Us'}><h3><i class="fa-solid fa-phone"></i>Contact Us</h3></Link>}
                                <Link to={'/Login'}><h3><i class="fa-solid fa-user-plus"></i>Add Account</h3></Link>
                                
                            </div>
                            </div>
                            <div>
                                <h3><i class="fa-solid fa-gear"></i>Settings</h3>
                                <h3 onClick={() => Logout()}><i class="fa-solid fa-right-from-bracket"></i>Logout</h3>
                            </div>
                        </ul>
                    </nav>}
                </div>
            </div>
            ) : null
            }
        </>
    )
}
export default Header;