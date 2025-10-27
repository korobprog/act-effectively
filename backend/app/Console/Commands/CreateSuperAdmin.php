<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create-super {--email=} {--password=} {--name=Super Admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a super admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email') ?: env('SUPER_ADMIN_EMAIL');
        $password = $this->option('password') ?: env('SUPER_ADMIN_PASSWORD');
        $name = $this->option('name') ?: 'Super Admin';

        if (!$email) {
            $this->error('Email is required. Use --email option or set SUPER_ADMIN_EMAIL in .env');
            return Command::FAILURE;
        }

        if (!$password) {
            $this->error('Password is required. Use --password option or set SUPER_ADMIN_PASSWORD in .env');
            return Command::FAILURE;
        }

        $existingUser = User::where('email', $email)->first();
        
        if ($existingUser) {
            if ($this->confirm("User with email '{$email}' already exists. Do you want to update it to super admin?")) {
                $existingUser->update([
                    'role' => User::ROLE_SUPER_ADMIN,
                    'password' => Hash::make($password),
                ]);
                $this->info("Super admin '{$email}' updated successfully!");
                return Command::SUCCESS;
            }
            return Command::FAILURE;
        }

        try {
            User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => User::ROLE_SUPER_ADMIN,
            ]);

            $this->info("Super admin '{$name}' with email '{$email}' created successfully!");
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Failed to create super admin: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

