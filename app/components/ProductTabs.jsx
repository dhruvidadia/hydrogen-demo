import { useState } from "react";
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer';
import { Image } from '@shopify/hydrogen';


const ProductTabs = ({product}) => {
  const [open, setOpen] = useState("offers");

  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  return (
    <>
      <section className="mb-4 text-gray-700 dark:text-gray-400">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="w-full mb-14">
                <div className="flex flex-wrap border-b border-gray-200 px-4 space-x-2">
                <a
                    onClick={() => handleTabOpen("offers")}
                    className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 cursor-pointer hover:no-underline ${
                      open === "offers" ? "bg-primary text-[#0a56a5] border-b-2 border-[#0a56a5] " : " "
                    }`}
                  >
                    Special Features
                  </a>
                {product?.Features?.value && (
                  <>
                    <a
                      onClick={() => handleTabOpen("description")}
                      className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 cursor-pointer hover:no-underline  ${
                        open === "description" ? "bg-primary text-[#0a56a5] border-b-2 border-[#0a56a5] " : " "
                      }`}
                    >
                      Description
                    </a>
                  </>
                )}
                  {product.Specifications?.value && (
                  <>
                    <a
                      onClick={() => handleTabOpen("specifications")}
                      className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 cursor-pointer hover:no-underline ${
                        open === "specifications" ? "bg-primary text-[#0a56a5] border-b-2 border-[#0a56a5] " : " "
                      }`}
                    >
                      Specifications
                    </a>
                  </> )}
                  
                  {product?.Features?.value && (
                  <>
                    <a
                      onClick={() => handleTabOpen("material")}
                      className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 cursor-pointer hover:no-underline ${
                        open === "material" ? "bg-primary text-[#0a56a5] border-b-2 border-[#0a56a5] " : " "
                      }`}
                    >
                      Material & Care
                    </a>
                  </>
                  )}
                  
                </div>
                <TabContent
                  details={product?.Features?.value}
                  tabCategory="description"
                  open={open}
                />
                <TabContent
                  details={product.Specifications?.value}
                  tabCategory="specifications"
                  open={open}
                />
                <TabContent
                  details={product.Material?.value}
                  tabCategory="material"
                  open={open}
                />
                <SpecialFeatures
                  tabCategory="offers"
                  open={open}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductTabs;

const TabContent = ({ open, tabCategory, details }) => {
  return (
    <div>
      {(tabCategory === 'specifications' || tabCategory === 'description') && details ? (
        <div
        className={`html p-6 text-base leading-relaxed text-body-color ${
          open === tabCategory ? "block" : "hidden"
        } `}
        dangerouslySetInnerHTML={{
          __html: convertSchemaToHtml(details),
          }}
        
      />
        
      ) : 
        <>
          <div
        className={`p-6 text-base leading-relaxed text-body-color ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        {details}
      </div>
        </>
      }
    </div>
  );
};

const SpecialFeatures = ({ open, tabCategory }) => {
  return (
    <div>
      <div
        className={`p-6 text-base leading-relaxed text-body-color ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        <ul>
          <li className="flex mb-4 w-full items-cenetr float-left ">
            <Image src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/stayfresh_gray.webp?v=1698989332" className="sm:w-50 sm:h-50" width={50} height={50} alt="Stay Fresh"  />
            <p className="py-4 px-4">StayFresh - This product treated with antimicrobial properties to help you stay fresh throughout the day.</p>
          </li>
          <li className="flex mb-4 w-full items-cenetr float-left  ">
            <Image src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/staydry_gray.webp?v=1698989331" alt="Stay Gray" width={50} height={50} />
            <p className="py-4 px-4">StayDry - This product is treated with StayDry™ technology, with additional evaporation properties to keep you dry throughout the day.</p>
          </li>
          <li className="flex mb-4 w-full items-cenetr float-left   ">
            <Image src="https://cdn.shopify.com/s/files/1/0570/4335/3681/files/smart_fabric.webp?v=1698989331" alt="Smart Fabric" width={50} height={50} />
            <p className="py-4 px-4">Smart Fabric - Smart Fabric is used to make this product that takes quality & comfort to the next level.</p>
          </li>
        </ul>
      </div>
    </div>
    
  )
}