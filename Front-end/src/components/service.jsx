import { useLocation } from "react-router-dom";
import Footer from "./footer";
import { useTheme } from "../ThemeContext";

const Service = () => {
  const {Theme} = useTheme();
  const Location = useLocation();

  return (
    <>
      <div
        className="service rounded d-flex justify-content-center"
        id="Service_id"
        style={{ marginTop: Location.pathname === '/Service' ? '75px' : null }}
      >
        <div className={`service-inner-box row py-5 rounded-4 ${Theme?'bg-black text-white':'bg-white text-black'}`}>
          <div className="inner-sevice-content h-100 d-flex justify-content-center flex-wrap">
            <h1 className={`mb-5`}>Services</h1>
            <div className="Service-card d-flex justify-content-center align-items-center flex-wrap w-100 h-100 gap-5">
              
              <div className="service-text">
                <i className="fa-solid fa-gear"></i>
                <h3>Creative Design</h3>
                <p>We craft visually appealing designs that reflect your brand identity.  
                Every element is made to deliver a professional and lasting impression.</p>
              </div>

              <div className="service-text">
                <i className="fa-solid fa-terminal"></i>
                <h3>Clean Code</h3>
                <p>Our code is simple, efficient, and easy to understand.  
                This ensures smooth performance and hassle-free future updates.</p>
              </div>

              <div className="service-text">
                <i className="fa-solid fa-boxes-stacked"></i>
                <h3>Responsive Design</h3>
                <p>Your website will adapt seamlessly to any device size.  
                We ensure a consistent experience on mobiles, tablets, and desktops.</p>
              </div>

              <div className="service-text">
                <i className="fa-solid fa-chart-pie"></i>
                <h3>Bootstrap 4</h3>
                <p>Built with the latest Bootstrap framework for speed and flexibility.  
                It provides a solid foundation to scale your project with ease.</p>
              </div>

              <div className="service-text">
                <i className="fa-solid fa-code"></i>
                <h3>Font Icons</h3>
                <p>Scalable, lightweight icons that look sharp on every screen.  
                They add style while keeping performance optimized.</p>
              </div>

              <div className="service-text">
                <i className="fa-solid fa-chart-line"></i>
                <h3>Awesome Support</h3>
                <p>We provide reliable assistance whenever you need help.  
                Our team is dedicated to solving issues quickly and efficiently.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {Location.pathname === '/Service' && <Footer />}
    </>
  );
};

export default Service;
