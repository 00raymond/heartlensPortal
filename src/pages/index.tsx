import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
      <div>
        <h1>Doctor Login</h1>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
      </div>
  );
}
