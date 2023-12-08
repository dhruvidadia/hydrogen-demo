import {json} from '@shopify/remix-oxygen';
import {useLoaderData, useActionData} from '@remix-run/react';
import ContactUs from '~/components/ContactUs';
import Faqs from '~/components/Faqs';
import Pages from '~/components/Pages';
import ThumbSlider from '~/components/ThumbSlider';

export const meta = ({data}) => {
  return [{title: `Coconut | ${data.page.title}`}];
};

export const action = async ({request, context}) => {
  console.log("=========In Contact===========");
  if (request.method !== 'POST') {
      return json({error: 'Method not allowed'}, {status: 405});
    }
  
  const {storefront, session} = context;
  const form = await request.formData();
  const name = String(form.has('name') ? form.get('name') : '');
  const email = String(form.has('email') ? form.get('email') : '');
  console.log(email);
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

export async function loader({params, context}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  const {page} = useLoaderData();
  const action = useActionData();
  const showMessage = (action?.msg) ? action.msg : false;
  return(
    <>
    {(page.handle == 'contact' || page.handle == 'faqs') ? 
      <>
        {(page.handle == 'contact') && (
          <ContactUs msg={showMessage} />
        )}
        {(page.handle == 'faqs') && (
          <Faqs content={page.body} title={page.title} />
        )}
      </>
     : 
      <>
        <header>
            <h1 className="text-center justify-center">{page.title}</h1>
          </header>
          {/* <main dangerouslySetInnerHTML={{__html: page.body}} /> */}
          <Pages />
      </>
    }
    <ThumbSlider />
    </>
  )





  // return (
  //   <div className="page">
  //     {(page.handle == 'contact') ? (
  //       <ContactUs msg={showMessage} />
  //     )  : <>
  //           <header>
  //             <h1 className="text-center">{page.title}</h1>
  //           </header>
  //           <Pages />
  //           {/* <main dangerouslySetInnerHTML={{__html: page.body}} /> */}
  //       </>
  //     }
  //     <ThumbSlider />
  //   </div>
  // );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      handle
      seo {
        description
        title
      }
    }
  }
`;
