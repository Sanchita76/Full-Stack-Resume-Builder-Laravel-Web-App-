<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Resume extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'thumbnail_link',
        'template',
        'profile_info',
        'contact_info',
        'work_experience',
        'education',
        'skills',
        'projects',
        'certifications',
        'languages',
        'interests',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'template' => 'array',
        'profile_info' => 'array',
        'contact_info' => 'array',
        'work_experience' => 'array',
        'education' => 'array',
        'skills' => 'array',
        'projects' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
        'interests' => 'array',
    ];

    /**
     * Relationship: A resume belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
