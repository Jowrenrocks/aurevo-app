<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure admin role exists
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Create default admin
        User::updateOrCreate(
            ['email' => 'jowrenrocks@gmail.com'],
            [
                'full_name' => 'System Administrator',
                'password' => Hash::make('ambotnibuday'),
                'role_id' => $adminRole->id,
            ]
        );

        // Create default user for testing event creation
        User::updateOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'full_name' => 'Test User',
                'password' => Hash::make('johnwrendell'),
                'role_id' => $userRole->id,
            ]
        );  
    }
}
