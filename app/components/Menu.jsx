
import React from 'react';
import { Image } from '@shopify/hydrogen';
import { Button } from '@material-tailwind/react';

const Menu = ({menu}) => {
    return ( 
    <div  className="ruby-menu-demo-header hidden sm:block">
    <div  className="ruby-wrapper">
      <ul  className="ruby-menu flex" key={'ruby-menu-level'}>
      {menu?.items.map((item,index) => { 

          const url = item.url.includes('myshopify.com')
                    ? new URL(item.url).pathname
                    : item.url;
        return(
          <>
          {index == 0 ? (
            
            <li  className="ruby-menu-mega-blog px-2" key={'level-1-'+item.id}><a href={url}>{item.title}</a>
            {item?.items.length > 0 && ( 
              <>
              <div>
                <ul  className="ruby-menu-mega-blog-nav sub-menu" key={'sub-menu-'+item.id}>
                {item?.items.map((subitem,index) => { 
                  const suburl = subitem.url.includes('myshopify.com')
                  ? new URL(subitem.url).pathname
                  : subitem.url;
                  //const handle = subitem.url.substring(subitem.url.lastIndexOf('/') + 1);

                  return(
                    <li  className={ index == 0 ? "ruby-active-menu-item sub-menu-items":"hidden-md"} key={'level-2-'+subitem.id}><a href={suburl} className='sub-menu-links'>{subitem.title}</a>
                      <div  className="ruby-grid ruby-grid-lined" >
                        <div  className="ruby-row">
                        {subitem?.items.length > 0 && ( 
                          <>
                            {subitem?.items.map((childitem) => { 
                              const childurl = childitem.url.includes('myshopify.com')
                              ? new URL(childitem.url).pathname
                              : childitem.url;
                              return(
                                <div  className="ruby-col-3" key={'level-3-'+childitem.id}>
                                <div className='z-50'>
                                  <div className="ruby-c-title font-semibold text-m px-2"><a href={childurl}>{childitem.title}</a></div>
                                </div>
                              </div>
                              )
                            })}
                          </>
                        )}  
                        </div>
                      </div>
                      <span  className="ruby-dropdown-toggle"></span>
                    </li>
                  )
              })}
                </ul>
              </div>
            </>
            )}
          </li>
          ) : <>
            <li className='px-2' key={item.id}><a href={url}>{item.title}</a>
            {item?.items.length > 0 && (
              <>
              
              <ul className='sub-menu' key={'menu-level-'+item.id}>
                {item?.items.map((subitem) => { 
                  const suburl = subitem.url.includes('myshopify.com')
                  ? new URL(subitem.url).pathname
                  : subitem.url;
                  return(
                    <li className='sub-menu-items' key={'level-4-'+subitem.id}><a className='sub-menu-links' href={suburl}>{subitem.title}</a></li>
                  )
                   
                })}
              </ul>
              </>
              
            )}
            </li>
          </> }
          </>
        )
       
       })}
       
      </ul>
    </div>
    </div>
    )
}

export default Menu;

