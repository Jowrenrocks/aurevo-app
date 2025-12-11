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
        Schema::create('rsvps', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('user_id')->nullable();
            $t->unsignedBigInteger('event_id');
            $t->enum('response',['yes','no','maybe'])->default('maybe');
            $t->enum('status',['attending','not_attending','maybe'])->nullable();
            $t->string('guest_name')->nullable();
            $t->string('guest_email')->nullable();
            $t->string('guest_phone')->nullable();
            $t->integer('guests')->default(1);
            $t->text('special_requests')->nullable();
            $t->timestamps();

            $t->unique(['user_id','event_id']);
            $t->unique(['event_id','guest_email']);
            $t->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $t->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rsvps');
    }
};
