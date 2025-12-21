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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->nullable()->constrained()->onDelete('cascade');
            
            // Notification details
            $table->enum('type', ['email', 'sms', 'push'])->default('email');
            $table->string('title');
            $table->text('message');
            
            // Status tracking
            $table->enum('status', ['sent', 'scheduled', 'draft', 'failed'])->default('draft');
            $table->integer('recipient_count')->default(0);
            $table->json('recipient_emails')->nullable();
            
            // Scheduling
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamp('sent_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'status']);
            $table->index('event_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};