"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight, FaHeart, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 70;
  const maxGap = 110;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}) => {
  // Color & font config
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 6000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [activeIndex, testimonialsLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.45;
    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.7,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.7,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(0px) translateY(0px) scale(0.5) rotateY(0deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  // Framer Motion variants for quote
  const quoteVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="w-full max-w-[64rem] p-3 sm:p-6 md:p-8">
      <div className="grid gap-7 sm:gap-10 md:gap-16 md:grid-cols-12 items-center">
        {/* Images */}
        <div
          className="relative w-full h-[15rem] sm:h-[18rem] md:h-[26rem] md:col-span-5 flex items-center justify-center"
          style={{ perspective: "1200px" }}
          ref={imageContainerRef}
        >
          {testimonials.map((testimonial, index) => (
            <img
              key={testimonial.id ?? `${testimonial.name}-${index}`}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute w-[80%] h-[80%] object-cover rounded-[1.5rem] shadow-[0_15px_35px_rgba(15,23,42,0.15)] border border-slate-100"
              data-index={index}
              style={getImageStyle(index)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between md:col-span-7 h-full min-h-0 md:min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Header with Logo */}
                <div className="flex items-center gap-4 mb-4">
                  {activeTestimonial.logoSvg && (
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2.5 shadow-[0_4px_12px_rgba(15,23,42,0.03)] shrink-0">
                      {activeTestimonial.logoSvg}
                    </div>
                  )}
                  <div>
                    <h3
                      className="font-bold tracking-tight"
                      style={{ color: colorName, fontSize: fontSizeName }}
                    >
                      {activeTestimonial.name}
                    </h3>
                    <p
                      className="font-semibold tracking-wider text-[11px] uppercase mt-0.5"
                      style={{ color: colorDesignation }}
                    >
                      {activeTestimonial.designation}
                    </p>
                  </div>
                </div>

                {/* Testimony Quote with animate word blur */}
                <motion.p
                  className="leading-relaxed mb-6 font-medium italic min-h-[4rem] md:min-h-[5rem]"
                  style={{ color: colorTestimony, fontSize: fontSizeQuote }}
                >
                  "
                  {activeTestimonial.quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{
                        filter: "blur(8px)",
                        opacity: 0,
                        y: 4,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0.02 * i,
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                  "
                </motion.p>

                {/* Stats Row (if vendor) */}
                {(activeTestimonial.rating || activeTestimonial.baseFollowers || activeTestimonial.productsCount) && (
                  <div className="grid grid-cols-3 gap-2 py-4 my-6 border-t border-b border-white/[0.08] text-left">
                    {activeTestimonial.rating && (
                      <div>
                        <p className="text-[9px] font-bold text-dim uppercase tracking-wider">Rating</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <FaStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black text-soft">{activeTestimonial.rating}</span>
                          <span className="text-[9px] text-dim font-bold">({activeTestimonial.reviews})</span>
                        </div>
                      </div>
                    )}
                    {activeTestimonial.baseFollowers && (
                      <div className="border-l border-white/[0.08] pl-3">
                        <p className="text-[9px] font-bold text-dim uppercase tracking-wider">Followers</p>
                        <p className="text-xs font-black text-soft mt-0.5">
                          {(activeTestimonial.baseFollowers + (activeTestimonial.isFollowed ? 1 : 0)).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {activeTestimonial.productsCount && (
                      <div className="border-l border-white/[0.08] pl-3">
                        <p className="text-[9px] font-bold text-dim uppercase tracking-wider">Hardware</p>
                        <p className="text-xs font-black text-soft mt-0.5">
                          {activeTestimonial.productsCount}+ Items
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons (if vendor) */}
              {(activeTestimonial.onVisit || activeTestimonial.onFollow) && (
                <div className="flex items-center gap-3 mb-6">
                  {activeTestimonial.onVisit && (
                    <button
                      onClick={activeTestimonial.onVisit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98"
                    >
                      Visit Storefront
                    </button>
                  )}
                  {activeTestimonial.onFollow && (
                    <button
                      onClick={activeTestimonial.onFollow}
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-90 ${
                        activeTestimonial.isFollowed
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-800 shadow-sm'
                      }`}
                      title={activeTestimonial.isFollowed ? "Unfollow Brand" : "Follow Brand"}
                    >
                      <FaHeart className={`w-4 h-4 ${activeTestimonial.isFollowed ? 'fill-white' : ''}`} />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <button
              className="w-[2.7rem] h-[2.7rem] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-none shadow-md"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={16} color={colorArrowFg} />
            </button>
            <button
              className="w-[2.7rem] h-[2.7rem] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-none shadow-md"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <FaArrowRight size={16} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;
