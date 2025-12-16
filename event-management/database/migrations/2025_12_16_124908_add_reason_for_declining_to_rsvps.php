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
        Schema::table('rsvps', function (Blueprint $table) {
            // Add reason_for_declining column
            $table->text('reason_for_declining')->nullable()->after('special_requests');
            
            // Update response enum to ensure yes, no, maybe are all included
            // Note: In MySQL, you need to redefine the entire enum
            $table->enum('response', ['yes', 'no', 'maybe'])->default('maybe')->change();
            
            // Update status enum to match
            $table->enum('status', ['attending', 'not_attending', 'maybe'])->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rsvps', function (Blueprint $table) {
            $table->dropColumn('reason_for_declining');
        });
    }
};