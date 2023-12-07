import {Suspense, useState, useEffect,useRef} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData, useActionData} from '@remix-run/react';
import {ShopPayButton} from '@shopify/hydrogen-react';
import ProductTabs from '~/components/ProductTabs';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Zoom, Pagination, Navigation } from 'swiper/modules';
import {json} from '@shopify/remix-oxygen';
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/utils';
import { Button } from '@material-tailwind/react';

export const meta = ({data}) => {
  return [{title: `Coconut | ${data.product.title}`}];
};

    
export const action = async ({request}) => {
  if (request.method !== 'POST') {
      return json({error: 'Method not allowed'}, {status: 405});
    }
  
  const form = await request.formData();
  const email = String(form.has('email') ? form.get('email') : '');
  try {
      return json(
        {error: null, msg: true},
      );

  } catch (error) {
      if (error instanceof Error) {
        return json({error: error.message}, {status: 400});
      }
      return json({error}, {status: 400});
    }
}


export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;

  const {shop} = await storefront.query(SHOP_URL);

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants, shop});
}

function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", 
    });
  },[])

  const {product, variants, shop} = useLoaderData();
  const {selectedVariant} = product;
  const thumbnails = product.images?.edges;

  const swiperRef = useRef(null)
  useEffect(() => {
    {thumbnails.map((img,index) => {
      img?.node?.url === selectedVariant?.image?.url ? swiperRef.current.swiper.slideTo(index) : '';
    })}
    },[selectedVariant])
    console.log(product)
  return (
    <div>
      <div className="product">
        <div className='gap-4 flex md:grid md:grid-cols-2 md:h-auto place-content-start'>
          <div className="w-[80vw] md:w-full h-full md:h-auto object-cover object-center flex-shrink-0 md:flex-shrink-none snap-start md:col-span-2 border border-gray-200 rounded-lg">
            
            {thumbnails && (
                <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                zoom={true}
                navigation={true}
                modules={[Zoom, Pagination, Navigation]}
                className="mySwiper"
                ref={swiperRef}
              >
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
          </div>
        </div>
        
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          shop={shop}
        />
        
      </div>
    <ProductTabs product={product} />
    <CustomBlock />
    </div>
    
  );
}

function CustomBlock() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="gap-16 items-center px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:px-6">
        <div className="mb-4 text-gray-700 dark:text-gray-400">
              <h2  className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Lorem ipsum dolor sit amet</h2>
              <p  className="mb-4">We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.</p>
              <p>We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
              <Image  className="w-full rounded-lg" src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/office-long-1.png?v=1698993250" alt="office content 1" width={284} height={394} />
              <Image  className="mt-4 w-full lg:mt-10 rounded-lg" src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/office-long-2.png?v=1698993250" alt="office content 2" width={284} height={394}  />
          </div>
    </div>
    <div className="gap-16 items-center px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2  lg:px-6">
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Image  className="w-full rounded-lg" src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/office-long-1.png?v=1698993250" alt="office content 1" width={284} height={394} />
            <Image  className="mt-4 w-full lg:mt-10 rounded-lg" src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/office-long-2.png?v=1698993250" alt="office content 2" width={284} height={394}  />
        </div>
        <div className="mb-4 text-gray-700 dark:text-gray-400">
              <h2  className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Lorem ipsum dolor sit amet</h2>
              <p  className="mb-4">We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.</p>
              <p>We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick.</p>
          </div>
          
    </div>
  </section>
  );
}

