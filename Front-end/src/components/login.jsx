// import { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";
// import ApiService from './Service/ApiService/product-api';

// function Login({ userInput,AccoutState,setLoading}) {

//     const Location = useLocation();
//     const Navigate = useNavigate();
//     const errorTimerRef = useRef(null);
//     const [errors,setErrors] = useState("");
//     //const [AccoutState,setAccoutState] = useState("");

//     const [username,setuser] = useState("");
//     const [email,setemail] = useState("");
//     const [password,setPass] = useState("");
//     const [phoneNumber,setPhone] = useState("");

// const handleLogin = () => {
//   setLoading(true);
//   setErrors("");
//   if (errorTimerRef.current) {
//     clearTimeout(errorTimerRef.current);
//     errorTimerRef.current = null;
//   }

//   const User = { email, password };

//   if (User.email === "" || User.password === "") {
//       AccoutState({message:"please enter email and password",state:false});
//       return setTimeout(()=>{
//         AccoutState("");
//       },3000);
//   }

//   ApiService.fetchData('/login', "POST", User)
//     .then(({ Result, Error }) => {
//       if (Error==="Failed to fetch"){
//         AccoutState({message:"Server failed to fetch!",state:false});
//         console.log("Error: "+Error)
//         setTimeout(()=>{
//         AccoutState(null);
//       },1500);
//       }
//       else if (Error) {
//         setLoading(false);
//         setErrors(Error);
//         errorTimerRef.current = setTimeout(() => {
//           setErrors("");
//         }, 3000);
//         return;
//       }

//       // alert("Account successfully logged in");
//       AccoutState({message:"Account successfully logged in",state:true});
//       setTimeout(()=>{
//         AccoutState(null);
//         console.log("Logged in user:", Result.user);
//         Navigate('/');
//         window.location.reload();
//       },1500);
//     })
//     .catch(err => {
//       console.error("Unexpected error:", err);
//       // alert("Something went wrong.");
//       AccoutState({message:"Something went wrong.",state:false});
//       setTimeout(()=>{
//         AccoutState(null);
//       },1500);
//     });
// };


//     const newUser = async () => {
//       setLoading(true);

//       const newUser = {username,email,password,phoneNumber}

//       if(newUser.username === "" || newUser.email === "" || newUser.password === "" || newUser.phoneNumber === ""){
//         setLoading(false);
//         AccoutState({message:"please enter all feild",state:false});
//       return setTimeout(()=>{
//         AccoutState(null);
//       },1500);
//       }

//       ApiService.fetchData('/users',"POST",newUser)
//       .then(({Error})=>{
//         if (Error) {
//          AccoutState({message:Error,state:false});
//       setTimeout(()=>{
//         AccoutState(null);
//       },1500);
//         return;
//        }
//         setuser("")
//         setemail("")
//         setPass("")
//         setPhone("")
//         setLoading(false);
//         AccoutState({message:"Account successfully created",state:true});
//       setTimeout(()=>{
//         AccoutState(null);
//         Navigate('/Login')
//       },1500);
//       })
//       .catch(err => console.log(err));

//     };

//     return (
//       <>
//         <div className='Userlogin d-flex flex-column align-items-center justify-content-end'>
//             <div className="Userlogin-inner-box d-flex flex-column align-items-center justify-content-around gap-2">
//                 <div className='login-form d-flex flex-column px-4'>
//                     {Location.pathname === '/Login' ? <h1>Login Here</h1> : <h1>Register Here</h1>}
//                     {Location.pathname === '/Register' ?<input type="email" ref={userInput} value={username} onChange={(e)=>setuser(e.target.value)} placeholder="Enter Username Here" required />:null}
//                     <input type="email" ref={userInput} value={email} onChange={(e)=>setemail(e.target.value)} placeholder="Enter Email Here" required />
//                     {errors === "User not found"&&<p ref={errorTimerRef} className="text-danger">{errors}</p>}
//                     <input type="password" value={password} onChange={(e)=>setPass(e.target.value)}  minLength={8} placeholder="Enter Password Here" required />
//                     {errors === "Password does not match"&&<p ref={errorTimerRef} className="text-danger">{errors}</p>}
//                     {Location.pathname === '/Register' ?
//                         (<><input type="tel" name="phone" value={phoneNumber} onChange={(e)=>setPhone(e.target.value)} minLength={10} maxLength={10} placeholder="Enter Phone Number" pattern="[0-9]{10}" required={Location.pathname === '/Register'} /><button onClick={()=>newUser()}>Register</button></>) :
//                         <button className="my-5" onClick={()=>handleLogin()}>Login</button>}
//                 </div>
//                 <div className="login-way">
//                     <h5>Dont't have an account?</h5>
//                     {Location.pathname === '/Register' ? <p><Link to='/Login' className="text-info text-decoration-underline">Login</Link> here</p> : <p><Link to='/Register' className=" text-info text-decoration-underline">Sign up</Link> here</p>}
//                 </div>
//             </div>
//         </div>
//         </>
//     )
// }

// export default Login;


import { useState, useRef } from "react";
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
    <div className='Userlogin d-flex flex-column align-items-center justify-content-end'>
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

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={8} required />
          {errors === "Password does not match" && <p ref={errorTimerRef} className="text-danger">{errors}</p>}

          {Location.pathname === '/Register' && (
            <>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" minLength={8} required />
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" minLength={10} maxLength={10} pattern="[0-9]{10}" required />
            </>
          )}

          {Location.pathname === '/Register' ? (
            <button className="" onClick={() => newUser()}>Register</button>
          ) : (
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
