import { useEffect, useState } from "react";
import { useLocation,Link } from "react-router-dom";
import Footer from "./footer";


function About({image}) {
  const [filteredItem, setFilteredItem] = useState([]);
  const Location = useLocation();

  const handleImage = (id) => {
    const filteredImage = image.filter(item => item._id === id)
    setFilteredItem(filteredImage[0]);
  }

  useEffect(()=>{
    window.scrollTo(0,0);
  },[filteredItem])

  return (
    <>
      <div className="About-box mb-3" id="About" style={{marginTop:Location.pathname==='/About'&&'75px'}}>
        <div className="About-inner-box">
          <div className="About-content d-flex flex-column"
           data-aos="fade-left"
          data-aos-once="true" data-aos-duration="600">
            <h1 className='text-center mb-3'>About us</h1>
            <div className='about-text d-flex flex-column'>
              {filteredItem.length === 0? <p>
                At Flavors & Feast, we bring the world of food under one roof. From aromatic teas and freshly brewed coffee to wholesome meals, savory snacks, refreshing juices, and indulgent desserts — we’ve got something for everyone.

We believe food is more than just fuel — it’s comfort, joy, and a way to connect with loved ones. That’s why we carefully select ingredients, prepare everything with care, and serve it with a smile.

Whether you’re looking for a quick bite, a family dinner, or a place to explore new tastes, Flavors & Feast is here to satisfy every craving. Because here, every flavor tells a story, and every meal feels like home.
              </p> : <p>{filteredItem.content}</p>}
              <div className='About-btn-image d-flex justify-content-between'>
                <Link to="/About"><button className='LearnMore-btn-About'>Learn more</button></Link>
                <div className='Image-slide'>
                  {image.map((e) => (
                    <img key={e._id} src={e.url} className='Shop-slid' alt="Image 3" onClick={() => handleImage(e._id)} />
                  ))}
                  <div className='plus-image'>
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="About-image"
           data-aos="fade-right"
          data-aos-once="true" data-aos-duration="600">
            {filteredItem.length === 0? <img src="assets/Tea_shop.jpeg" className='shop' alt="Image 7" /> :
              <img src={filteredItem.url} className='shop' alt="Image 7" />}
          </div>
        </div>
      </div>
      {Location.pathname==='/About'&&<Footer/>}
    </>
  )
}
export default About;