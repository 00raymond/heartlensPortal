export interface UserDataInterface {
    userType: string;
    uid: string;
    name: string;
    isAdmin: boolean;
    isDoc: boolean;
    isPatient: boolean;
    patientEmail?: string;
    docEmail?: string;
    docId?: string;
    additionalInfo?: string;
}