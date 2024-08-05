export interface UserDataInterface {
    userType: string;
    uid: string;
    name: string;
    isAdmin: boolean;
    isDoc: boolean;
    isPatient: boolean;
    email?: string;
    parentEmail?: string;
    parentId?: string;
    isActive: true;
    additionalInfo?: string;
}