export interface User {
    id: string;
    userName: string;
    email: string;
    token: string;
    roles: string[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData{
    email: string;
    password: string;
    userName: string;
}