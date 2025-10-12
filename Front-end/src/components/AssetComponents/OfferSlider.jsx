import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../../style/embla-carousel.css";

const OfferSlider = ({ HideNavbar, OfferImage1, OfferImage2 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: "start",
    skipSnaps: false,
  });

  const Navigate = useNavigate();
  const autoplayRef = useRef(null);

  // --- Autoplay using requestAnimationFrame ---
  useEffect(() => {
    if (!emblaApi || HideNavbar) return; // ✅ pause autoplay if navbar is open

    let frame;
    let lastTime = performance.now();
    const delay = 4000;

    const play = (time) => {
      if (time - lastTime >= delay) {
        emblaApi.scrollNext();
        lastTime = time;
      }
      frame = requestAnimationFrame(play);
    };

    frame = requestAnimationFrame(play);
    autoplayRef.current = frame;

    return () => cancelAnimationFrame(frame);
  }, [emblaApi, HideNavbar]);

  // --- Pause autoplay when tab is inactive ---
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && autoplayRef.current) {
        cancelAnimationFrame(autoplayRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="my-4 mx-1 offer-slider-wrapper">
      <div className="shadow-lg overflow-hidden position-relative embla" ref={emblaRef}>
        <div className="embla__container will-change-transform">
          {/* Slide 1 */}
          <div className="embla__slide bg-light position-relative">
            <img
              src={OfferImage1}
              alt="Collection Offer"
              className="w-100 img-fluid offer-image"
              loading="lazy"
              decoding="async"
              onClick={() => Navigate("/Menu")}
            />
            {/* <div className="offer-overlay text-center text-dark">
              <button
                onClick={() => Navigate("/Menu")}
                className="btn btn-warning mt-2 px-3 py-1 shadow-sm offer-button"
              >
                Shop Now
              </button>
            </div> */}
          </div>

          {/* Slide 2 */}
          <div className="embla__slide position-relative">
            <img
              src={OfferImage2}
              alt="Summer Sale"
              className="w-100 img-fluid offer-image"
              loading="lazy"
              decoding="async"
              onClick={() => Navigate("/Menu")}
            />
            {/* <div className="offer-overlay text-center text-dark">
              <button className="btn btn-warning mt-2 px-3 py-1 shadow-sm offer-button">
                <ScrollLink to="Fresh_Tea" offset={-120} smooth>
                  Shop Now
                </ScrollLink>
              </button>
            </div> */}
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
