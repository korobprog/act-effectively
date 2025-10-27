<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\PushNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function sendToUser(Request $request, $userId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'url' => 'nullable|url',
        ]);

        $recipient = User::findOrFail($userId);
        $notification = new PushNotification($request->title, $request->body, $request->url);
        
        $recipient->notify($notification);

        return response()->json(['message' => 'Уведомление отправлено']);
    }

    public function sendToAllUsers(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'url' => 'nullable|url',
        ]);

        $users = User::where('role', User::ROLE_USER)->get();
        $notification = new PushNotification($request->title, $request->body, $request->url);

        foreach ($users as $user) {
            $user->notify($notification);
        }

        return response()->json([
            'message' => "Уведомление отправлено {$users->count()} пользователям"
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

        foreach ($admins as $admin) {
            $admin->notify($notification);
        }

        return response()->json([
            'message' => "Уведомление отправлено {$admins->count()} администраторам"
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
}