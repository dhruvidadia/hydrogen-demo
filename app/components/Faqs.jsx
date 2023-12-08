import { Image } from '@shopify/hydrogen';

const Faqs = ({content,title}) => {
  return (
    <section className='felx items-center justify-center' 
    data-aos="zoom-in-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="500"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false"
    >
    <h1 className="text-center justify-center">{title}</h1>
    <div className="bg-gray-50 flex rounded-2x1 shadow-lg max-w-2xl p-5 py-8 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-6">
        <div className='px-16 sm:block hidden'>
            <Image
                src='https://cdn.shopify.com/s/files/1/0570/4335/3681/files/image.b0c2306b.svg?v=1702019905'
                className="rounded-2x1"
                width={616}
                height={413}
            />
        </div>  
        <div className='sm:w-1/2'>
            <main dangerouslySetInnerHTML={{__html: content}} />
        </div>
    </div>
    </section>
  );
}

export default Faqs;