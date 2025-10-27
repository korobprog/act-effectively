<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    const ROLE_SUPER_ADMIN = 'super_admin';
    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_ADMIN]);
    }

    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    public function hasAdminAccess(): bool
    {
        return $this->isAdmin();
    }

    public function canManageAdmins(): bool
    {
        return $this->isSuperAdmin();
    }

    public function canManageUsers(): bool
    {
        return $this->isSuperAdmin();
    }
}