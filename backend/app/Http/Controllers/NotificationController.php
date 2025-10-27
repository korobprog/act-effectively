<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\PushNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function sendToUser(Request $request, $userId)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'url' => 'nullable|url',
        ]);

        $recipient = User::findOrFail($userId);
        $notification = new PushNotification($request->title, $request->body, $request->url);
        
        $recipient->notify($notification);

        $devices = $recipient->pushSubscriptions()->count();

        return response()->json([
            'message' => 'Уведомление отправлено',
            'devices' => $devices
        ]);
    }

    public function sendToAllUsers(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'url' => 'nullable|url',
        ]);

        $users = User::where('role', User::ROLE_USER)->get();
        $notification = new PushNotification($request->title, $request->body, $request->url);

        $totalDevices = 0;
        foreach ($users as $user) {
            $user->notify($notification);
            $totalDevices += $user->pushSubscriptions()->count();
        }

        return response()->json([
            'message' => "Уведомление отправлено",
            'count' => $totalDevices,
            'devices' => $totalDevices
        ]);
    }

    public function sendToAllAdmins(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'url' => 'nullable|url',
        ]);

        $admins = User::whereIn('role', [User::ROLE_ADMIN, User::ROLE_SUPER_ADMIN])->get();
        $notification = new PushNotification($request->title, $request->body, $request->url);

        $totalDevices = 0;
        foreach ($admins as $admin) {
            $admin->notify($notification);
            $totalDevices += $admin->pushSubscriptions()->count();
        }

        return response()->json([
            'message' => "Уведомление отправлено",
            'count' => $totalDevices,
            'devices' => $totalDevices
        ]);
    }

    public function subscribers(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $subscribers = \NotificationChannels\WebPush\PushSubscription::with('subscribable')
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'user' => $sub->subscribable,
                    'endpoint' => $sub->endpoint,
                    'subscribed_at' => $sub->created_at,
                ];
            });

        return response()->json(['subscribers' => $subscribers]);
    }

    public function subscribe(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'endpoint' => 'required|url',
            'keys.p256dh' => 'required',
            'keys.auth' => 'required',
        ]);

        $user->updatePushSubscription(
            $request->input('endpoint'),
            $request->input('keys.p256dh'),
            $request->input('keys.auth')
        );

        return response()->json(['message' => 'Подписка успешно сохранена'], 201);
    }

    public function unsubscribe(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'endpoint' => 'required|url',
        ]);

        $user->deletePushSubscription($request->input('endpoint'));

        return response()->json(['message' => 'Подписка удалена'], 200);
    }
}