function ProductMain({selectedVariant, product, variants,shop}) {
  const [Qty, setQty] = useState(1);
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      
      <h2 className="mt-2 mb-6 text-xl font-bold dark:text-gray-300 md:text-3xl">{title} <span className="text-lg font-medium text-rose-500 dark:text-rose-200">New</span></h2>
      
      <div className="mb-4 text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
     
      <div className="p-4 mb-8 border border-gray-300 dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold dark:text-gray-400">Spooky discount <span
                  className="px-2 bg-[#0a56a5] text-gray-50">10% off</span>
                  </h2>
          { product.availableForSale ? (
            <>
          <div className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-400">
              Hurry up! very few left in Stock
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5  dark:bg-gray-600">
          <div className="bg-[#0a56a5] dark:bg-[#0a56a5] h-2.5 rounded-full" style={{width: '45%'}}></div>
          </div>
          </>
          ) :
          <>
          <div className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-400">
          Sorry! we are temporarily out of Stock
          </div> 
          <div className="w-full bg-gray-200 rounded-full h-2.5  dark:bg-gray-600">
              <div className="bg-[#0a56a5] dark:bg-[#0a56a5] h-2.5 rounded-full" style={{width: '99%'}}></div>
          </div>
          </> 
          }
          
      </div>
      <div className='flex items-center'>
        <ProductPrice selectedVariant={selectedVariant} />

        <div className="py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700" style={{marginLeft: '25px'}}>
          <div className="w-full flex justify-between items-center gap-x-5">
            <div className="grow">
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Select quantity
              </span>
              <span className='w-full p-0 bg-transparent border-0 text-black-800 focus:ring-0 dark:text-white'>{Qty}</span>
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              <button type="button" className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" onClick={() => setQty((Qty) => Qty - 1)} name="decrease-quantity" disabled={Qty <= 1}>
                <svg className="flex-shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
              </button>
              <button type="button" className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" name="increase-quantity" onClick={() => setQty((Qty) => Qty + 1)} >
                <svg className="flex-shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
            shop={shop}
            qty = {Qty}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
              shop={shop}
              qty = {Qty}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function ProductPrice({selectedVariant}) {
  return (
    <div className="product-price pb-3">
      {selectedVariant?.compareAtPrice ? (
        <>
        <p className="inline-block text-2xl font-semibold text-black dark:text-black ">
        {selectedVariant ? <Money className='inline-block' data={selectedVariant.price} /> : null}
            <span
                className="inline-block text-base font-normal text-red-600 line-through dark:text-red-600 p-2"><Money data={selectedVariant.compareAtPrice} /></span>
        </p>
        </>
      ) : (
        <p className="inline-block text-2xl font-semibold text-black dark:text-black ">  <Money data={selectedVariant?.price} /> </p>
      )}
    </div>
  );
}

function ProductForm({product, selectedVariant, variants,shop, qty}) {
  const action = useActionData();
  const showMessage = (action?.msg) ? action.msg : false;
  return (
    <div className="product-form">
      { variants.length > 1 && (
        <div>
      <div className='pb-4 mb-6 border-b border-gray-300 dark:border-gray-700' ></div>
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        > 
          {({option}) => <ProductOptions key={option.name} option={option} />}
        </VariantSelector>
      </div>
      )}
      <div className='pb-4 mb-6 border-b border-gray-300 dark:border-gray-700' ></div>
      <div className='flex'>
      {selectedVariant?.availableForSale ? (
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            window.location.href = window.location.href + '#cart-aside';
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: qty,
                  },
                ]
              : []
          }
        >
          Add to cart
        </AddToCartButton> ) : 
        <>
        <form method='POST'>
        <span className="text-sm font-medium me-2  rounded text-rose-500 dark:text-rose-200">Sorry! we are temporarily out of Stock</span>
            <div className="items-center sm:flex sm:space-y-0 mt-5">
                <div className="relative z-0">
                  <input type="email" name="email" id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required placeholder=" " />
                  <label for="floating_standard" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter your email</label>
              </div>
              <div>
              <Button
                type="submit"
                className="flex flex-items items-center ml-3 text-white bg-[#0a56a5] uppercase shadow-sm hover:bg-[#0a56a5] hover:no-underline shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 w-40 h-10 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              >
                <svg className="mr-3 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C17 15.4 17 16 16.462 16H3.538C3 16 3 15.4 3 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 10 3.464ZM1.866 8.832a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M6.54 16a3.48 3.48 0 0 0 6.92 0H6.54Z"/>
                </svg>
                <span>Notify Me</span>
              </Button>
              </div>
            </div>
            { showMessage == true && (

            <div className="mb-4 text-sm text-green-800 rounded-sm dark:bg-gray-800 dark:text-green-400">
                Thanks! We will notify you soon.
            </div>

            )}
          </form>
        </>
        }
        {/* {selectedVariant.availableForSale && (
          <ShopPayButton
            className='px-4'
            storeDomain={shop.primaryDomain.url}
            variantIds={[selectedVariant?.id]}
            width={'400px'}
          />
        )} */}
      </div>
    </div>
  );
}

function ProductOptions({option}) {
  return (
    <div className="pb-6 mb-4 dark:border-gray-700" key={option.name}>
      <h2 className="mb-2 text-xl font-bold dark:text-gray-400">{option.name}</h2>
      <div className="flex flex-wrap -mb-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          const lowerval = value.toLowerCase();
          const lowername = option.name.toLowerCase();
          return (
            <Link
                  className='hover:no-underline'
                  key={option.name + value}
                  prefetch="intent"
                  preventScrollReset
                  replace
                  to={to}
                  
                >
            <div className={`capitalize text-center justify-center  w-11 hover:border-blue-400 dark:border-[#0a56a5] hover:text-[#0a56a5] dark:hover:border-gray-300 dark:text-gray-400  ${
              lowername != 'color' ? "mr-1 border border-gray-400 text-xs font-medium x-3 py-0.5 rounded-full" : "py-1 mb-2"
            }  ${isAvailable || lowername == 'color' ? '' : "op-disabled"}`}

            style={
              {
              border: isActive && lowername != 'color'  ? '3px solid #0a56a5' : '',
              opacity: isAvailable ? 1 : 0.8,
           }}
            key={'main-'+option.name}
            >
              {lowername == 'color' ? ( 
                  <div className="border border-gray-400 rounded-full w-8 h-8 rounded-full hover:opacity-[0.8]"  style={
                    {
                      backgroundColor: lowerval,
                      border: isActive ? '3px solid #0a56a5': '',
                      cursor: !isAvailable  ? 'not-allowed': '',
                    }}></div>             
              ) : <>
              {value}
              </> 
              }                
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}fetch

function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="flex flex-row items-center justify-center border border-[#0a56a5] rounded-xl w-full px-8 py-3 text-white bg-[#0a56a5] uppercase shadow-sm hover:bg-[#0a56a5] hover:no-underline shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            <svg className="mr-3 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z"/>
            </svg>
            <span>{children}</span>
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    availableForSale
    media(first: 6) {
      edges {
        node {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Video {
            mediaContentType
            id
            previewImage {
              url
            }
            sources {
              mimeType
              url
            }
          }
          ... on ExternalVideo {
            mediaContentType
            id
            embedUrl
            host
          }
          ... on Model3d {
            mediaContentType
            id
            alt
            mediaContentType
            previewImage {
              url
            }
            sources {
              url
            }
          }
        }
      }
    }
    images(first:8){
      edges{
        node{
          url
        }
      }
    }
    options {
      name
      values
    }
    Specifications: metafield(namespace: "custom", key: "details") {
      value
      type
    }
    Material: metafield(namespace: "custom", key: "material") {
      value
      type
    }
    Features: metafield(namespace: "custom", key: "features") {
      value
      type
    }
   
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT} 
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const SHOP_URL = `#graphql
query {
  shop {
    primaryDomain {
      url
    }
  }
}`;
const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;
