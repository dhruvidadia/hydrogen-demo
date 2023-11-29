import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  
  return (
    <div>
      {isVisible && ( 
        <Button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="light"
        className="!fixed bottom-5 right-5 rounded-full bg-[#0a56a5] p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-[#0a56a5] hover:shadow-lg focus:bg-[#0a56a5] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#0a56a5] z-[10] active:shadow-lg"
        id="btn-back-to-top"
        onClick={BacktoTop}
        >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          className="h-5 w-5"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512">
          <path
            fill="currentColor"
            d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path>
        </svg>
      </Button>
      )}
    </div>
    
  );
}

function BacktoTop(){
    document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Optional if you want to skip the scrolling animation
    });
  }

export default ScrollToTop; 