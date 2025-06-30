import { useEffect, useState } from "react";
import '../../style/Payment.css'
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const small = useMediaQuery({ maxWidth: 600 })
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
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
          onSubmit={(e) => {
            e.preventDefault();
            const isValid =
              validateEmail(email) &&
              validateCardHolder(cardHolder) &&
              validateCardNumber(cardNumber) &&
              validateExpiry(expiry) &&
              validateCVV(cvv);

            if (!isValid) {
              alert("Please fill all fields correctly before submitting.");
              return;
            }

            alert("Payment submitted!");
            Navigate('/')
          }}
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
  );
}
