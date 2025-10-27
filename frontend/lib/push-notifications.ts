import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Запрос разрешения
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('Desktop notifications not supported');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeToPushNotifications(): Promise<boolean> {
    try {
        console.log('Starting push notification subscription...');
        
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.error('Push messaging is not supported');
            return false;
        }

        console.log('Service Worker and PushManager are supported');

        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
            console.error('Permission denied for notifications');
            return false;
        }

        console.log('Notification permission granted');

        // Check if service worker is registered
        console.log('Checking for existing service worker registration...');
        const existingRegistration = await navigator.serviceWorker.getRegistration();
        
        if (!existingRegistration) {
            console.log('Service Worker not found. Registering now...');
            try {
                await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                console.log('Service Worker registered successfully');
            } catch (err) {
                console.error('Error registering service worker:', err);
                return false;
            }
        } else {
            console.log('Service Worker already registered');
        }
        
        console.log('Waiting for service worker to be ready...');
        const readyRegistration = await navigator.serviceWorker.ready;
        console.log('Service Worker is ready', readyRegistration);
        
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
        console.log('VAPID Key:', vapidKey ? vapidKey.substring(0, 20) + '...' : 'NOT FOUND');
        
        if (!vapidKey) {
            console.error('VAPID public key is missing');
            return false;
        }
        
        const applicationServerKey = urlBase64ToUint8Array(vapidKey);
        console.log('Converted VAPID key to Uint8Array');
        
        const subscription = await readyRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as unknown as BufferSource,
        });

        console.log('Successfully subscribed to push notifications', subscription);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        console.log('Sending subscription to backend:', API_URL);

        const response = await axios.post(
            `${API_URL}/webpush/subscribe`,
            subscription.toJSON(),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Backend response:', response.status, response.data);
        return response.status === 200 || response.status === 201;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
        return false;
    }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
            
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/webpush/unsubscribe`,
                subscription.toJSON(),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return false;
    }
}