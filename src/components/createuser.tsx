interface CreateUserProps {
    userType: string;
}

export default function CreateUser(props: CreateUserProps) {


    switch (props.userType) {
        case 'doctor':
            return (
                <div>
                    <h1>Doctor Registration Invite</h1>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Temporary Password" />
                    <button>Register</button>
                </div>
            );
        case 'patient':
            return (
                <div>
                    <h1>Patient Registration</h1>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Temporary Password" />
                    <input type="text" placeholder="Additional Info" />
                    <button>Register</button>
                </div>
            );
        case 'admin':
            return (
                <div>
                    <h1>Admin Registration</h1>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Register</button>
                </div>
            );
    }
}