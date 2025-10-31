<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateRolesTable extends Migration {
  public function up(){
    Schema::create('roles', function(Blueprint $t){
      $t->id();
      $t->string('name')->unique();
      $t->timestamps();
    });
  }
  public function down(){ Schema::dropIfExists('roles'); }
}
