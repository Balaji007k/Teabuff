import { useLocation } from "react-router-dom";
import Footer from "./footer";

function Contact() {
    const Location = useLocation();
    return (
        <>
        <div className='Contact d-flex justify-content-center' id="Contact_id" style={{marginTop:Location.pathname==='/Contact_Us'?'75px':null}}>
            <div className='contact-inner-box d-flex flex-column'>
                <h1 className='text-center fw-bolder my-3'>Contact Us</h1>
                <div className='main gap-4'>
                    <div className='contact-image'>
                        <img src="src/assets/contact-tea.jpeg" className='image-cont' alt="loading" data-aos="fade-right" data-aos-duration="600" />
                    </div>
                    <div className='contact-content' data-aos="fade-left" data-aos-duration="600">
                        <form className='d-flex flex-column justify-content-center'>
                            <input type='text' className='input' placeholder='Username' required />
                            <input type='email' className='input' placeholder='Email' required />
                            <textarea rows={5} cols={5} placeholder='Message' className='input'></textarea>
                            <button type='submit' className='con-button input  d-flex justify-content-center align-items-center gap-2'>Send<span class="material-symbols-outlined">
                                send
                            </span></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {Location.pathname==='/Contact_Us'&&<Footer/>}
        </>
    )
}
export default Contact;