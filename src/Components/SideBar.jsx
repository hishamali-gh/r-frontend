import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

export default function SideBar() {
    return (
        <div className="h-full pt-10 px-6 pb-6 flex flex-col space-y-6 bg-white">
            <ul className='space-y-4 text-gray-800 mono-font'>
                <li>
                    <Link
                        to='/men'
                        className="hover:text-gray-500 transition-colors duration-200 ease-in-out"
                    >
                        MEN
                    </Link>
                </li>

                <li>
                    <Link
                        to='/women'
                        className="hover:text-gray-500 transition-colors duration-200 ease-in-out"
                    >
                        WOMEN
                    </Link>
                </li>

                <li>
                    <Link
                        to='/kids'
                        className="hover:text-gray-500 transition-colors duration-200 ease-in-out"
                    >
                        KIDS
                    </Link>
                </li>

                <SearchBar />
            </ul>
        </div>
    );
}
