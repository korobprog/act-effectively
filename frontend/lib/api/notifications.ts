import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface SendNotificationRequest {
    title: string;
    body: string;
    url?: string;
}

export const notificationApi = {
    async sendToUser(userId: number, notification: SendNotificationRequest) {
        const token = localStorage.getItem("token");
        return axios.post(
            `${API_URL}/notifications/send/user/${userId}`,
            notification,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },

    async sendToAllUsers(notification: SendNotificationRequest) {
        const token = localStorage.getItem("token");
        return axios.post(
            `${API_URL}/notifications/send/all-users`,
            notification,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },

    async sendToAllAdmins(notification: SendNotificationRequest) {
        const token = localStorage.getItem("token");
        return axios.post(
            `${API_URL}/notifications/send/all-admins`,
            notification,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },
};