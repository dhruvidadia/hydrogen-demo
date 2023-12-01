// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Image } from '@shopify/hydrogen';
import {Zoom, Pagination, Navigation } from 'swiper/modules';

const GallarySlider = ({image,thumbnails}) => {
    return (
        <>
        {thumbnails && (
         <Swiper
         initialSlide={3}
         slidesPerView={1}
         spaceBetween={30}
         pagination={{
           clickable: true,
         }}
         zoom={true}
         navigation={true}
         modules={[Zoom, Pagination, Navigation]}
         className="mySwiper"
       >
            <SwiperSlide>
                <div className="swiper-zoom-container">
                    <Image
                      alt={image.altText || 'Product Image'}
                      aspectRatio="1/1"
                      data={image}
                      key={image.id}
                      sizes="(min-width: 45em) 50vw, 100vw"
                    />
              </div>
            </SwiperSlide>
          {thumbnails.map((img) => {
            return(
              <SwiperSlide>
                <div className="swiper-zoom-container">
                  <Image
                  alt={'Product Image'}
                  aspectRatio="1/1"
                  src={img?.node?.url}
                  sizes="(min-width: 45em) 50vw, 100vw"
                  style={{cursor:'move'}}
                />
              </div>
            </SwiperSlide>
            )
            
          })}
          
          </Swiper>
      )} 
        </>
      );
}

export default GallarySlider;