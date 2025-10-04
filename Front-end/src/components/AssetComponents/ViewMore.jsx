import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

export default function ViewMore() {

    const {Theme} = useTheme();
    const Navigate = useNavigate();

    return (
        <div className={`product-item ${Theme?'bg-white text-black shadow border border-1 border-black':'bg-black text-white'}`} style={{ width: '300px', flex: '0 0 auto' }}>
            <div className='MoreProduct'>
                <button className='ViewMore-product fs-2' style={{color:"var(--btn-color)"}} onClick={() => Navigate('/Menu')}>
                    <i className="fa-solid fa-angles-right"></i>
                </button>
                <b className=" fs-3">View More</b>
            </div>
        </div>
    )
}