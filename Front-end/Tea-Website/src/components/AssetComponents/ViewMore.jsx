import { useNavigate } from "react-router-dom";

export default function ViewMore() {

    const Navigate = useNavigate();

    return (
        <div className='product-item' style={{ width: '300px', flex: '0 0 auto' }}>
            <div className='MoreProduct'>
                <button className='ViewMore fs-2' style={{color:"var(--btn-color)"}} onClick={() => Navigate('/Menu')}>
                    <i className="fa-solid fa-angles-right"></i>
                </button>
                <h1>View More</h1>
            </div>
        </div>
    )
}