import { useEffect, useState } from "react";
import '../../style/Payment.css'
import { useMediaQuery } from "react-responsive";
import { useNavigate,useLocation } from "react-router-dom";
import AlertMessage from "./AlertMessage";
import LoadingPage from "./LoadingPage";
import { useTheme } from "../../ThemeContext";

export default function Payment() {
  const {createOrder,isAuthenticated} = useTheme();
  const small = useMediaQuery({ maxWidth: 600 })
  const Navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart;
  const CheckOutData = location.state?.NewCheckut;
  const [email, setEmail] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [AlertMessagePayment,setAlertMessage] = useState([]);
  const [Loading,setLoading] = useState(false);

  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validateCardHolder = (val) =>
    /^[A-Za-z ]{2,}$/.test(val);
  const validateCardNumber = (val) =>
    /^\d{4} \d{4} \d{4} \d{4}$/.test(val);
  const validateExpiry = (val) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(val);
  const validateCVV = (val) =>
    /^\d{3,4}$/.test(val);

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3)
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    return cleaned;
  };

  const getIcon = (isValid) => (
    <span className={`input-icon ${isValid ? "valid-icon" : "invalid-icon"} material-symbols-outlined`}>
      {isValid ? "check_circle" : "error"}
    </span>
  );

const orderData = {
  userId: isAuthenticated?.userId || "guest_user",
  newOrder: {
    orderId: "ORD" + Date.now(),
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    customerName: `${(CheckOutData?.firstname+" "+CheckOutData?.lastname) || "Guest"}`,
    address: CheckOutData?.address || "Unknown Address",
    email: CheckOutData?.contactEmail || "noemail@example.com",
    products: (cart?.items || []).map(item => ({
      categoryId: item?.categoryId || 0,
      name: item?.itemName || "Unknown Item",
      image: item?.Product_Url || "",
      qty: item?.quantity || 0,
      price: item?.itemPrice || 0,
    })),
    subtotal: (cart?.items || []).reduce((acc, item) => acc + ((item.categoryId==1?item?.itemPrice/2:item?.itemPrice) || 0) * (item?.quantity || 0), 0),
    shipping: 10,
    tax: ((cart?.items || []).reduce((acc, item) => acc + ((item.categoryId==1?item?.itemPrice/2:item?.itemPrice) || 0) * (item?.quantity || 0), 0)) * 0.18,
    total: ((cart?.items || []).reduce((acc, item) => acc + ((item.categoryId==1?item?.itemPrice/2:item?.itemPrice) || 0) * (item?.quantity || 0), 0)) + 10 + (((cart?.items || []).reduce((acc, item) => acc + ((item.categoryId==1?item?.itemPrice/2:item?.itemPrice) || 0) * (item?.quantity || 0), 0)) * 0.18),
    paymentType: "Visa",
    cardEnding: `**** **** **** ${cardNumber.slice(-4)}`,
    contact:`+91${CheckOutData?.phone}`,
  },
};

//console.log("Prepared orderData:", JSON.stringify(orderData, null, 2));

  useEffect(()=>{
    if(AlertMessagePayment&&AlertMessagePayment.message) setLoading(false);
  },[AlertMessagePayment])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
    {AlertMessagePayment&&AlertMessagePayment?.message?<AlertMessage message={AlertMessagePayment} />:Loading&&<LoadingPage/>}
    <div className=" d-flex justify-content-center" style={{ marginTop: "75px" }}>
      <div style={{ width: !small ? '75%' : '95%' }}>
        <h2 className="mb-5 px-2">ENTER YOUR PAYMENT INFORMATION</h2>
        <div className="checkout-container d-flex flex-column gap-3 px-2">
          <fieldset className="checkout-box">
            <h2>Express checkout</h2>
            <div className="buttons-wrapper">
              <button className="paypal-btn">

                <span>PayPal</span>
              </button>
              <button className="gpay-btn">

                <span>G Pay</span>
              </button>
            </div>
          </fieldset>

          <div className="divider">
            <span>OR</span>
          </div>
        </div>
        <form
          onSubmit={async(e) => {
            e.preventDefault();
            setLoading(true);
            const isValid =
              validateEmail(email) &&
              validateCardHolder(cardHolder) &&
              validateCardNumber(cardNumber) &&
              validateExpiry(expiry) &&
              validateCVV(cvv);

            if (!isValid) {
              setAlertMessage({message:"Please fill all fields correctly before submitting.",state:false});
              return setTimeout(()=>{
                setAlertMessage(null);
            },3000);
            }
             if (cart && CheckOutData) {
      try {
        // const res = await createOrder(orderData); 

        // if (res) {
        //   setAlertMessage({message:"Payment submitted!",state:true});
        //   setTimeout(() => {
        //     setAlertMessage(null);
        //     setLoading(false);
        //     Navigate(`/MyOrders/${isAuthenticated?.userId}`);
        //   }, 3000);
        // }

        const res = await createOrder(orderData); // calls backend
if (res) {
  setAlertMessage({ message: "Payment submitted! SMS sent.", state: true });
  setTimeout(() => {
    setAlertMessage(null);
    setLoading(false);
    Navigate(`/MyOrders/${isAuthenticated?.userId}`);
  }, 3000);
}

      } catch (err) {
        console.error("Error creating order:", err);
        setAlertMessage({ message: "Order failed. Try again.", state: false });
        setLoading(false);
      }
    }
  }
          }
        >
          <div className="Payment d-flex flex-column gap-3 px-2">
            <div className="w-100 d-flex gap-2">
              <div className="w-100 input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
                {email && getIcon(validateEmail(email))}
              </div>
              <div className="w-100 input-wrapper">
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Card Holder Name"
                  required
                />
                {cardHolder && getIcon(validateCardHolder(cardHolder))}
              </div>
            </div>

            <div className="input-wrapper">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                placeholder="xxxx xxxx xxxx xxxx"
                required
              />
              {cardNumber && getIcon(validateCardNumber(cardNumber))}
            </div>

            <div className="w-100 d-flex gap-2">
              <div className="w-100 input-wrapper">
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  required
                />
                {expiry && getIcon(validateExpiry(expiry))}
              </div>
              <div className="w-100 input-wrapper">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                  placeholder="CVV"
                  required
                />
                {cvv && getIcon(validateCVV(cvv))}
              </div>
            </div>

            <button type="submit" className="rounded-2 bg-info my-2">
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
