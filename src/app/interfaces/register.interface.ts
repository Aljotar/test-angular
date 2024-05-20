export interface RegisterResponse {
    success: boolean;
    response?: RegistryResponse;
    error?: ErrorResponse;
}

export interface RegistryResponse {
    firstname:  string;
    lastname:   string;
    email:      string;
    phone:      string;
    photo:      string;
    role:       number;
    updated_at: Date;
    created_at: Date;
    id:         number;
}

export interface ErrorResponse {
    code: number;
    message: string;
}
