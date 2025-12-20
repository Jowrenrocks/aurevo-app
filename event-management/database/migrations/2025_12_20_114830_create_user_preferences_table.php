<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Admin notification preferences
            $table->boolean('new_user_registered')->default(true);
            $table->boolean('new_event_created')->default(true);
            $table->boolean('new_rsvp_received')->default(true);
            $table->boolean('upcoming_event_reminders')->default(true);
            $table->boolean('flagged_event_alerts')->default(true);
            $table->boolean('daily_summary')->default(false);
            $table->boolean('weekly_report')->default(true);
            
            $table->timestamps();

            // Ensure one preference record per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};