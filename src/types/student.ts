export interface Parent {
    name: string;
    phone: string;
    relation: 'Father' | 'Mother' | 'Guardian';
    email?: string;
}

export interface Student {
    id: string; // Unique ID for QR Code
    firstName: string;
    lastName: string;
    admissionNumber: string;
    grade: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    parents: Parent[];
    medicalInfo?: string;
    balance: number;
}
