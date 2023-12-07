import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  VariantSelector,
  Money,
} from '@shopify/hydrogen';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {useVariantUrl} from '~/utils';
import QuickView from '~/components/QuickView';
import { useState } from 'react';


export const meta = ({data}) => {
  return [{title: `Coconut | ${data.collection.title} Collection`}];
};


export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 32,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <div className="collection">
      <h1 className='px-4'>{collection.title}</h1>
      <p className='px-4 py-4'>{collection.description}</p>
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          
          <>
            <div className='text-center text-xl'>
              <PreviousLink>
                {isLoading ? 
                  <div className="flex items-center justify-center">
                      <div className="relative">
                          <div className="h-8 w-8 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                          <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-t-8 border-b-8 border-[#0a56a5] animate-spin">
                          </div>
                      </div>
                  </div>
                : <span>↑ Load previous</span>}
              </PreviousLink>
            </div>
            <ProductsGrid products={nodes} />
            <br />
            <div className='text-center text-xl'>
              <NextLink>
                {isLoading ? 
                  <div className="flex items-center justify-center">
                      <div className="relative">
                          <div className="h-8 w-8 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                          <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-t-8 border-b-8 border-[#0a56a5] animate-spin">
                          </div>
                      </div>
                  </div>
                : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </>
        )}
      </Pagination>
    </div>
  );
}

function ProductsGrid({products}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <EcommerceCard
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function EcommerceCard({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  const [over, setOver] = useState(false);
  const isMultiImg = product?.images?.edges.length > 1 ? true : false
  return (
    <Card className="w-96 py-4 relative overflow-hidden" 
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
    >
      <Link
        className="product-item px-4"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
      <CardHeader shadow={false} floated={false} className="h-96">
      { product.availableForSale ? (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-600 text-white">In Stock</span> ) : 
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-600 text-white">Sold Out</span>
      }
      { product?.variants?.nodes[0].compareAtPrice?.amount && (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-pink-900 text-white ml-2.5">Sale</span> )
      }
        {product?.images?.edges.length && (
          <Image
            alt={product.title}
            aspectRatio="1/1"
            src={over && isMultiImg ? product?.images?.edges[1]?.node.url : product?.images?.edges[0]?.node.url }
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className='mt-2'
          />
        )}
      </CardHeader>
      </Link>
      <CardBody className='px-4'>
        <div className="mb-2 flex items-center justify-between">
          <Typography color="blue-gray" className="font-medium">
          
          <Link
            className="product-item"
            key={product.id}
            prefetch="intent"
            to={variantUrl}
          >
            {product.title}
          </Link>
          
          </Typography>
          <Typography color="blue-gray" className="font-medium">
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
          </Typography>
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
  );
}


const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    availableForSale
    id
    handle
    title
    description
    options {
      name
      values
    }
    images(first:2){
      edges{
        node{
          url
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 250) {
      nodes {
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
  } 
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        reverse: true
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;
