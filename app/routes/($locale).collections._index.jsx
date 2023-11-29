import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';

// importing aos
import AOS from 'aos';
import { useEffect } from 'react';

export async function loader({context, request}) {
  
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });
  
  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData();
  return (
    <div className="collections">
      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div>
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
            <CollectionsGrid collections={nodes} />
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
          </div>
        )}
      </Pagination>
    </div>
  );
}

function CollectionsGrid({collections}) {
  return (
    <div className="collections-grid-custom">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({collection, index}) {
  return (
    
      <section className="bg-white dark:bg-gray-900">
        {( index %2 == 0 ? 
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12" data-aos="fade-right">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">{collection.title}</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">{collection.description}</p>
              <Link
                className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[#0a56a5] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group hover:no-underline"
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
              >
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-gradient-to-r from-teal-500 to-gradient-500 group hover:no-underline group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                <svg 
                className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Shop Now</span>
              </Link>


            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex relative max-w-md overflow-hidden bg-cover bg-no-repeat">
            <Image
              alt={collection.image.altText || collection.title}
              aspectRatio="1/1"
              data={collection.image}
              className='transition duration-300 ease-in-out hover:scale-110'
              loading={index < 3 ? 'eager' : undefined}
            />
            </div>                
          </div>
        : 
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12" data-aos="fade-left">
            <div className="mr-auto hidden lg:mt-0 lg:col-span-5 lg:flex relative max-w-md overflow-hidden bg-cover bg-no-repeat">
              <Image
                alt={collection.image.altText || collection.title}
                aspectRatio="1/1"
                data={collection.image}
                className='transition duration-300 ease-in-out hover:scale-110'
                loading={index < 3 ? 'eager' : undefined}
              />
            </div>    
            <div className="place-self-center lg:col-span-7 ">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">{collection.title}</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">{collection.description}</p>
                
                <Link
                className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[#0a56a5] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group hover:no-underline"
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
              >
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-gradient-to-r from-teal-500 to-gradient-500 group hover:no-underline group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Shop Now</span>
              </Link>
            </div>
                        
          </div>
        )}
      </section>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
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
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
