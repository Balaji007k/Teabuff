import { Link } from 'react-router-dom';

function AdminNavbar() {
    return (
        <navbar className='AdminNavbar h-100' style={{width:'20vw'}}>
            <ul className='h-100 w-100 text-dark d-flex flex-column justify-content-center pt-4 px-0 gap-4 align-items-start'>
                <Link to={'/Admin'}>DashBoard</Link>
                <Link to={'/Admin/UserDetails'}>UserDetails</Link>
                <Link to={'/Admin/Products'}>Products</Link>
                <Link to={'/Admin/Reviews'}>Reviews</Link>
                <Link to={'/Admin/Categorys'}>Categorys</Link>
            </ul>
        </navbar>
    )
}

export default AdminNavbar;
