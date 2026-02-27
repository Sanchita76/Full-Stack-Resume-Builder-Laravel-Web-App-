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
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('thumbnail_link')->nullable();
            
            // Template info (stored as JSON)
            $table->json('template')->nullable();
            
            // Profile info (stored as JSON)
            $table->json('profile_info')->nullable();
            
            // Contact info (stored as JSON)
            $table->json('contact_info')->nullable();
            
            // Work experience (stored as JSON array)
            $table->json('work_experience')->nullable();
            
            // Education (stored as JSON array)
            $table->json('education')->nullable();
            
            // Skills (stored as JSON array)
            $table->json('skills')->nullable();
            
            // Projects (stored as JSON array)
            $table->json('projects')->nullable();
            
            // Certifications (stored as JSON array)
            $table->json('certifications')->nullable();
            
            // Languages (stored as JSON array)
            $table->json('languages')->nullable();
            
            // Interests (stored as JSON array)
            $table->json('interests')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};
