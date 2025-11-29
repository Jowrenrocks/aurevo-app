<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
     use Illuminate\Database\Eloquent\Model;
     use Laravel\Sanctum\HasApiTokens; // If using Sanctum
     class Event extends Model
     {
         use HasFactory, HasApiTokens;
         protected $fillable = [
             'title',
             'description',
             'start_at',
             'end_at',
             'location',
             'user_id',
             'status',
         ];
         // Relationships if needed
         public function creator()
         {
             return $this->belongsTo(User::class, 'user_id');
         }
         public function rsvps()
         {
             return $this->hasMany(Rsvp::class);
         }
     }
