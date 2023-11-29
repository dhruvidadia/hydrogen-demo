import { Link } from "@remix-run/react";

const MegaMenu = ({onMouseLeave, subItem, key}) => {
    return (
    <div className="mega-menu-full-image-dropdown absolute left-0 right-0 mt-1 bg-white border-gray-200 shadow-sm border-y dark:bg-gray-800 dark:border-gray-600">
        <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-sm text-gray-500 dark:text-gray-400 md:grid-cols-3 md:px-6" onMouseLeave={onMouseLeave}>
            <ul className="hidden mb-4 space-y-4 md:mb-0 md:block" aria-labelledby="mega-menu-full-image-button">
                {subItem.map((menu) => {
                    const url =
                    menu.url.includes('myshopify.com')
                        ? new URL(menu.url).pathname
                        : menu.url;
                    return (
                        <li>
                            <Link to={url} key={'submenu-link-'+menu.id} className="hover:underline hover:text-blue-600 dark:hover:text-blue-500" >
                                {menu.title}    
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <div className="p-8 text-left bg-local bg-gray-500 bg-center bg-no-repeat bg-cover rounded-lg bg-blend-multiply hover:bg-blend-soft-light dark:hover:bg-blend-darken">
                <p className="max-w-xl mb-5 font-extrabold leading-tight tracking-tight text-white">Check all new collections</p>
                <Link to='/collections' type="button" className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-center text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-700">
                    Explore Now
                </Link>
            </div>
        </div>
    </div>

    )
}

export default MegaMenu;