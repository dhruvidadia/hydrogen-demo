import { Image } from '@shopify/hydrogen';
import { Button } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

const MasonryCollection = ({items}) => {
    return (
        <div className='custom-collection'>
            
            <h2>Featured <mark className="px-2 text-white bg-[#0a56a5] rounded dark:bg-[#0a56a5]">Collection</mark></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item) => {
                
                    return (
                            <Link to={`/collections/${item.handle}`} key={item.id}>
                                <div
                                    className="overflow-hidden  aspect-video bg-red-400 cursor-pointer rounded-xl relative group"
                                >
                                    <div
                                        className="rounded-xl z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex items-end"
                                    >
                                        <div>
                                            <div
                                                className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out"
                                            >
                                                <div className="font-bold">{item.title}</div>
                                                <div className="opacity-60 text-sm">
                                                    <Button
                                                        size="lg"
                                                        variant="text"
                                                        className="font-bold flex items-center gap-x-2 capitalize"
                                                        >
                                                        Show Products
                                                        <svg
                                                            width="7"
                                                            height="12"
                                                            viewBox="0 0 7 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                            d="M1.25 1.91669L5.33333 6.00002L1.25 10.0834"
                                                            stroke="#212121"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        <Image
                                            alt={item.title}
                                            className="object-cover w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out"
                                            src={item.image.url} 
                                            width={397}
                                            height={223}
                                        />
                                
                                </div>
                             </Link>
                    )
                     
                })}

            </div>
        </div>

    ); 
}

export default MasonryCollection;