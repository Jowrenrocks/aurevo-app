<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateEventsTable extends Migration {
  public function up(){
    Schema::create('events', function(Blueprint $t){
      $t->id();
      $t->string('title');
      $t->text('description')->nullable();
      $t->dateTime('start_at');
      $t->dateTime('end_at')->nullable();
      $t->string('location')->nullable();
      $t->unsignedBigInteger('created_by');
      $t->enum('status',['draft','pending','approved','declined','concluded'])->default('pending');
      $t->timestamps();

      $t->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
    });
  }
  public function down(){ Schema::dropIfExists('events'); }
}
