import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from './Service/ApiService/product-api';

function Login({ userInput }) {

    const Location = useLocation();
    const Navigate = useNavigate();
    const errorTimerRef = useRef(null);
    const [errors,setErrors] = useState("");

    const [username,setuser] = useState("");
    const [email,setemail] = useState("");
    const [password,setPass] = useState("");
    const [phoneNumber,setPhone] = useState("");

const handleLogin = () => {
  setErrors("");
  if (errorTimerRef.current) {
    clearTimeout(errorTimerRef.current);
    errorTimerRef.current = null;
  }

  const User = { email, password };

  if (User.email === "" || User.password === "") {
    return alert("please enter email and password");
  }

  ApiService.fetchData('/login', "POST", User)
    .then(({ Result, Error }) => {
      if (Error) {
        setErrors(Error);
        errorTimerRef.current = setTimeout(() => {
          setErrors("");
        }, 3000);
        return;
      }

      alert("Account successfully logged in");
      console.log("Logged in user:", Result.user);
      Navigate('/');
      window.location.reload();
    })
    .catch(err => {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    });
};





    const newUser = async () => {

      const newUser = {username,email,password,phoneNumber}

      if(newUser.username === "" || newUser.email === "" || newUser.password === "" || newUser.phoneNumber === "") return alert("please enter all feild")

      ApiService.fetchData('/users',"POST",newUser)
      .then(({Error})=>{
        if (Error) {
        alert("Login failed: " + Error);
        return;
       }
        alert("Account successfully created")
        setuser("")
        setemail("")
        setPass("")
        setPhone("")
        Navigate('/Login')
      })
      .catch(err => console.log(err));

    };

    return (
        <div className='Userlogin d-flex flex-column align-items-center justify-content-end'>
            <div className="Userlogin-inner-box d-flex flex-column align-items-center justify-content-center gap-2">
                <div className='login-form d-flex flex-column px-4'>
                    {Location.pathname === '/Login' ? <h1>Login Here</h1> : <h1>Register Here</h1>}
                    {Location.pathname === '/Register' ?<input type="email" ref={userInput} value={username} onChange={(e)=>setuser(e.target.value)} placeholder="Enter Username Here" required />:null}
                    <input type="email" ref={userInput} value={email} onChange={(e)=>setemail(e.target.value)} placeholder="Enter Email Here" required />
                    {errors === "user Not Found"?<p ref={errorTimerRef} className="text-danger">{errors}</p>:null}
                    <input type="password" value={password} onChange={(e)=>setPass(e.target.value)}  minLength={8} placeholder="Enter Password Here" required />
                    {errors === "password not match"?<p ref={errorTimerRef} className="text-danger">{errors}</p>:null}
                    {Location.pathname === '/Register' ?
                        (<><input type="tel" name="phone" value={phoneNumber} onChange={(e)=>setPhone(e.target.value)} minLength={10} maxLength={10} placeholder="Enter Phone Number" pattern="[0-9]{10}" required={Location.pathname === '/Register'} /><button onClick={()=>newUser()}>Register</button></>) :
                        <button className="my-5" onClick={()=>handleLogin()}>Login</button>}
                </div>
                <div className="login-way">
                    <h5>Dont't have an account?</h5>
                    {Location.pathname === '/Register' ? <p><Link to='/Login' className="text-info text-decoration-underline">Login</Link> here</p> : <p><Link to='/Register' className=" text-info text-decoration-underline">Sign up</Link> here</p>}
                </div>
            </div>
        </div>
    )
}

export default Login;