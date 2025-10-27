import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    const response = await axios.post<RegisterResponse>(
      `${API_URL}/register`,
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await axios.get<User>(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch {
      return null;
    }
  },
};

