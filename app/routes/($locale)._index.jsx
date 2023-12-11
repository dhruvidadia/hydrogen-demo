import {defer, json} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {Image, Money, VariantSelector} from '@shopify/hydrogen';
import HomeSlider from '~/components/HomeSlider';
import MasonryCollection from '~/components/MasonryCollection';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import QuickView from '~/components/QuickView';
import Testimonials from '~/components/Testimonials';


export const meta = () => {
  return [{title: 'Coconut | Home'}];
};

export const action = async ({request,context}) => {
  const {storefront, session} = context;
  const form = await request.formData();
  const email = String(form.has('email') ? form.get('email') : '');
  const acceptsMarketing = true;

  console.log(email)
  try {
    const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
        variables: {
          input: {email, acceptsMarketing},
        },
      });

      if (customerCreate?.userErrors?.length) {
        throw new Error(customerCreate?.userErrors[0].message);
      }
      return json(
        {error: null},
      );

} catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
  
}
export async function loader({context}) {
  const {storefront} = context;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  const masonryCollections = await storefront.query(MASONRY_COLLECTION_QUERY);
  return defer({recommendedProducts, masonryCollections});
}

export default function Homepage() {
  const data = useLoaderData();
  return (
    <div className="home">
      <HomeSlider /> 
      <br />
      <MasonryCollection items={data.masonryCollections?.collections?.nodes} />
      <br />
      <StaticBlock />
      <br />
      <RecommendedProducts products={data.recommendedProducts} />
      <Testimonials />
    </div>
  );
}

function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended <mark className="px-2 text-white bg-[#0a56a5] rounded dark:bg-[#0a56a5]">Products</mark></h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product,index) => {
                const [over, setOver] = useState(false);
                const isMultiImg = product?.images?.edges.length > 1 ? true : false
                return(
                  <>
               <Card className="w-96 py-4 relative overflow-hidden" 
               data-aos="fade"
               data-aos-once="true"
               key={'product-'+index}
               onMouseOver={() => setOver(true)}
               onMouseOut={() => setOver(false)}
               >
                  <Link
                    key={index+product.id}
                    to={`/products/${product.handle}`}
                  >
                  <CardHeader shadow={false} floated={false} className="h-96 hover:no-underline">
                  { product.availableForSale ? (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-600 text-white ml-2.5">In Stock</span> ) : 
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-600 text-white ml-2.5">Sold Out</span>
                  }
                  { product?.variants?.nodes[0].compareAtPrice?.amount && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-pink-900 text-white ml-2.5">Sale</span> )
                  }
                    <Image
                      src={over && isMultiImg ? product?.images?.edges[1].node.url : product?.images?.edges[0].node.url }
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                      className='p-8 rounded-t-lg hover:no-underline'
                      alt={product.title}
                    />
                  </CardHeader>
                  </Link>
                  <CardBody className='px-4'>
                    <div className="mb-2 flex items-center justify-between">
                      <Typography color="blue-gray" className="font-medium">
                      
                      <Link
                        key={`title-`+product.id}
                        to={`/products/${product.handle}`}
                        >
                        {product.title}
                      </Link>
                      
                      </Typography>
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
                    </div>
                    <VariantSelector
                        handle={product.handle}
                        options={product.options}
                        variants={product?.variants.nodes}
                    >   
                        {({option}) => 
                              
                              <div className="flex flex-wrap -mb-2">
                                {option.values.map(({value, isAvailable, isActive, to}) => {
                                  const lowerval = value.toLowerCase();
                                  const lowername = option.name.toLowerCase();
                                  return (
                                    <div className='mr-1'>
                                      {lowername == 'color' && (
                                         <label className={`capitalize text-center py-1 mb-2 w-8 hover:border-blue-400 dark:border-[#0a56a5] hover:text-[#0a56a5] dark:hover:border-gray-300 dark:text-gray-400 hover:no-underline`}
    
                                        style={
                                          {
                                          border: isActive,
                                          opacity: isAvailable ? 1 : 0.3,
                                        }}
                                        key={'main-'+option.name+value}
                                        >
                                          
                                            <Link
                                              className=''
                                              key={option.name + value}
                                              prefetch="intent"
                                              preventScrollReset
                                              replace
                                              to={to}
                                              
                                            >
                                              <div className="border border-gray-400 rounded-full w-6 h-6 rounded-full hover:opacity-[0.8]" style={
                                                {
                                                  backgroundColor: lowerval,
                                                  border: isActive ? '3px solid #0a56a5': '' 
                                                }}></div>
                                          </Link>
                                           
                                        </label>
                                      )}
                                    </div>
                                    
                                  );
                                })}
                              </div>
                            
                        }
                    </VariantSelector>
                    
                  </CardBody>
                    <QuickView product={product} />
                </Card>
                </>
                );
                
              })}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

function StaticBlock () {
  return (
    
    <section className="bg-center bg-no-repeat bg-[url('https://cdn.shopify.com/s/files/1/0570/4335/3681/files/conference.jpg?v=1697792736')] bg-gray-700 bg-blend-multiply"
    data-aos="fade"
    data-aos-once="true"
    >
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">We invest in the world’s potential</h1>
            <div className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">We focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Link
                  className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#0a56a5] group hover:no-underline"
                  to="/collections"
                >
                  <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#0a56a5] hover:no-underline group-hover:h-full"></span>
                  <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                  <svg 
                  className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                  <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                  <span className="relative w-full text-left transition-colors duration-200 ease-in-out  group-hover:text-white">Get started</span>
                </Link>
            </div>
        </div>
    </section>

  );
}

const MASONRY_COLLECTION_QUERY = `#graphql

fragment MasonryCollections on Collection {
  id
  title
  handle
  description
  image {
    id
    url
    altText
    width
    height
  }
}

query MasonryCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 12, reverse: true) {
      nodes {
        ...MasonryCollections
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    availableForSale
    id
    title
    handle
    description 
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      } 
    }
    options {
      name
      values 
    }
    images(first: 2) {
      edges{
        node {
        url
        altText
        width
        height
      }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true, query:"tag:recommendedproduct") {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate(
    $input: CustomerInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;