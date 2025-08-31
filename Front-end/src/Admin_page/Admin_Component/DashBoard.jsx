import { Link } from 'react-router-dom';

function DashBoard({Review, productsItem, category, Users}) {

    return(
        <div className='main-Admin d-flex w-75'>
            <div className='w-100 d-flex flex-wrap'>
                <div className='Dashboard w-50 h-50'><h1><Link to={'/Admin/UserDetails'}>Users {Users?.length}</Link></h1></div>
                <div className='Dashboard w-50 h-50'><h1><Link to={'/Admin/Products'}>Products {productsItem?.length}</Link></h1></div>
                <div className='Dashboard w-50 h-50'><h1><Link to={'/Admin/Reviews'}>Reviews {Review?.length}</Link></h1></div>
                <div className='Dashboard w-50 h-50'><h1><Link to={'/Admin/Categorys'}>Categorys {category?.length}</Link></h1></div>
            </div>
        </div>
        
                
                
    )
}

export default DashBoard;