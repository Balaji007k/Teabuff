import { Link as ScrollLink } from "react-scroll";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from '../ThemeContext';

function Footer() {

    const {Theme} = useTheme();
    const Location = useLocation();

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])

    return (
        <footer className='footer d-flex flex-column justify-content-center align-items-center mt-4'>
            <div className={`footer-inner-box text-light rounded-4 mb-4 ${Theme?'bg-white text-black':'bg-black text-white'}`}>
                <div className=" d-flex justify-content-between align-items-center mx-md-5 my-md-4 p-2"><h1 className='FooterLogo'>Teabuff</h1><i className="fa-solid fa-up-long fs-4 p-2" style={{cursor:'pointer'}} onClick={()=>{window.scrollTo(0,0,)}}></i></div>
                <div className='footer-content d-flex flex-wrap justify-content-between gap-5 mx-5 my-4 ps-2'>
                    <div className='Footer-Details d-flex flex-wrap justify-content-center align-items-start'>
                        <div className='w-100 d-flex justify-content-start'>
                            <p>
                                At TeaBuff, we believe every sip should bring comfort and joy. From refreshing teas and energizing coffees to natural juices and snacks, we’re here to serve you quality, freshness, and flavor in every cup.
                            </p>
                        </div>
                    </div>
                    <div className='Footer-Details Links d-flex justify-content-center align-items-start'>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-2'>
                            <h5 className='head'>Links</h5>
                            {Location.pathname==='/'?
                            <>
                            <h6><ScrollLink offset={-70} to="Home">Home</ScrollLink></h6>
                            <h6><NavLink to="/About">About Us</NavLink></h6>
                            <h6><ScrollLink offset={-70} to="Product_id">Menu</ScrollLink></h6>
                            <h6><ScrollLink offset={-70} to="Contact_id">Contact Us</ScrollLink></h6>
                            </>:
                            <>
                            <h6><NavLink to="/">Home</NavLink></h6>
                            <h6><NavLink to="/About">About Us</NavLink></h6>
                            <h6><NavLink to="/Menu">Menu</NavLink></h6>
                            <h6><NavLink to="/Contact_Us">Contact Us</NavLink></h6>
                            </>}
                        </div>
                    </div>
                    <div className='Footer-Details Links d-flex justify-content-center align-items-start'>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-2'>
                            <h5 className='head'>Social Media</h5>
                            <h6>Twitter</h6>
                            <h6>Instagram</h6>
                            <h6>Youtube</h6>
                            <h6>Facebook</h6>
                        </div>
                    </div>
                    <div className='Footer-Details d-flex justify-content-center align-items-start '>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-3 '>
                            <h5 className='head'>News Letter</h5>
                            {/* <input type='email' className={`p-0 ${Theme?'text-black border-bottom border-1 border-black':'text-white border-bottom border-1 border-white'}`} placeholder='Enter your email id' /> */}
                            <h6 className='Mail'>teabuff@chennai.com</h6>
                            <h6>+911234567890</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className='background-footer w-100'></div>
        </footer>
    )
}
export default Footer;