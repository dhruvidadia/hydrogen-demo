import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  getSelectedProductOptions,
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


export const meta = ({data}) => {
  return [{title: `Coconut | ${data.collection.title} Collection`}];
};


export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
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

function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

function EcommerceCard({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Card className="w-96 py-4 relative overflow-hidden" 
    // data-aos="flip-left"
    // data-aos-offset="200"
    // data-aos-delay="50"
    // data-aos-duration="500"
    // data-aos-easing="ease-in-out"
    // data-aos-mirror="true"
    // data-aos-once="false"
    >
      <Link
        className="product-item px-4"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
      <CardHeader shadow={false} floated={false} className="h-96">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
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
            <Money data={product.priceRange.minVariantPrice} />
          </Typography>
        </div>
        {/* <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75 product-des"
        >
          {product.description}
        </Typography> */}
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
    id
    handle
    title
    description
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
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
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
