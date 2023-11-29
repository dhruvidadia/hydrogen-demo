import {json} from '@shopify/remix-oxygen';
import {useLoaderData, useActionData} from '@remix-run/react';
import ContactUs from '~/components/ContactUs';
import Pages from '~/components/Pages';

export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data.page.title}`}];
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
  return (
    <div className="page">
      {(page.handle == 'contact') ? (
        <ContactUs msg={showMessage} />
      ) : <>
            <header>
              <h1>{page.title}</h1>
            </header>
            <Pages />
            {/* <main dangerouslySetInnerHTML={{__html: page.body}} /> */}
        </>
      }
      
    </div>
  );
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