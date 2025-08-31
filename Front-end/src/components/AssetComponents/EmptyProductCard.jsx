export default function EmptyProductCard() {
    return (
        <div className='product-item' style={{ width: '300px', flex: '0 0 auto' }}>
            <img src="NAN" className='Shop-slid' alt="No Products" />
            <div className='d-flex flex-column w-100'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h3 className='card-text my-2'>No products found</h3>
                    <h4 className='display-product-text-price my-2'>$00</h4>
                </div>
                <p className='Poduct-Description'>No item found for this category</p>
            </div>
            <button className='order-button text-dark rounded-5 p-2 w-100 text-center'>No item</button>
        </div>
    )
}