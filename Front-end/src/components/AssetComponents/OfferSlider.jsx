import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../../style/embla-carousel.css";

const OfferSlider = ({ setHideNavbar }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const Navigate = useNavigate();

  // --- Autoplay ---
  const autoplayRef = useRef(null);
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = () => {
      autoplayRef.current = setInterval(() => {
        emblaApi && emblaApi.scrollNext();
      }, 4000);
    };
    autoplay();

    return () => clearInterval(autoplayRef.current);
  }, [emblaApi]);

  return (
    <div className="my-4 mx-3 offer-slider-wrapper">
      <div
        className="shadow-lg rounded overflow-hidden position-relative embla"
        ref={emblaRef}
        onClick={() => setHideNavbar(false)}
      >
        <div className="embla__container">
          {/* Slide 1 */}
          <div className="embla__slide bg-light position-relative">
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1920&auto=format&fit=crop"
              alt="Collection Offer"
              className="w-100 img-fluid offer-image"
            />

            {/* Text Overlay */}
            <div className="offer-overlay text-center text-dark">
              <h2 className="offer-title">
                Exclusive <span className="text-danger fw-bold">Collection</span>
              </h2>
              <p className="offer-subtext">
                Get the latest fashion at the best prices.
              </p>
              <button
                onClick={() => Navigate("/Menu")}
                className="btn btn-warning mt-2 px-3 py-1 shadow-sm offer-button"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="embla__slide position-relative">
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1920&auto=format&fit=crop"
              alt="Summer Sale"
              className="w-100 img-fluid offer-image"
            />

            {/* Text Overlay */}
            <div className="offer-overlay text-center text-dark">
              <h2 className="offer-title">
                Summer <span className="text-danger fw-bold">Sale</span>
              </h2>
              <p className="offer-subtext">50% off on all Tea!</p>
              <button className="btn btn-warning mt-2 px-3 py-1 shadow-sm offer-button">
                <ScrollLink to="Fresh_Tea" offset={-145} smooth>
                  Shop Now
                </ScrollLink>
              </button>
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
