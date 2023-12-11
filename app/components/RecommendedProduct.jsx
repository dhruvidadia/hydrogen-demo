import {Image, Money} from '@shopify/hydrogen';
import {useState} from 'react';
import {Link} from '@remix-run/react';
import { CardHeader } from "@material-tailwind/react";
const RecommendedProduct = ({products}) => {
    const Recomproducts = products.nodes?.productRecommendations;
    return (
      <>
      <div>
        <h2 className='text-2xl'>You May Also Like</h2>  
        <p>Take a moment to explore selections tailored just for you.</p>
        <div className="grid lg:grid-cols-5 gap-4 grid-cols-2">
        {Recomproducts.map((product) => {
          const [over, setOver] = useState(false);
          const isMultiImg = product?.images?.edges.length > 1 ? true : false
          return(
            <div
            className="overflow-hidden cursor-pointer relative group"
        >
          <Link
              className="product-item hover:no-underline"
              key={"recom-"+product.id}
              prefetch="intent"
              to={'/products/'+product.handle}
            >
          <CardHeader shadow={true} floated={false} className="h-86"
          onMouseOver={() => setOver(true)}
          onMouseOut={() => setOver(false)}
          >
          { product.availableForSale ? (
            <span className="text-xs font-medium px-3 py-1 bg-green-600 text-white">In Stock</span> ) : 
            <span className="text-xs font-medium px-3 py-1 bg-red-600 text-white">Sold Out</span>
          }
          { product?.variants?.nodes[0].compareAtPrice?.amount && (
            <span className="text-xs font-medium px-3 py-1 bg-pink-900 text-white ml-2.5">Sale</span> )
          }
          <Image 
          src={over && isMultiImg ? product?.images?.edges[1]?.node.url : product?.images?.edges[0]?.node.url }
          alt={product.title}
          sizes="(min-width: 45em) 20vw, 50vw"
          aspectRatio="1/1"
          />
          </CardHeader>
          <p className='pt-2'>{product.title}</p>
          <div color="blue-gray" className="font-medium">
            {product?.variants?.nodes[0].compareAtPrice?.amount ? (
              <>
                <div className="flex">
                  {product?.variants?.nodes[0].price?.amount ? <Money className='mr-1' data={product?.variants.nodes[0]?.price} /> : null}
                  <span className="inline-block text-base font-normal text-red-600 line-through dark:text-red-600 text-sm mt-1"><Money data={product?.variants?.nodes[0].compareAtPrice} /></span>
                </div>
              </>
            ) : (
              <Money data={product?.variants.nodes[0]?.price} />
            )}
            </div>
          </Link>
        </div>
          )
        })}
        </div>
      </div>
      </>
      )

}
export default RecommendedProduct;