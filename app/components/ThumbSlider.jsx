import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

const ThumbSlider = () => {
    return (
        <>
        <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
            alt="Transistor"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
            alt="Reform"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
            alt="Tuple"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
            alt="SavvyCal"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
            alt="Statamic"
            width={158}
            height={48}
          />
        </div>
      </div>
    </div>
        <div className='pt-6 mt-8 bg-gray-50 shadow-lg' >
            <p className='text-center justify-center tracking-tight font-bold text-gray-900 dark:text-white'>Our Team</p>
            <h2 className='text-center justify-center mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white pb-3'>Who we are
            </h2>
            <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={false}
            slidesPerView={6}
            coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
        >
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u1.jpg?v=1699006718" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u2.jpg?v=1699006717" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u3.jpg?v=1699006719" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u4.jpg?v=1699006718" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u5.jpg?v=1699006717" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u6.jpg?v=1699006717" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u7.jpg?v=1699006718" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u8.jpg?v=1699006717" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u9.jpg?v=1699006718" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u10.jpg?v=1699006718" width={273} height={273} />
            </SwiperSlide>
            <SwiperSlide>
            <img src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/u1.jpg?v=1699006718" width={273} height={273} />
            </SwiperSlide>
        </Swiper>
        </div>
        
      </>
      );
}

export default ThumbSlider; 