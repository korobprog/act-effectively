<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    public function createAdmin(Request $request)
    {
        if (!$request->user()->canManageAdmins()) {
            return response()->json([
                'message' => 'Доступ запрещен. Только супер-администратор может создавать администраторов.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::min(8)],
        ]);

        $plainPassword = $request->password;

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($plainPassword),
            'role' => User::ROLE_ADMIN,
        ]);

        return response()->json([
            'message' => 'Администратор успешно создан',
            'admin' => $admin,
            'password' => $plainPassword,
        ], 201);
    }

    public function listAdmins(Request $request)
    {
        if (!$request->user()->canManageAdmins()) {
            return response()->json([
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $admins = User::where('role', '!=', User::ROLE_USER)
                     ->select('id', 'name', 'email', 'role', 'created_at')
                     ->get();

        return response()->json([
            'admins' => $admins,
        ], 200);
    }

    public function deleteAdmin(Request $request, $id)
    {
        if (!$request->user()->canManageAdmins()) {
            return response()->json([
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $admin = User::findOrFail($id);

        if ($admin->id === $request->user()->id) {
            return response()->json([
                'message' => 'Вы не можете удалить свой собственный аккаунт'
            ], 400);
        }

        $admin->delete();

        return response()->json([
            'message' => 'Администратор удален',
        ], 200);
    }

    public function listUsers(Request $request)
    {
        if (!$request->user()->canManageUsers()) {
            return response()->json([
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at')
                     ->get();

        return response()->json([
            'users' => $users,
        ], 200);
    }

    public function deleteUser(Request $request, $id)
    {
        if (!$request->user()->canManageUsers()) {
            return response()->json([
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $user = User::findOrFail($id);

        if ($user->isSuperAdmin()) {
            return response()->json([
                'message' => 'Нельзя удалить супер-администратора'
            ], 400);
        }

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Вы не можете удалить свой собственный аккаунт'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => 'Пользователь удален',
        ], 200);
    }

    public function updateUserRole(Request $request, $id)
    {
        if (!$request->user()->canManageUsers()) {
            return response()->json([
                'message' => 'Доступ запрещен'
            ], 403);
        }

        $request->validate([
            'role' => 'required|string|in:admin,user',
        ]);

        $user = User::findOrFail($id);

        if ($user->isSuperAdmin()) {
            return response()->json([
                'message' => 'Нельзя изменить роль супер-администратора'
            ], 400);
        }

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Вы не можете изменить свою собственную роль'
            ], 400);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Роль пользователя обновлена',
            'user' => $user,
        ], 200);
    }
}