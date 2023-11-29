import {defer, json} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
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
import ThumbSlider from '~/components/ThumbSlider';

export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
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
      console.log("TRY blockkkk")
      return json(
        {error: null},
      );

} catch (error) {
  console.log("Errorrrrrr")
  
    if (error instanceof Error) {
      console.log(error.message)
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
  
}
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  const masonryCollections = await storefront.query(MASONRY_COLLECTION_QUERY);

  return defer({featuredCollection, recommendedProducts, masonryCollections});
}

export default function Homepage() {
  const data = useLoaderData();
  return (
    <div className="home">
      <HomeSlider /> 
      <br />
      <MasonryCollection items={data.masonryCollections?.collections?.nodes} />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <br />
      <StaticBlock />
      <br />
      <RecommendedProducts products={data.recommendedProducts} />
      <ThumbSlider />
    </div>
  );
}

function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
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
              {products.nodes.map((product,index) => (
               <Card className="w-96 py-4 relative overflow-hidden" 
               data-aos="flip-left"
               data-aos-offset="200"
               data-aos-delay="50"
               data-aos-duration="500"
               data-aos-easing="ease-in-out"
               data-aos-mirror="true"
               data-aos-once="false"
               key={'product-'+index}
               >
                  <Link
                    key={index+product.id}
                    to={`/products/${product.handle}`}
                  >
                  <CardHeader shadow={false} floated={false} className="h-96">
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                      className='p-8 rounded-t-lg'
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
                        <Money data={product.priceRange.minVariantPrice} />
                      </div>
                    </div>
                  </CardBody>
                    <QuickView product={product} />
                </Card>
              ))}
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
    data-aos="fade-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="500"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false"
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

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description 
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
      } 
    }
    options {
      name
      values 
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
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