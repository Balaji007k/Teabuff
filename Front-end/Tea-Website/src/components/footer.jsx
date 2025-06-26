function Footer() {
    return (
        <footer className='footer d-flex flex-column justify-content-center align-items-center mt-5'>
            <div className='footer-inner-box text-light rounded-4 mb-4'>
                <h1 className='FooterLogo mx-5 my-4 ps-2'>Teabuff</h1>
                <div className='footer-content d-flex flex-wrap justify-content-between gap-5 mx-5 my-4 ps-2'>
                    <div className='Footer-Details d-flex flex-wrap justify-content-center align-items-start'>
                        <div className='w-100 d-flex justify-content-start'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam veniam molestias esse minus saepe dolorem voluptatibus at a sunt optio.
                            </p>
                        </div>
                    </div>
                    <div className='Footer-Details Links d-flex justify-content-center align-items-start'>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-2'>
                            <h5 className='head'>Links</h5>
                            <h6><a href="#">Home</a></h6>
                            <h6><a href="#About">About Us</a></h6>
                            <h6><a href="#Product_id">Menu</a></h6>
                            <h6><a href="#Contact_id">Contact Us</a></h6>
                        </div>
                    </div>
                    <div className='Footer-Details Links d-flex justify-content-center align-items-start'>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-2'>
                            <h5 className='head'>Social Media</h5>
                            <h6>Twitter</h6>
                            <h6>Instagram</h6>
                            <h6>Youtube</h6>
                            <h6>Facebook</h6>
                        </div>
                    </div>
                    <div className='Footer-Details d-flex justify-content-center align-items-start'>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-3'>
                            <h5 className='head'>News Letter</h5>
                            <input type='email' className=' border-white p-0' placeholder='Enter your email id' />
                            <h6 className='Mail'>teabuff@chennai.com</h6>
                            <h6>+911234567890</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className='background-footer w-100'></div>
        </footer>
    )
}
export default Footer;