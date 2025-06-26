import { useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./footer";


function About({image}) {
  const [filteredItem, setFilteredItem] = useState([]);
  const Location = useLocation();

  const handleImage = (id) => {
    const filteredImage = image.filter(item => item._id === id)
    setFilteredItem(filteredImage[0]);
  }

  return (
    <>
      <div className="About-box" id="About" style={{marginTop:Location.pathname==='/About'?'75px':null}}>
        <div className="About-inner-box">
          <div className="About-content d-flex flex-column" data-aos="fade-left" data-aos-duration="600">
            <h1 className='text-center mb-3'>About us</h1>
            <div className='about-text d-flex flex-column'>
              {filteredItem.length === 0? <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur praesentium porro corporis voluptates laudantium inventore voluptatibus quidem aspernatur, illo nobis aliquam qui possimus magni voluptatum veritatis officiis adipisci! At numquam eius iste. Porro commodi aliquid deleniti. Soluta ratione facilis consectetur voluptates, ullam minus consequuntur dolores sequi cumque repellat natus accusantium animi atque voluptatibus architecto, ducimus odio perferendis earum obcaecati iure velit nesciunt fugiat cupiditate. Sint, sequi aut. Harum quae ex facere expedita exercitationem nobis eum repellendus quas ipsum totam amet minus sunt eius accusamus eligendi vero, neque perferendis odio vitae repellat non omnis corrupti. Ut velit doloribus, nulla quasi iste eius aut cupiditate esse dicta distinctio, ipsam laboriosam blanditiis sed totam aliquam nemo adipisci harum delectus. Totam aliquid laboriosam sunt voluptas, officia similique voluptatum provident quae. Harum, temporibus a commodi incidunt natus, aliquid vero eaque fuga magni maxime beatae! Ullam quia atque vero recusandae dolorem animi aliquam quam, corporis tempora?</p> : <p>{filteredItem.content}</p>}
              <div className='About-btn-image d-flex justify-content-between'>
                <a href="/About"><button className='About-btn'>Learn more</button></a>
                <div className='Image-slide'>
                  {image.map((e) => (
                    <img key={e._id} src={e.url} className='Shop-slid' alt="Image 3" onClick={() => handleImage(e._id)} />
                  ))}
                  <div className='plus-image'>
                    <i class="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="About-image" data-aos="fade-right" data-aos-duration="600">
            {filteredItem.length === 0? <img src="src/assets/Tea_shop.jpeg" className='shop' alt="Image 7" /> :
              <img src={filteredItem.url} className='shop' alt="Image 7" />}
          </div>
        </div>
      </div>
      {Location.pathname==='/About'&&<Footer/>}
    </>
  )
}
export default About;