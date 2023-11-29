import {json, redirect} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';

export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

export async function action({request, context}) {
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({error: error.message, resetRequested}, {status: 400});
    }
    return json({error, resetRequested}, {status: 400});
  }
}

export default function Recover() {
  const action = useActionData();

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6" 
    data-aos="zoom-in-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="500"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false"
    >
      <div className="mb-8 text-center">
        {action?.resetRequested ? (
          <>
            <h1 className="my-3 text-4xl font-bold">Request Sent.</h1>
            <p className="text-sm dark:text-gray-400">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
            <br />
            <Link to="/account/login">Return to Login</Link>
          </>
        ) : (
          <>
            <h1 className="my-3 text-4xl font-bold">Forgot Password.</h1>
            <p className="text-sm dark:text-gray-400">
              Enter the email address associated with your account to receive a
              link to reset your password.
            </p>
            <br />
            <Form method="POST" className="space-y-12 mx-auto">
              <fieldset>
                <label htmlFor="email" className="text-sm">Email</label>
                <input
                  aria-label="Email address"
                  autoComplete="email"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  id="email"
                  name="email"
                  placeholder="Email address"
                  required
                  type="email"
                />
              </fieldset>
              {action?.error ? (
                <p>
                  <mark>
                    <small>{action.error}</small>
                  </mark>
                </p>
              ) : (
                <p className='hidden'></p>
              )}
              <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md std-btn">Request Reset Link</button>
            </Form>
            <div>
              <br />
              <p>
                <Link to="/account/login" rel="noopener noreferrer" className="hover:underline dark:text-violet-400">Back to login</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
