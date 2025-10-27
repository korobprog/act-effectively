import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type UserRole = 'super_admin' | 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole
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

export interface CreateAdminResponse {
  message: string;
  admin: User;
  password: string;
}

export interface ListUsersResponse {
  users: User[];
}

export interface ListAdminsResponse {
  admins: User[];
}

export interface UpdateRoleResponse {
  message: string;
  user: User;
}

export const userHelpers = {
    isSuperAdmin(user: User | null): boolean {
      return user?.role === 'super_admin';
    },
    
    isAdmin(user: User | null): boolean {
      return user?.role === 'admin' || user?.role === 'super_admin';
    },
    
    isUser(user: User | null): boolean {
      return user?.role === 'user';
    },
    
    hasAdminAccess(user: User | null): boolean {
      return user?.role === 'admin' || user?.role === 'super_admin';
    },
  };

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
      return response.data
    } catch {
      return null;
    }
  },
};

export const adminApi = {
  async createAdmin(name: string, email: string, password: string): Promise<CreateAdminResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.post<CreateAdminResponse>(
      `${API_URL}/admin/create`,
      { name, email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  },

  async deleteAdmin(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  },

  async listAdmins(): Promise<User[]> {
    const token = localStorage.getItem("token");
    const response = await axios.get<ListAdminsResponse>(`${API_URL}/admin/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data.admins;
  },

  async listUsers(): Promise<User[]> {
    const token = localStorage.getItem("token");
    const response = await axios.get<ListUsersResponse>(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data.users;
  },

  async deleteUser(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  },

  async updateUserRole(id: number, role: 'admin' | 'user'): Promise<User> {
    const token = localStorage.getItem("token");
    const response = await axios.patch<UpdateRoleResponse>(
      `${API_URL}/admin/users/${id}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.user;
  },
};

