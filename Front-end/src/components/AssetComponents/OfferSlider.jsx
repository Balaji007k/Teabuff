import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";

const OfferSlider = () => {

  const Navigate = useNavigate();

  return (
    <div className="my-5 offer-slider-wrapper mx-3">
      <div className="shadow-lg rounded overflow-hidden position-relative p-2 p-md-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          navigation={{
            nextEl: ".offer-slider-wrapper .swiper-button-next",
            prevEl: ".offer-slider-wrapper .swiper-button-prev",
          }}
          className="bg-white"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between px-3 px-md-5 py-4 bg-light">
              {/* Text */}
              <div
                className="text-center text-md-start mb-4 mb-md-0"
                style={{ maxWidth: "450px" }} // slightly wider on desktop
              >
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Logo"
                  className="mb-3 img-fluid"
                  style={{ maxHeight: "50px" }} // bigger logo for desktop
                />
                <h2 className="h4 fw-semibold text-dark">
                  Exclusive <span className="text-danger fw-bold">Collection</span>
                </h2>
                <p className="text-muted mt-2 fs-6">
                  Get the latest fashion at the best prices.
                </p>
                <button onClick={()=>Navigate('/Menu')} className="btn btn-warning mt-3 px-4 py-2 shadow-sm">
                  Shop Now
                </button>
              </div>

              {/* Images */}
              <div className="d-flex justify-content-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Blue Dress"
                  className="img-fluid rounded shadow"
                  style={{
                    maxWidth: "48%",
                    maxHeight: "320px", // taller images for desktop
                    objectFit: "cover",
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Red Dress"
                  className="img-fluid rounded shadow"
                  style={{
                    maxWidth: "48%",
                    maxHeight: "320px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div
              className="d-flex flex-column flex-md-row align-items-center justify-content-between px-3 px-md-5 py-4"
              style={{ background: "linear-gradient(to right, #fff, #f8d7da)" }}
            >
              {/* Text */}
              <div
                className="text-center text-md-start mb-4 mb-md-0"
                style={{ maxWidth: "450px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Logo"
                  className="mb-3 img-fluid"
                  style={{ maxHeight: "50px" }} // bigger logo for desktop
                />
                <h2 className="h4 fw-semibold text-dark">
                  Summer <span className="text-danger fw-bold">Sale</span>
                </h2>
                <p className="text-muted mt-2 fs-6">
                  50% off for All Tea.
                </p>
                <button className="btn btn-warning mt-3 px-4 py-2 shadow-sm">
                  <ScrollLink to="Fresh_Tea" offset={-145}>Shop Now</ScrollLink>
                </button>
              </div>

              {/* Images */}
              <div className="d-flex justify-content-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Green Outfit"
                  className="img-fluid rounded shadow"
                  style={{
                    maxWidth: "48%",
                    maxHeight: "320px",
                    objectFit: "cover",
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Yellow Outfit"
                  className="img-fluid rounded shadow"
                  style={{
                    maxWidth: "48%",
                    maxHeight: "320px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Scoped arrows (desktop only) */}
        <div className="d-none d-md-block">
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </div>
  );
};

export default OfferSlider;
