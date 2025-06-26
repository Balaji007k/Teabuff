import { useLocation } from "react-router-dom";
import Footer from "./footer";

const Service = () => {
  const Location = useLocation();

  return (
    <>
      <div
        className="service rounded d-flex justify-content-center"
        id="Service_id"
        style={{ marginTop: Location.pathname === '/Service' ? '75px' : null }}
      >
        <div className="service-inner-box row py-5 rounded-4">
          <div className="inner-sevice-content h-100 d-flex justify-content-center flex-wrap">
            <h1 className="mb-5">Services</h1>
            <div className="Service-card d-flex justify-content-center align-items-center flex-wrap w-100 h-100 gap-5">
              <div className="service-text">
                <i className="fa-solid fa-gear"></i>
                <h3>Creative Design</h3>
                <p>Shop with confidence. We use industry-standard SSL encryption and trusted payment gateways to ensure your personal and payment information is always safe.</p>
              </div>
              <div className="service-text">
                <i className="fa-solid fa-terminal"></i>
                <h3>Clean Code</h3>
                <p>Shop with confidence. We use industry-standard SSL encryption and trusted payment gateways to ensure your personal and payment information is always safe.</p>
              </div>
              <div className="service-text">
                <i className="fa-solid fa-boxes-stacked"></i>
                <h3>Responsive Design</h3>
                <p>Shop with confidence. We use industry-standard SSL encryption and trusted payment gateways to ensure your personal and payment information is always safe.</p>
              </div>
              <div className="service-text">
                <i className="fa-solid fa-chart-pie"></i>
                <h3>Bootstrap 4</h3>
                <p>Shop with confidence. We use industry-standard SSL encryption and trusted payment gateways to ensure your personal and payment information is always safe.</p>
              </div>
              <div className="service-text">
                <i className="fa-solid fa-code"></i>
                <h3>Font icons</h3>
                <p>Shop with confidence. We use industry-standard SSL encryption and trusted payment gateways to ensure your personal and payment information is always safe.</p>
              </div>
              <div className="service-text">
                <i className="fa-solid fa-chart-line"></i>
                <h3>Awesome Support</h3>
                <p>Shop with confidence. We use industry-standard SSL encryption and trusted payment gateways to ensure your personal and payment information is always safe.</p>
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
