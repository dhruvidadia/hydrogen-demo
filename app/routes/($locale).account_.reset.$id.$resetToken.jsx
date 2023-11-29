import {json, redirect} from '@shopify/remix-oxygen';
import {Form, useActionData} from '@remix-run/react';

export const meta = () => {
  return [{title: 'Reset Password'}];
};

export async function action({request, context, params}) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }
  const {id, resetToken} = params;
  const {session, storefront} = context;

  try {
    if (!id || !resetToken) {
      throw new Error('customer token or id not found');
    }

    const form = await request.formData();
    const password = form.has('password') ? String(form.get('password')) : '';
    const passwordConfirm = form.has('passwordConfirm')
      ? String(form.get('passwordConfirm'))
      : '';
    const validInputs = Boolean(password && passwordConfirm);
    if (validInputs && password !== passwordConfirm) {
      throw new Error('Please provide matching passwords');
    }

    const {customerReset} = await storefront.mutate(CUSTOMER_RESET_MUTATION, {
      variables: {
        id: `gid://shopify/Customer/${id}`,
        input: {password, resetToken},
      },
    });

    if (customerReset?.customerUserErrors?.length) {
      throw new Error(customerReset?.customerUserErrors[0].message);
    }

    if (!customerReset?.customerAccessToken) {
      throw new Error('Access token not found. Please try again.');
    }
    session.set('customerAccessToken', customerReset.customerAccessToken);

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

export default function Reset() {
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
        <h1 className="my-3 text-4xl font-bold">Reset Password</h1>
        <p className="text-sm dark:text-gray-400">Enter a new password for your account.</p>
      </div>
      <form method="POST" className="space-y-12 mx-auto">
        <div className="space-y-4">
          <div>
            <label for="email" className="block mb-2 text-sm">Password</label>
            <input
              aria-label="Password"
              autoComplete="current-password"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              id="password"
              minLength={8}
              name="password"
              placeholder="Password"
              required
              type="password"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label for="passwordConfirm" className="text-sm">Re-enter password</label>
            </div>
            <input
              aria-label="Re-enter password"
              autoComplete="current-password"
              id="passwordConfirm"
              minLength={8}
              name="passwordConfirm"
              placeholder="Re-enter password"
              required
              type="password"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        {action?.error ? (
          <p>
            <mark>
              <small>{action.error}</small>
            </mark>
          </p>
        ) : (
          <p className='hidden'></p>
        )}
        <div className="space-y-2">
          <div>
            <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md std-btn">Reset</button>
          </div>
          <Link to="/account/register" rel="noopener noreferrer" className="hover:underline dark:text-violet-400">Back to login</Link>
        </div>
      </form>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerreset
const CUSTOMER_RESET_MUTATION = `#graphql
  mutation customerReset(
    $id: ID!,
    $input: CustomerResetInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
