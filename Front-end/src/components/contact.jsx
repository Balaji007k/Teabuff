import { useLocation } from "react-router-dom";
import Footer from "./footer";
import { useTheme } from '../ThemeContext';
import { useEffect, useState } from "react";
import ApiService from "./Service/ApiService/product-api";
import AlertMessage from "./AssetComponents/AlertMessage";

function Contact() {
  const { Theme } = useTheme();
  const Location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {

      const { Result, Error } = await ApiService.fetchData(`/api/Contact`,"POST",formData);

      if (Result) {
        setSuccess({message:"Message sent successfully!",state:true});
        setFormData({ username: "", email: "", subject: "", message: "" });
      } else {
        setSuccess({message:"Failed to send message. Try again.",state:false});
      }
    } catch (err) {
      console.error(err);
      setSuccess({message:"Server error. Please try again later.",state:false});
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(success&&success.message){
      setTimeout(()=>{
        setSuccess(null);
      },1500);
    }
  },[success])

  return (
    <>
      <div className='Contact d-flex justify-content-center' id="Contact_id" style={{ marginTop: Location.pathname === '/Contact_Us' && '75px' }}>
      {success&&success.message&&<AlertMessage message={success}/>}
        <div className='contact-inner-box d-flex flex-column'>
          <h1 className={`text-center fw-bolder my-3 ${Theme ? 'text-white' : 'text-black'}`}>Contact Us</h1>
          <div className='main gap-4 my-2 my-md-4'>
            <div className='contact-image'>
              <img src="assets/contact-tea.jpeg" className='image-cont' alt="loading" data-aos="fade-right" data-aos-once="true" data-aos-duration="600" />
            </div>
            <div className='contact-content' data-aos="fade-left" data-aos-once="true" data-aos-duration="600">
              <form className='d-flex flex-column justify-content-center' onSubmit={handleSubmit}>
                <input type='text' name='username' value={formData.username} onChange={handleChange} className={`input ${Theme ? 'bg-white text-black' : 'bg-black text-white'}`} placeholder='Your name' required />
                <input type='email' name='email' value={formData.email} onChange={handleChange} className={`input ${Theme ? 'bg-white text-black' : 'bg-black text-white'}`} placeholder='Your@email.com' required />
                {/* <input type='text' name='subject' value={formData.subject} onChange={handleChange} className={`input ${Theme ? 'bg-white text-black' : 'bg-black text-white'}`} placeholder='Subject' required /> */}
                <textarea name='subject' rows={1} value={formData.subject} onChange={handleChange} placeholder='Subject' className={`input ${Theme ? 'bg-white text-black' : 'bg-black text-white'}`} required></textarea>
                <textarea name='message' rows={5} value={formData.message} onChange={handleChange} placeholder='Message...' className={`input ${Theme ? 'bg-white text-black' : 'bg-black text-white'}`} required></textarea>
                <button type='submit' className='contact-btn-contact input d-flex justify-content-center align-items-center gap-2' disabled={loading}>
                  {loading ? "Sending..." : <>Send<span className="material-symbols-outlined">send</span></>}
                </button>
              </form>

              {/* {success && <p className="text-center mt-3">{success}</p>} */}
            </div>
          </div>
        </div>
      </div>
      {Location.pathname === '/Contact_Us' && <Footer />}
    </>
  );
}
export default Contact;
