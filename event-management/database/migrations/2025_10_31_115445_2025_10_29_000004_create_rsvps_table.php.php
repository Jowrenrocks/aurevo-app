<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateRsvpsTable extends Migration {
  public function up(){
    Schema::create('rsvps', function(Blueprint $t){
      $t->id();
      $t->unsignedBigInteger('user_id');
      $t->unsignedBigInteger('event_id');
      $t->enum('response',['yes','no','maybe'])->default('maybe');
      $t->timestamps();

      $t->unique(['user_id','event_id']);
      $t->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
    });
  }
  public function down(){ Schema::dropIfExists('rsvps'); }
}
