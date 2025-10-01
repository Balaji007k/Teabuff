import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from './Service/ApiService/product-api';

function Login({ userInput, AccoutState, setLoading }) {
  const Location = useLocation();
  const Navigate = useNavigate();
  const errorTimerRef = useRef(null);
  const [errors, setErrors] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: check email, 2: verify OTP, 3: ready to register
  const [emailVerify, setEmailVerify] = useState(false);

  //test

// ✅ Step 1: Check email domain
const checkEmailDomain = async () => {
  const { Result, Error } = await ApiService.fetchData("/login/CheckEmail", "POST", { email });
  if (Error) {
    setErrors("Server error, try again.");
    AccoutState({ message: "Server error, try again.", state: false });
    return;
  }
  console.log(Result)
  if (Result.success) {
    AccoutState({ message: "Valid email, sending OTP...", state: true });
    sendOTP();
  } else {
    setErrors(Result.message);
  }
};

// ✅ Step 2: Send OTP
const sendOTP = async () => {
  const { Result, Error } = await ApiService.fetchData("/login/sendOTP", "POST", { email });
  if (Error || !Result.success) {
    setErrors(Result?.message || "Failed to send OTP");
    AccoutState({ message: "Failed to send OTP", state: false });
  } else {
    setStep(2);
    setEmailVerify(true);
    AccoutState({ message: "OTP sent to your email", state: true });
  }
};

// ✅ Step 3: Verify OTP
const verifyOTP = async () => {
  const { Result, Error } = await ApiService.fetchData("/login/verifyOTP", "POST", { email, otp });
  if (Error || !Result.success) {
    setErrors(Result?.message || "Invalid OTP");
    AccoutState({ message: "Invalid or expired OTP", state: false });
  } else {
    setStep(3);
    AccoutState({ message: "Email verified ✅, now you can register", state: true });
  }
};

//test

  const handleLogin = () => {
    setLoading(true);
    setErrors("");
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    if (email === "" || password === "") {
      AccoutState({ message: "Please enter email and password", state: false });
      return setTimeout(() => AccoutState(null), 3000);
    }

    ApiService.fetchData('/login', "POST", { email, password })
      .then(({ Result, Error }) => {
        setLoading(false);
        if (Error === "Failed to fetch") {
          AccoutState({ message: "Server failed to fetch!", state: false });
          return setTimeout(() => AccoutState(null), 1500);
        } else if (Error) {
          setErrors(Error);
          errorTimerRef.current = setTimeout(() => setErrors(""), 3000);
          return;
        }

        AccoutState({ message: "Account successfully logged in", state: true });
        setTimeout(() => {
          AccoutState(null);
          console.log("Logged in user:", Result.user);
          Navigate('/');
          window.location.reload();
        }, 1500);
      })
      .catch(err => {
        console.error("Unexpected error:", err);
        AccoutState({ message: "Something went wrong.", state: false });
        setTimeout(() => AccoutState(null), 1500);
      });
  };

  const validateRegister = () => {
  const username = firstName + " " + lastName;
  const newErrors = {};

  // Required fields
  if (!firstName) newErrors.firstName = "First name is required";
  if (!lastName) newErrors.lastName = "Last name is required";
  if (!email) newErrors.email = "Email is required";
  if (!password) newErrors.password = "Password is required";
  if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
  if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) newErrors.email = "Invalid email format";

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (password && !passwordRegex.test(password)) 
      newErrors.password = "Password must be 8+ chars with uppercase, lowercase, number, special char";

  // Confirm password match
  if (password && confirmPassword && password !== confirmPassword) 
      newErrors.confirmPassword = "Passwords do not match";

  // Phone number 10 digits
  if (phoneNumber && !/^\d{10}$/.test(phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10 digits";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const newUser = async () => {
    setLoading(true);
    const username = firstName + " " + lastName;

     // Email not verified yet
  if (step < 3) {
    setLoading(false);
    AccoutState({ message: "Please verify your email first!", state: false });
    
  }

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber) {
      setLoading(false);
      AccoutState({ message: "Please enter all fields", state: false });
      return setTimeout(() => AccoutState(null), 1500);
    }

    if (password !== confirmPassword) {
      setLoading(false);
      AccoutState({ message: "Passwords do not match", state: false });
      return setTimeout(() => AccoutState(null), 1500);
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setLoading(false);
      AccoutState({ message: "Phone number must be 10 digits", state: false });
      return setTimeout(() => AccoutState(null), 1500);
    }

    const newUser = { username, email, password, phoneNumber };

    ApiService.fetchData('/users', "POST", newUser)
      .then(({ Error }) => {
        setLoading(false);
        if (Error) {
          AccoutState({ message: Error, state: false });
          return setTimeout(() => AccoutState(null), 1500);
        }

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhoneNumber("");

        AccoutState({ message: "Account successfully created", state: true });
        setTimeout(() => {
          AccoutState(null);
          Navigate('/Login');
        }, 1500);
      })
      .catch(err => console.log(err));
  };


  return (
    <div className='Userlogin d-flex flex-column align-items-lg-end align-items-center justify-content-end'>
      <div className="Userlogin-inner-box d-flex flex-column align-items-center justify-content-around gap-2">
        <div className='login-form d-flex flex-column px-4'>
          {Location.pathname === '/Login' ? <h1>Login Here</h1> : <h1>Register Here</h1>}

          {Location.pathname === '/Register' && (
            <>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
            </>
          )}

          <input type="email" ref={userInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          {errors === "User not found" && <p ref={errorTimerRef} className="text-danger">{errors}</p>}

          {/* Test Show email verification buttons */}
{Location.pathname === '/Register' && step === 1 && (
  <button onClick={checkEmailDomain}>Verify Email</button>
)}

{step === 2 && (
  <>
    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
    <button onClick={verifyOTP}>Verify OTP</button>
  </>
)}
{/* Test Show email verification buttons */}

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={8} required />
          {errors === "Password does not match" && <p ref={errorTimerRef} className="text-danger">{errors}</p>}

          {Location.pathname === '/Register' && (
            <>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" minLength={8} required />
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" minLength={10} maxLength={10} pattern="[0-9]{10}" required />
            </>
          )}

          {Location.pathname === '/Register'&&emailVerify ? (
            <button className="" onClick={() => newUser()}>Register</button>
          ) : Location.pathname === '/Login'&&(
            <button className="" onClick={() => handleLogin()}>Login</button>
          )}
        </div>

        <div className="login-way">
          {Location.pathname === '/Register' ? (
            <p>Already have an account? <Link to='/Login' className="text-info text-decoration-underline">Login</Link></p>
          ) : (
            <p>Don't have an account? <Link to='/Register' className="text-info text-decoration-underline">Sign up</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
