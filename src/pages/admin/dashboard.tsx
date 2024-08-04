import router, { Router } from "next/router";
import { logout } from "../../../firebase";
import withAuth from "../../../withAuth";
import { useState } from "react";
import UserList from "@/components/userlist";

const AdminDashboard = () => {

    const [selectedModeration, setSelectedModeration] = useState('doctors');

    const moderationFilters = [
        {
            name: 'doctor',
            displayName: 'Doctors'
        },
        {
            name: 'patient',
            displayName: 'Patients'
        },
        {
            name: 'admin',
            displayName: 'Admins'
        }
    ]

    const Logout = () => {
        // Add logout logic here
        logout();
        router.push('/admin');
    }

    return (
        <div className="items-center p-6 flex flex-col space-y-5 w-screen h-screen bg-gradient-to-br from-teal-500 to-teal-700">
            <div className="flex flex-row space-x-10 items-center">
                <h1 className="font-semibold text-2xl">Admin Dashboard</h1>
                <button onClick={logout} className="p-2 border-xl border-white border-2 rounded-xl hover:bg-opacity-25 hover:bg-white transition-all duration-200">Logout</button>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="rounded-xl bg-white bg-opacity-25 p-4 w-[500px] h-[500px]">
                    <div className="flex flex-row space-x-5 items-center pb-2">
                        <h2 className="font-semibold text-xl">User Moderation</h2>
                        <div className="flex flex-row space-x-4">
                            {moderationFilters.map((filter) => (
                                <button key={filter.name} onClick={() => setSelectedModeration(filter.name)} className={`p-2 rounded-xl bg-white text-white bg-opacity-10  ${selectedModeration === filter.name ? 'border-b-2' : 'border-b-0'}`}>{filter.displayName}</button>
                            ))}
                        </div>
                    </div>
                    <UserList userType={selectedModeration} />
                </div>
            </div>
        </div>
    );
}

export default withAuth(AdminDashboard);