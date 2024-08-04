import {useState} from "react";
import {loginAdmin} from "../../firebase";
import router from "next/router";

export default function AdminPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [failureState, setFailureState] = useState(false);

    // login function using firebase:
    const login = async () => {
        if (username === "" || password === "") {
          console.log("Username or password is empty");
          setFailureState(true);
          return;
        }
    
        try {
          await loginAdmin(username, password);

          console.log("Login successful");
          setFailureState(false); // Reset failure state
          router.push('/admin/dashboard');

        } catch (error) {
          console.error("Login failed", error);
          setFailureState(true);
        }
      };

    return (
        <div className="justify-center items-center p-6 flex flex-col space-y-5 w-screen h-screen">
            <h1>Admin Portal</h1>
            {/* username input, make it setusername */}
            <input type="text" className="text-black w-72" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            {/* password input, make it setpassword */}
            <input type="password" className="text-black w-72" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            {/* login button */}
            <button onClick={login}>Login</button>
            {/* if login fails, show this */}
            {failureState && <p className="text-red-400">Invalid username or password</p>}
        </div>
    )
}