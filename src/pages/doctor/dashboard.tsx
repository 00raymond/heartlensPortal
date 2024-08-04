import router, { Router } from "next/router";
import { logout } from "../../../firebase";
import withAuth from "../../../withAuth";

const DoctorDashboard = () => {

    const Logout = () => {
        // Add logout logic here
        logout();
        router.push('/');
    }

    return (
        <div className="items-center p-6 flex flex-col space-y-5 w-screen h-screen bg-gradient-to-br from-teal-500 to-teal-700">
            <div className="flex flex-row space-x-10 items-center">
                <h1 className="font-semibold text-2xl">Doctor Dashboard</h1>
                <button onClick={logout} className="p-2 border-xl border-white border-2 rounded-xl hover:bg-opacity-25 hover:bg-white transition-all duration-200">Logout</button>
            </div>
            <div className="">

            </div>
        </div>
    );
}

export default withAuth(DoctorDashboard);