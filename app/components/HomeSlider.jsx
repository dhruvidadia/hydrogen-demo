// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Image } from '@shopify/hydrogen';


// import required modules
import { EffectCoverflow, Pagination,Navigation, Autoplay } from 'swiper/modules';

const HomeSlider = () => {
    return (
        <>
        <div>
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={true}
            pagination={{
              type: 'progressbar',
            }}
            scrollbar={{ draggable: true }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="mySwiper swiper-scrollbar-horizontal"
          >
            <SwiperSlide>
            <Image
              alt="Slide 1"
              src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/slide1.jpg?v=1697781952"
              key={`slide-1`}
              width={1920}
            />
            </SwiperSlide>
            <SwiperSlide>
            <Image
              alt="Slide 2"
              src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/slide2.jpg?v=1697781953"
              key={`slide-2`}
              width={1920}
            />
            </SwiperSlide>
            <SwiperSlide>
            <Image
              alt="Slide 3"
              src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/slide3.jpg?v=1697781952"
              key={`slide-3`}
              width={1920}
            />
            </SwiperSlide>
            <SwiperSlide>
            <Image
              alt="Slide 4"
              src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/slide4.jpg?v=1697781952"
              key={`slide-4`}
              width={1920}
            />
            </SwiperSlide>
          </Swiper>
        </div>
        </>
      );
}

export default HomeSlider;