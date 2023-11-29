import {json, redirect} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Button } from '@material-tailwind/react';

export const meta = () => {
  return [{title: 'Login'}];
};

export async function loader({context}) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Login() {
  const data = useActionData();
  const error = data?.error || null;

  return (
    <section className='felx items-center justify-center' 
    data-aos="zoom-in-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="500"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false"
    >
      <div className="bg-gray-50 flex rounded-2x1 shadow-lg max-w-3xl p-5 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className='sm:w-1/2 px-16'>
          
          <h2 className="text-2xl font-bold text-center">Sign in</h2>
          <p className="text-sm mt-4 mb-4 text-center">Sign in to access your account</p>
          
          <form method="POST" className="space-y-12 mx-auto">
            <div className="space-y-4">
              <div>
                <label for="email" className="block mb-2 text-sm">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="leroy@jenkins.com"
                  aria-label="Email address"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  className="p-2 rounded-xl border w-full px-3 py-2  rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />  
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label for="password" className="text-sm">Password</label>
                  <Link to="/account/recover" rel="noopener noreferrer" className="text-xs hover:underline dark:text-gray-400">Forgot password? </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="*****"
                  aria-label="Password"
                  minLength={8}
                  className="p-2 rounded-xl border w-full px-3 py-2  rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>
            {error ? (
              <p>
                <mark>
                  <small>{error}</small>
                </mark>
              </p>
            ) : (
              <p className='hidden'></p>
            )}
            <div className="space-y-2">
              <div className='border-b'>
                <Button type="submit" className="w-full px-8 py-3 font-semibold rounded-xl std-btn">Sign in</Button>
              </div>
              
            </div>
          </form>

          <div className="flex justify-center items-center mt-4">
            <p className='text-sm'>Don't have an account yet? </p>
            <Link to="/account/register" rel="noopener noreferrer" className="px-3 text-sm bg-white-border roundex-xl text-black"> Sign up </Link>
          </div>
        </div>

        <div className='w-1/2 sm:block hidden'>
          <Image
            src='https://cdn.shopify.com/s/files/1/0570/4335/3681/files/wardrobe-22-2048x1376.png?v=1698391431'
            className="rounded-2x1"
            width={616}
            height={413}
          />
        </div>
      
    </div>
    </section>
    
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;
