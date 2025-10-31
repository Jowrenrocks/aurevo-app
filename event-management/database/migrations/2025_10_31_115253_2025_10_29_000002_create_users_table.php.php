<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateUsersTable extends Migration {
  public function up(){
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('full_name',100);
      $table->string('email')->unique();
      $table->string('password');
      $table->unsignedBigInteger('role_id')->default(2);
      $table->timestamp('email_verified_at')->nullable();
      $table->rememberToken();
      $table->timestamps();

      $table->foreign('role_id')->references('id')->on('roles')->onDelete('restrict');
    });
  }
  public function down(){ Schema::dropIfExists('users'); }
}
