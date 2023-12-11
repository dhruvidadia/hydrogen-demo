import { useState } from "react";
import {json} from '@shopify/remix-oxygen';
import { Button } from "@material-tailwind/react";

export const action = async ({request, context}) => {
    if (request.method !== 'POST') {
        return json({error: 'Method not allowed'}, {status: 405});
      }
    
    const {storefront, session} = context;
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    console.log(email)
    try {
        const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
            variables: {
              input: {email},
            },
          });

          if (customerCreate?.customerUserErrors?.length) {
            throw new Error(customerCreate?.customerUserErrors[0].message);
          }
       
          return json(
            {error: null},
          );

    } catch (error) {
        if (error instanceof Error) {
          return json({error: error.message}, {status: 400});
        }
        return json({error}, {status: 400});
      }

}

const NewsletterForm = () => {
  const fetchData = async () => {
    try {
     console.log('-----------submitted---------------')
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    return (
        <section className="bg-white dark:bg-gray-900"
        data-aos="fade" data-aos-once="true"
        >
            <div className="px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md sm:text-center">
                    <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">Sign up for our newsletter</h2>
                    <p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.</p>
                    <form method="POST" className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">
                        <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                            <div className="relative w-full">
                                <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                                </div>
                                <input name="email" className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your email" type="email" id="email" required />
                            </div>
                            <div>
                                <Button onClick={fetchData} type="submit" className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-gray-500 border-gray sm:rounded-none sm:rounded-r-lg hover:bg-gray focus:ring-4 focus:ring-gray dark:bg-gray dark:hover:bg-gray dark:focus:ring-gray">Subscribe</Button>
                            </div>
                        </div>
                        
                        <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">We care about the protection of your data. <a href="policies/privacy-policy" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Read our Privacy Policy</a>.</div>
                    </form>
                </div>
            </div>
            </section>
    )
}

export default NewsletterForm;


const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate(
    $input: CustomerCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      customer {
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;