import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../../style/embla-carousel.css"; // You can make your own css

const OfferSlider = ({ setHideNavbar }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const Navigate = useNavigate();

  // Optional autoplay
  const autoplayRef = useRef(null);
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = () => {
      autoplayRef.current = setInterval(() => {
        if (emblaApi) emblaApi.scrollNext();
      }, 3000);
    };

    autoplay();
    return () => clearInterval(autoplayRef.current);
  }, [emblaApi]);

  return (
    <div className="my-5 mx-3 offer-slider-wrapper">
      <div
        className="shadow-lg rounded overflow-hidden position-relative p-2 p-md-4 embla"
        ref={emblaRef}
        onClick={() => setHideNavbar(false)}
      >
        <div className="embla__container">
          {/* Slide 1 */}
          <div className="embla__slide bg-light">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between px-3 px-md-5 py-4">
              {/* Text */}
              <div
                className="text-center text-md-start mb-4 mb-md-0"
                style={{ maxWidth: "450px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Logo"
                  className="mb-3 img-fluid"
                  style={{ maxHeight: "50px" }}
                />
                <h2 className="h4 fw-semibold text-dark">
                  Exclusive{" "}
                  <span className="text-danger fw-bold">Collection</span>
                </h2>
                <p className="text-muted mt-2 fs-6">
                  Get the latest fashion at the best prices.
                </p>
                <button
                  onClick={() => Navigate("/Menu")}
                  className="btn btn-warning mt-3 px-4 py-2 shadow-sm"
                >
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
                    maxHeight: "320px",
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
          </div>

          {/* Slide 2 */}
          <div
            className="embla__slide"
            style={{ background: "linear-gradient(to right, #fff, #f8d7da)" }}
          >
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between px-3 px-md-5 py-4">
              {/* Text */}
              <div
                className="text-center text-md-start mb-4 mb-md-0"
                style={{ maxWidth: "450px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=687&auto=format&fit=crop"
                  alt="Logo"
                  className="mb-3 img-fluid"
                  style={{ maxHeight: "50px" }}
                />
                <h2 className="h4 fw-semibold text-dark">
                  Summer <span className="text-danger fw-bold">Sale</span>
                </h2>
                <p className="text-muted mt-2 fs-6">50% off for All Tea.</p>
                <button className="btn btn-warning mt-3 px-4 py-2 shadow-sm">
                  <ScrollLink to="Fresh_Tea" offset={-145}>
                    Shop Now
                  </ScrollLink>
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
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          className="embla__prev d-none d-md-block btn btn-light position-absolute top-50 start-0 translate-middle-y shadow"
          onClick={() => emblaApi && emblaApi.scrollPrev()}
        >
          ‹
        </button>
        <button
          className="embla__next d-none d-md-block btn btn-light position-absolute top-50 end-0 translate-middle-y shadow"
          onClick={() => emblaApi && emblaApi.scrollNext()}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default OfferSlider;

