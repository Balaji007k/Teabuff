import { useLocation, useNavigate } from 'react-router-dom';
import ReviewSlider from './AssetComponents/reviews';
import Login from '../components/login';
import '../style/Login.css';
import { useMediaQuery } from "react-responsive";
import { Link as ScrollLink } from "react-scroll";
import AlertMessage from './AssetComponents/AlertMessage';
import { useEffect,useState } from 'react';
import LoadingPage from './AssetComponents/LoadingPage';
import { useTheme } from '../ThemeContext';


function Home({ userInput, isAuthenticated, AccoutState, PopupMessage }) {

  const small = useMediaQuery({maxWidth:600});
  const {Theme} = useTheme();
  const [Loading,setLoading] = useState(false);


  const Navigate = useNavigate();
  const Location = useLocation();

  useEffect(()=>{
    if(PopupMessage&&PopupMessage.message) {
      setLoading(false)
      setTimeout(()=>{
        AccoutState(null);
      },1500)
    };
  },[PopupMessage])

  return (
    <>
    <div className="outerbox" id="Home">
      {PopupMessage&&PopupMessage?.message?<AlertMessage message={PopupMessage} AccoutState={AccoutState}/>:Loading&&<LoadingPage/>}
      <div className={`inner-box ${small&&'pt-5'} py-md-4 ${Theme?'text-white':'text-black'}`}>
        <div className='inner-content d-flex justify-content-center'>
          <div className='inner-text'>
            <div className='bold-text'>
              {!small?<><h1 className='text'>Brewed to <br />Perfection, Sipped <br />with Tradition.</h1>
              <p className='p'>Experience the authentic taste of Indian chai, crafted with tradition and love.From every sip to every story, our tea brings warmth to your soul.</p></>
                :<><span className='text d-block text-center fw-bolder'>Tradition in Every<br></br> Sip.</span>
              <p className={`p text-center w-100`}>Experience the authentic taste of Indian chai, crafted with tradition and love.From every sip to every story, our tea brings warmth to your soul.</p></>}
            </div>
            <div className='inner-button'>
              {!small?<div className='btn-icon'>
                <ScrollLink to='Product_id' offset={-70}><button className='explore-button-Home'>Explore Now <i className="fa-solid fa-arrow-right ms-2"></i></button></ScrollLink>
                <div className='share'>
                  <div className='icons d-flex gap-4 fs-4 my-2'>
                    <a href='#'><i className="fa-brands fa-instagram"></i></a>
                    <a href='#'><i className="fa-brands fa-facebook"></i></a>
                    <a href='#'><i className="fa-brands fa-youtube"></i></a>
                  </div>
                  <p className='d-inline' style={{ borderBottom: '2px solid #CACA12' }}>Follow us</p>
                </div>
              </div>:<div className='btn-icon'>
                <ScrollLink to='Product_id' offset={-70}><button className='explore-button-Home'>Explore Now <i className="fa-solid fa-arrow-right ms-2"></i></button></ScrollLink></div>}
              <div className={`empty-box ${Theme?'bg-white text-black':'bg-black text-white'} d-flex flex-column gap-2`} >
                <div>
                  <ReviewSlider />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='inner-image'>
          {(Location.pathname === '/Login' || Location.pathname === '/Register') ? <Login userInput={userInput} AccoutState={AccoutState} setLoading={setLoading}/> :
            !small?<img src="assets/Tea.jpeg" className='img' alt="Tea-Img" />:<img src="assets/Home-Mobile-1.png" className='img' alt="Coffee-Img" />
          }
        </div>
      </div>

    </div>
    </>
  );
}
export default Home;