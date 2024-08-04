import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { loginDoctor } from "../../firebase";
import router from "next/router";
import checkAuth from "../../checkAuth";
import useCheckAuth from "../../checkAuth";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  useCheckAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failureState, setFailureState] = useState(false);

  const login = async () => {
    if (username === "" || password === "") {
      console.log("Username or password is empty");
      setFailureState(true);
      return;
    }

    try {
      await loginDoctor(username, password);

      console.log("Login successful");
      setFailureState(false); // Reset failure state
      router.push('/doctor/dashboard');

    } catch (error) {
      console.error("Login failed", error);
      setFailureState(true);
    }
  };

  return (
      <div className="justify-center items-center p-6 flex flex-col space-y-5 w-screen h-screen bg-gradient-to-br from-teal-500 to-teal-700">
        <Image src="/logo.png" alt="HeartLens Logo" width={300} height={20} />
        <h1 className="font-semibold">Doctor Portal</h1>
        {/* username input, make it setusername */}
        <input type="text" className="text-black w-72 p-2 rounded-xl" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        {/* password input, make it setpassword */}
        <input type="password" className="text-black w-72 p-2 rounded-xl" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        {/* login button */}
        <button onClick={login} className="p-2 border-xl border-white border-2 rounded-xl hover:bg-opacity-25 hover:bg-white transition-all duration-200">Login</button>
        {/* if login fails, show this */}
        {failureState && <p className="text-red-400">Invalid username or password</p>}
      </div>
  );
}
