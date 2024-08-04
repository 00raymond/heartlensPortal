import { useRef } from "react";
import { registerDoctor, registerPatient, registerAdmin } from "../../firebase";
import {auth} from "../../firebase";

interface CreateUserProps {
    userType: string;
}

export default function CreateUser(props: CreateUserProps) {

    const doctorNameRef = useRef(null);
    const doctorEmailRef = useRef(null);
    const doctorPasswordRef = useRef(null);

    const patientNameRef = useRef<HTMLInputElement>(null);
    const patientEmailRef = useRef<HTMLInputElement>(null);
    const patientPasswordRef = useRef<HTMLInputElement>(null);
    const patientAdditionalInfoRef = useRef<HTMLInputElement>(null);

    const adminNameRef = useRef(null);
    const adminEmailRef = useRef(null);
    const adminPasswordRef = useRef(null);

    const registerAdminDb = async (email: string, password: string, name: string) => {

        if (auth.currentUser == null) { console.log('Error: Admin not authenticated. Please re-login.'); return; }

        if (email == null || password == null || name == null) { console.log('Error: Missing required fields.'); return; }
            
        registerAdmin(email, password, name);
    }

    const registerDoctorDb = async (email: string, password: string, name: string) => {

        if (auth.currentUser == null) { console.log('Error: Admin not authenticated. Please re-login.'); return; }

        if (email == null || password == null || name == null) { console.log('Error: Missing required fields.'); return; }


        registerDoctor(email, password, name);

    }

    const registerPatientDb = async () => {
        let email = patientEmailRef.current?.value;
        let password = patientPasswordRef.current?.value;
        let name = patientNameRef.current?.value;
        let additionalInfo = patientAdditionalInfoRef.current?.value;

        if (email == null || password == null || name == null || additionalInfo == null ) { 
            console.log('Error: Missing required fields.'); 
            return; 
        }

        if (email == "" || password == "" || name == "" || additionalInfo == "" ) { 
            console.log('Error: Missing required fields.'); 
            return; 
        }

        if (auth.currentUser == null) { console.log('Error: Admin not authenticated. Please re-login.'); return; }

        let docId = auth.currentUser?.uid;

        if (docId == null) { console.log('Error: Doctor not authenticated. Please re-login.'); return; }

        registerPatient(email, password, docId, name, additionalInfo);
    }

    switch (props.userType) {
        case 'doctor':
            return (
                <div className="flex flex-col space-y-4 justify-start items-center">
                    <h1>Doctor Registration</h1>
                    <input type="text" placeholder="Name" className="text-black p-2 rounded-lg" ref={doctorNameRef} />
                    <input type="email" placeholder="Email" className="text-black p-2 rounded-lg" ref={doctorEmailRef} />
                    <input type="password" placeholder="Temporary Password" className="text-black p-2 rounded-lg" ref={doctorPasswordRef} />
                    <button>Register</button>
                </div>
            );
        case 'patient':
            return (
                <div className="flex flex-col space-y-4 justify-start items-center">
                    <h1>Patient Registration</h1>
                    <input type="text" placeholder="Name" className="text-black p-2 rounded-lg" ref={patientNameRef} />
                    <input type="email" placeholder="Email" className="text-black p-2 rounded-lg" ref={patientEmailRef}  />
                    <input type="password" placeholder="Temporary Password" className="text-black p-2 rounded-lg" ref={patientPasswordRef} />
                    <input type="text" placeholder="Additional Info" className="text-black p-2 rounded-lg" ref={patientAdditionalInfoRef} />
                    <button onClick={registerPatientDb}> Register</button>
                </div>
            );
        case 'admin':
            return (
                <div className="flex flex-col space-y-4 justify-start items-center">
                    <h1>Admin Registration</h1>
                    <input type="text" placeholder="Name" className="text-black p-2 rounded-lg" ref={adminNameRef} />
                    <input type="email" placeholder="Email" className="text-black p-2 rounded-lg" ref={adminEmailRef} />
                    <input type="password" placeholder="Password" className="text-black p-2 rounded-lg" ref={adminPasswordRef} />
                    <button>Register</button>
                </div>
            );
    }
}