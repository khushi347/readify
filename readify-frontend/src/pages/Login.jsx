import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate,useLocation} from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location=useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from=location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);

      navigate(from,{replace:true});   // 👈 redirect after login

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;