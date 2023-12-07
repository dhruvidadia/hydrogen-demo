import { Button } from "@material-tailwind/react";
import React, { Fragment, useState } from "react";
import { Transition, Dialog } from '@headlessui/react';
import {
    Image,
    Money,
    VariantSelector,
    CartForm
  } from '@shopify/hydrogen';
import { Link } from "@remix-run/react";

const QuickView = ({product}) => { 
const [showModal, setShowModal] = useState(false);
const firstVariant = product?.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );
  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  }
  product.selectedVariant = firstVariant;
  const {selectedVariant} = product;
  const [open, setOpen] = useState(false)
  const [over, setOver] = useState(false);
  const isMultiImg = product?.images?.edges.length > 1 ? true : false

  return (
    <>
    <div className="absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-10 hover:bottom-0 opacity-0 hover:opacity-100 transition-all duration-300">
      <Button
        className="relative inline-flex items-center justify-start py-2 pl-4 pr-4 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded bg-black group hover:no-underline"
        ripple={false}
        fullWidth={false}
        onClick={() => setShowModal(true)}
      >
        Quick View
      </Button>
    </div>
     
      {showModal ? (
        <>
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block sm:block" />
          </Transition.Child>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div>
                  <Button 
                    className="float-right bg-transparent text-black hover:border-transparent font-semibold"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </Button>
                </div>
               
                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    
                  <div className="aspect-h-3 aspect-w-2 overflow-hidden px-4 py-4 sm:col-span-4 lg:col-span-5"
                  onMouseOver={() => setOver(true)}
                  onMouseOut={() => setOver(false)}
                  >
                  {product?.images?.edges.length && (
                    <Image
                        alt={product.title}
                        aspectRatio="1/1"
                        src={over && isMultiImg ? product?.images?.edges[1]?.node.url : product?.images?.edges[0]?.node.url }
                        sizes="(min-width: 45em) 400px, 100vw"
                    />
                    )}
                    <div className="text-center justify-center py-5">
                        <Link 
                          to={`/products/${product.handle}`}
                          className="text-[#0a56a5]"
                        >
                          View Full Details
                        </Link>
                      </div>
                    
                  </div>
                  <div className="sm:col-span-8 lg:col-span-7 px-5">
                  <Link 
                          to={`/products/${product.handle}`}
                          className="hover:no-underline"
                        ><h2 className="text-xl font-bold text-gray-900 sm:pr-12 hover:text-gray-700">{product.title} 
                        {selectedVariant?.compareAtPrice && (<span className="text-sm font-medium text-rose-500 dark:text-rose-200"> Sale</span>)}</h2></Link>
                    <p className="mb-2 text-gray-700 dark:text-gray-400 text-sm">{product.description}</p>
                    <ProductPrice selectedVariant={selectedVariant} product={product} />
                    <div className='pb-4 mb-6 border-b border-gray-300 dark:border-gray-700' ></div>
                    <div className="product-form">
                    <VariantSelector
                        handle={product.handle}
                        options={product.options}
                        variants={product?.variants.nodes}
                    >   
                        {({option}) =>  <div className="pb-3 dark:border-gray-700" key={option.name}>
                              <h2 className="uppercase text-sm font-bold dark:text-gray-400">{option.name}</h2>
                              <div className="flex flex-wrap -mb-2">
                                {option.values.map(({value, isAvailable, isActive, to}) => {
                                  const lowerval = value.toLowerCase();
                                  const lowername = option.name.toLowerCase();
                                  return (
                                    <label className={`capitalize text-center justify-center py-1 mb-2 w-8 hover:border-blue-400 dark:border-[#0a56a5] hover:text-[#0a56a5] dark:hover:border-gray-300 dark:text-gray-400 hover:no-underline ${
                                      lowername != 'color' ? "mr-1 border border-gray-400 text-xs font-medium x-3 py-0.5 rounded-full" : "py-1 mb-2"
                                    } ${isAvailable ? '' : "op-disabled"} `}

                                    style={
                                      {
                                      border: isActive && lowername != 'color'  ? '3px solid #0a56a5' : '',
                                      opacity: isAvailable ? 1 : 0.3,
                                    }}
                                    key={'main-'+option.name+value}
                                    >
                                      {lowername == 'color' ? (
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
                                      ) : <>
                                      {/* {isAvailable ? <><input type="radio" name={option.name} id={option.name + value}  />{value}</> : <p>{value}</p> } */}
                                      
                                      {/* <label for={option.name + value}>{value}</label> */}
                                         <Link
                                          key={option.name + value}
                                          prefetch="intent"
                                          preventScrollReset
                                          replace
                                          to={to}
                                          className='hover:no-underline'
                                        >
                                          {value}
                                      </Link> 
                                      </> 
                                      }
                                        
                                    </label>
                                    
                                  );
                                })}
                              </div>
                            </div>
                        }
                    </VariantSelector>
                    
                    {/* <div className="justify-center items-center mt-4 mb-4">
                    
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
                                    quantity: 1,
                                  },
                                ]
                              : []
                          }
                        >
                          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
                        </AddToCartButton>
                    </div> */}
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          </Dialog>
        </Transition.Root>
          
        </>
      ) : null}
    </>
  );

}

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
            className="border border-[#0a56a5] rounded-sm w-full px-4 py-2 text-white bg-[#0a56a5] uppercase hover:shadow-lg hover:shadow-gray-900/20 transition-colors duration-150"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function ProductPrice({selectedVariant,product}) {
  return (
    <div className="product-price flex text-md inline-block text-xl font-semibold text-gray-700 dark:text-gray-400 ">
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <span className="inline-block text-base font-normal text-red-600 line-through dark:text-red-600 p-1"><Money data={selectedVariant.compareAtPrice} /></span>
          </div>
        </>
      ) : (
        <Money data={product.priceRange.minVariantPrice} />
      )}
    </div>
  );
}


export default QuickView;