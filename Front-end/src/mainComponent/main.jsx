import '../App.css';
import '../style/Header.css';
import '../style/Home.css';
import '../style/About.css';
import '../style/Product.css';
import '../style/Service.css';
import '../style/Contact.css';
import '../style/Footer.css';
import About from '../components/about';
import Product from '../components/product';
import Service from '../components/service';
import Contact from '../components/contact';
import Footer from '../components/footer';
import Home from '../components/home';
import { useTheme } from '../ThemeContext';

function Main({ userInput, AccountSet, createdAccount }) {
  const { isAuthenticated, Review, image, productsItem, category } = useTheme();


  return (
    <div className="App">
      <Home userInput={userInput} Review={Review} isAuthenticated={isAuthenticated} AccountSet={AccountSet} createdAccount={createdAccount}/>
      <About image={image} />
      <Product productsItem={productsItem} category={category} isAuthenticated={isAuthenticated} />
      <Service />
      <Contact />
      <Footer />
    </div>
  );
}

export default Main;
