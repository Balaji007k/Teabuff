import { useLocation, useNavigate } from 'react-router-dom';
import ReviewSlider from './AssetComponents/reviews';
import Login from '../components/login';
import '../style/Login.css';
import { useMediaQuery } from "react-responsive";


function Home({ userInput, isAuthenticated }) {

  const small = useMediaQuery({maxWidth:600});


  const Navigate = useNavigate();
  const Location = useLocation();

  return (
    <div className="outerbox" id="Home">
      <div className='inner-box'>
        <div className='inner-content d-flex justify-content-center'>
          <div className='inner-text'>
            <div className='bold-text'>
              {!small?<><h1 className='text' data-aos="fade-right" data-aos-duration="800">Brewed to <br />Perfection, Sipped <br />with Tradition.</h1>
              <p className='p' data-aos="fade-right" data-aos-duration="1200">Experience the authentic taste of Indian chai, crafted with tradition and love.From every sip to every story, our tea brings warmth to your soul.</p></>:<><h1 className='text text-center fw-bolder'>Tradition in Every<br></br> Sip.</h1>
              <p className='p text-center w-100'>Experience the authentic taste of Indian chai, crafted with tradition and love.From every sip to every story, our tea brings warmth to your soul.</p></>}
            </div>
            <div className='inner-button'>
              {!small?<div className='btn-icon' data-aos="fade-right" data-aos-duration="1600">
                <a href='#Product_id'><button className='explore-button'>Explore Now <i class="fa-solid fa-arrow-right ms-2"></i></button></a>
                <div className='share'>
                  <div className='icons d-flex gap-4 fs-4 my-2'>
                    <i class="fa-brands fa-instagram"></i>
                    <i class="fa-brands fa-facebook"></i>
                    <i class="fa-brands fa-youtube"></i>
                  </div>
                  <p className='d-inline' style={{ borderBottom: '2px solid #CACA12' }}>Follow us</p>
                </div>
              </div>:<div className='btn-icon'>
                <a href='#Product_id'><button className='explore-button'>Explore Now <i class="fa-solid fa-arrow-right ms-2"></i></button></a></div>}
              <div className='empty-box d-flex flex-column gap-2' data-aos="fade-right" data-aos-duration="800">
                <div>
                  <ReviewSlider />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='inner-image'>
          {(Location.pathname === '/Login' || Location.pathname === '/Register') ? <Login userInput={userInput} /> :
            !small?<img src="src/assets/Tea.jpeg" className='img' alt="Tea-Img" data-aos="fade-left" data-aos-duration="1400" />:<img src="src/assets/Tea-Image.webp" className='img' alt="Coffee-Img" />
          }
        </div>
      </div>

    </div>
  );
}
export default Home;