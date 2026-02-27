<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Http\Request;

class AdminResumeController extends Controller
{
    /**
     * Get all resumes for a specific user (admin viewing)
     * 
     * @route GET /api/admin/users/{userId}/resumes
     * @access Admin only
     */
    // public function getUserResumes($userId)
    // {
    //     try {
    //         // Verify user exists
    //         $user = User::find($userId);
    //         if (!$user) {
    //             return response()->json([
    //                 'message' => 'User not found'
    //             ], 404);
    //         }

    //         $resumes = Resume::where('user_id', $userId)
    //             ->orderBy('updated_at', 'desc')
    //             ->get();

    //         $baseUrl = config('app.url');

    //         // Fix URLs and format response
    //         $formattedResumes = $resumes->map(function ($resume) use ($baseUrl) {
    //             // Fix thumbnail URL
    //             if ($resume->thumbnail_link && str_contains($resume->thumbnail_link, 'localhost')) {
    //                 $resume->thumbnail_link = str_replace('http://localhost:8000', $baseUrl, $resume->thumbnail_link);
    //             }

    //             // Fix profile preview URL
    //             if (isset($resume->profile_info['profilePreviewUrl']) && 
    //                 str_contains($resume->profile_info['profilePreviewUrl'], 'localhost')) {
    //                 $resume->profile_info['profilePreviewUrl'] = str_replace(
    //                     'http://localhost:8000',
    //                     $baseUrl,
    //                     $resume->profile_info['profilePreviewUrl']
    //                 );
    //             }

    //             return [
    //                 '_id' => $resume->id,
    //                 'userId' => $resume->user_id,
    //                 'title' => $resume->title,
    //                 'thumbnailLink' => $resume->thumbnail_link,
    //                 'template' => $resume->template,
    //                 'profileInfo' => $resume->profile_info,
    //                 'contactInfo' => $resume->contact_info,
    //                 'workExperience' => $resume->work_experience,
    //                 'education' => $resume->education,
    //                 'skills' => $resume->skills,
    //                 'projects' => $resume->projects,
    //                 'certifications' => $resume->certifications,
    //                 'languages' => $resume->languages,
    //                 'interests' => $resume->interests,
    //                 'createdAt' => $resume->created_at,
    //                 'updatedAt' => $resume->updated_at,
    //             ];
    //         });

    //         return response()->json([
    //             'user' => [
    //                 '_id' => $user->id,
    //                 'name' => $user->name,
    //                 'email' => $user->email,
    //             ],
    //             'resumes' => $formattedResumes,
    //         ], 200);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to fetch resumes',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }//Suggested to replace 



    public function getUserResumes($userId)
{
    try {
        // Verify user exists
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $resumes = Resume::where('user_id', $userId)
            ->orderBy('updated_at', 'desc')
            ->get();

        // ✅ SIMPLE - No URL manipulation
        $formattedResumes = $resumes->map(function ($resume) {
            return [
                '_id' => $resume->id,
                'userId' => $resume->user_id,
                'title' => $resume->title,
                'thumbnailLink' => $resume->thumbnail_link,
                'template' => $resume->template,
                'profileInfo' => $resume->profile_info,
                'contactInfo' => $resume->contact_info,
                'workExperience' => $resume->work_experience,
                'education' => $resume->education,
                'skills' => $resume->skills,
                'projects' => $resume->projects,
                'certifications' => $resume->certifications,
                'languages' => $resume->languages,
                'interests' => $resume->interests,
                'createdAt' => $resume->created_at,
                'updatedAt' => $resume->updated_at,
            ];
        });

        return response()->json([
            'user' => [
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // ✅ MAKE SURE THIS IS INCLUDED
            ],
            'resumes' => $formattedResumes,
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch resumes',
            'error' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Get single resume by ID (admin can view any resume)
     * 
     * @route GET /api/admin/resumes/{id}
     * @access Admin only
     */
    // public function getResumeById($id)
    // {
    //     try {
    //         $resume = Resume::find($id);

    //         if (!$resume) {
    //             return response()->json([
    //                 'message' => 'Resume not found'
    //             ], 404);
    //         }

    //         $baseUrl = config('app.url');

    //         // Fix URLs
    //         if ($resume->thumbnail_link && str_contains($resume->thumbnail_link, 'localhost')) {
    //             $resume->thumbnail_link = str_replace('http://localhost:8000', $baseUrl, $resume->thumbnail_link);
    //         }

    //         if (isset($resume->profile_info['profilePreviewUrl']) && 
    //             str_contains($resume->profile_info['profilePreviewUrl'], 'localhost')) {
    //             $resume->profile_info['profilePreviewUrl'] = str_replace(
    //                 'http://localhost:8000',
    //                 $baseUrl,
    //                 $resume->profile_info['profilePreviewUrl']
    //             );
    //         }

    //         return response()->json([
    //             '_id' => $resume->id,
    //             'userId' => $resume->user_id,
    //             'title' => $resume->title,
    //             'thumbnailLink' => $resume->thumbnail_link,
    //             'template' => $resume->template,
    //             'profileInfo' => $resume->profile_info,
    //             'contactInfo' => $resume->contact_info,
    //             'workExperience' => $resume->work_experience,
    //             'education' => $resume->education,
    //             'skills' => $resume->skills,
    //             'projects' => $resume->projects,
    //             'certifications' => $resume->certifications,
    //             'languages' => $resume->languages,
    //             'interests' => $resume->interests,
    //             'createdAt' => $resume->created_at,
    //             'updatedAt' => $resume->updated_at,
    //         ], 200);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to get resume',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }suggested to replace

    public function getResumeById($id)
{
    try {
        $resume = Resume::find($id);

        if (!$resume) {
            return response()->json([
                'message' => 'Resume not found'
            ], 404);
        }

        // ✅ SIMPLE - No URL manipulation
        return response()->json([
            '_id' => $resume->id,
            'userId' => $resume->user_id,
            'title' => $resume->title,
            'thumbnailLink' => $resume->thumbnail_link,
            'template' => $resume->template,
            'profileInfo' => $resume->profile_info,
            'contactInfo' => $resume->contact_info,
            'workExperience' => $resume->work_experience,
            'education' => $resume->education,
            'skills' => $resume->skills,
            'projects' => $resume->projects,
            'certifications' => $resume->certifications,
            'languages' => $resume->languages,
            'interests' => $resume->interests,
            'createdAt' => $resume->created_at,
            'updatedAt' => $resume->updated_at,
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to get resume',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Create resume for a user (admin creating on behalf)
     * 
     * @route POST /api/admin/users/{userId}/resumes
     * @access Admin only
     */
    public function createResumeForUser(Request $request, $userId)
    {
        try {
            // Verify user exists
            $user = User::find($userId);
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            // Default template
            $defaultResumeData = [
                'profile_info' => [
                    'profileImg' => null,
                    'previewUrl' => '',
                    'fullName' => '',
                    'designation' => '',
                    'summary' => '',
                ],
                'contact_info' => [
                    'email' => '',
                    'phone' => '',
                    'location' => '',
                    'linkedin' => '',
                    'github' => '',
                    'website' => '',
                ],
                'work_experience' => [
                    [
                        'company' => '',
                        'role' => '',
                        'startDate' => '',
                        'endDate' => '',
                        'description' => '',
                    ],
                ],
                'education' => [
                    [
                        'degree' => '',
                        'institution' => '',
                        'startDate' => '',
                        'endDate' => '',
                    ],
                ],
                'skills' => [
                    [
                        'name' => '',
                        'progress' => 0,
                    ],
                ],
                'projects' => [
                    [
                        'title' => '',
                        'description' => '',
                        'github' => '',
                        'liveDemo' => '',
                    ],
                ],
                'certifications' => [
                    [
                        'title' => '',
                        'issuer' => '',
                        'year' => '',
                    ],
                ],
                'languages' => [
                    [
                        'name' => '',
                        'progress' => 0,
                    ],
                ],
                'interests' => [''],
            ];

            // Create resume
            $resume = Resume::create([
                'user_id' => $userId, // Create for specified user
                'title' => $request->title ?? 'Untitled Resume',
                'template' => $request->template ?? ['theme' => '01', 'colorPalette' => []],
                'profile_info' => $defaultResumeData['profile_info'],
                'contact_info' => $defaultResumeData['contact_info'],
                'work_experience' => $defaultResumeData['work_experience'],
                'education' => $defaultResumeData['education'],
                'skills' => $defaultResumeData['skills'],
                'projects' => $defaultResumeData['projects'],
                'certifications' => $defaultResumeData['certifications'],
                'languages' => $defaultResumeData['languages'],
                'interests' => $defaultResumeData['interests'],
            ]);

            // Format response to match MongoDB structure
            return response()->json([
                'message' => 'Resume created successfully for user',
                'newResume' => [
                    'userId' => $resume->user_id,
                    '_id' => $resume->id,
                    'title' => $resume->title,
                    'template' => $resume->template,
                    'profileInfo' => $resume->profile_info,
                    'contactInfo' => $resume->contact_info,
                    'workExperience' => $resume->work_experience,
                    'education' => $resume->education,
                    'skills' => $resume->skills,
                    'projects' => $resume->projects,
                    'certifications' => $resume->certifications,
                    'languages' => $resume->languages,
                    'interests' => $resume->interests,
                    'createdAt' => $resume->created_at,
                    'updatedAt' => $resume->updated_at,
                    '__v' => 0,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create resume',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
 * Upload resume images (thumbnail and profile picture) - Admin version
 * 
 * @route PUT /api/admin/resumes/{id}/upload-images
 * @access Admin only
 */
// public function uploadResumeImages(Request $request, $id)   fixing uplaod image finally befoere showing by claude
// {
//     try {
//         $resume = Resume::find($id);

//         if (!$resume) {
//             return response()->json([
//                 'message' => 'Resume not found'
//             ], 404);
//         }

//         $baseUrl = config('app.url');
//         $thumbnailLink = $resume->thumbnail_link;
//         $profilePreviewUrl = $resume->profile_info['profilePreviewUrl'] ?? '';

//         // Upload thumbnail if provided
//         if ($request->hasFile('thumbnail')) {
//             $thumbnailFile = $request->file('thumbnail');
//             $thumbnailName = time() . '-' . $thumbnailFile->getClientOriginalName();
//             $thumbnailFile->move(public_path('uploads'), $thumbnailName);
//             $thumbnailLink = $baseUrl . '/uploads/' . $thumbnailName;

//             // Delete old thumbnail
//             if ($resume->thumbnail_link) {
//                 $oldFile = public_path('uploads/' . basename($resume->thumbnail_link));
//                 if (file_exists($oldFile)) {
//                     unlink($oldFile);
//                 }
//             }
//         }

//         // Upload profile image if provided
//         if ($request->hasFile('profileImage')) {
//             $profileFile = $request->file('profileImage');
//             $profileName = time() . '-profile-' . $profileFile->getClientOriginalName();
//             $profileFile->move(public_path('uploads'), $profileName);
//             $profilePreviewUrl = $baseUrl . '/uploads/' . $profileName;

//             // Delete old profile image
//             if (isset($resume->profile_info['profilePreviewUrl'])) {
//                 $oldFile = public_path('uploads/' . basename($resume->profile_info['profilePreviewUrl']));
//                 if (file_exists($oldFile)) {
//                     unlink($oldFile);
//                 }
//             }
//         }

//         // Update resume
//         $resume->thumbnail_link = $thumbnailLink;
        
//         $profileInfo = $resume->profile_info ?? [];
//         $profileInfo['profilePreviewUrl'] = $profilePreviewUrl;
//         $resume->profile_info = $profileInfo;
        
//         $resume->save();

//         return response()->json([
//             'message' => 'Images uploaded successfully',
//             'thumbnailLink' => $thumbnailLink,
//             'profilePreviewUrl' => $profilePreviewUrl,
//         ], 200);

//     } catch (\Exception $e) {
//         return response()->json([
//             'message' => 'Failed to upload images',
//             'error' => $e->getMessage()
//         ], 500);
//     }
// }




public function uploadResumeImages(Request $request, $id)
{
    // ✅ CRITICAL DEBUG - Check if Laravel receives the file
    file_put_contents(
    storage_path('logs/upload-debug.txt'),
    "=== UPLOAD REQUEST ===" . PHP_EOL .
    "Time: " . now() . PHP_EOL .
    "Resume ID: " . $id . PHP_EOL .
    "Has thumbnail: " . ($request->hasFile('thumbnail') ? 'YES' : 'NO') . PHP_EOL .
    "Has profile: " . ($request->hasFile('profileImage') ? 'YES' : 'NO') . PHP_EOL .
    PHP_EOL,
    FILE_APPEND
);
    try {


    // ✅ DEBUG: Log what we receive
        error_log('=== UPLOAD DEBUG ===');
        error_log('Has thumbnail file: ' . ($request->hasFile('thumbnail') ? 'YES' : 'NO'));
        error_log('Has profile file: ' . ($request->hasFile('profileImage') ? 'YES' : 'NO'));
        error_log('All request files: ' . json_encode($request->allFiles()));
        error_log('Request method: ' . $request->method());
        error_log('Content-Type: ' . $request->header('Content-Type'));



        $resume = Resume::find($id);

        if (!$resume) {
            return response()->json([
                'message' => 'Resume not found'
            ], 404);
        }

        $baseUrl = config('app.url');
        $thumbnailLink = $resume->thumbnail_link;
        $profilePreviewUrl = $resume->profile_info['profilePreviewUrl'] ?? '';

        // ✅ Upload thumbnail if provided
        if ($request->hasFile('thumbnail')) {
            error_log('📸 Processing thumbnail upload');
            $thumbnailFile = $request->file('thumbnail');
            $thumbnailName = time() . '-' . $thumbnailFile->getClientOriginalName();
            $thumbnailFile->move(public_path('uploads'), $thumbnailName);
            $thumbnailLink = $baseUrl . '/uploads/' . $thumbnailName;
            error_log('✅ Thumbnail saved: ' . $thumbnailLink);


            // Delete old thumbnail
            if ($resume->thumbnail_link) {
                $oldFile = public_path('uploads/' . basename($resume->thumbnail_link));
                if (file_exists($oldFile)) {
                    @unlink($oldFile);
                }
            }
        }
        else {
            error_log('⚠️ NO thumbnail file received!');
        }

        // ✅ Upload profile image if provided
        if ($request->hasFile('profileImage')) {
            error_log('👤 Processing profile image upload');
            $profileFile = $request->file('profileImage');
            $profileName = time() . '-profile-' . $profileFile->getClientOriginalName();
            $profileFile->move(public_path('uploads'), $profileName);
            
            // ✅ CRITICAL: Set the SERVER URL, not blob URL
            $profilePreviewUrl = $baseUrl . '/uploads/' . $profileName;
            error_log('✅ Profile image saved: ' . $profilePreviewUrl);

            // Delete old profile image
            $profileInfo = $resume->profile_info ?? [];
            if (isset($profileInfo['profilePreviewUrl']) && !empty($profileInfo['profilePreviewUrl'])) {
                $oldFile = public_path('uploads/' . basename($profileInfo['profilePreviewUrl']));
                if (file_exists($oldFile)) {
                    @unlink($oldFile);
                }
            }
         } else {
            error_log('⚠️ NO profile image file received!');
        }

        // ✅ Update database
        $profileInfo = $resume->profile_info ?? [];
        $profileInfo['profilePreviewUrl'] = $profilePreviewUrl;
        $resume->profile_info = $profileInfo;
        $resume->thumbnail_link = $thumbnailLink;
        $resume->save();


        error_log('💾 Saved to DB - thumbnailLink: ' . ($thumbnailLink ?? 'NULL'));
        error_log('💾 Saved to DB - profilePreviewUrl: ' . ($profilePreviewUrl ?? 'NULL'));


        // ✅ Return server URLs (NOT blob URLs!)
        return response()->json([
            'message' => 'Images uploaded successfully',
            'thumbnailLink' => $thumbnailLink,
            'profilePreviewUrl' => $profilePreviewUrl,
        ], 200);

    } catch (\Exception $e) {
        error_log('❌ Upload error: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to upload images',
            'error' => $e->getMessage()
        ], 500);
    }
}






    /**
     * Update resume (admin can edit any resume)
     * 
     * @route PUT /api/admin/resumes/{id}
     * @access Admin only
     */
    public function updateResume(Request $request, $id)
    {
        try {
            $resume = Resume::find($id);

            if (!$resume) {
                return response()->json([
                    'message' => 'Resume not found'
                ], 404);
            }

            $updates = $request->all();

            // Prevent overwriting valid image URLs with empty strings
            if (isset($updates['thumbnailLink']) && $updates['thumbnailLink'] === '') {
                unset($updates['thumbnailLink']);
            }

            if (isset($updates['profileInfo']['profilePreviewUrl']) && 
                $updates['profileInfo']['profilePreviewUrl'] === '') {
                unset($updates['profileInfo']['profilePreviewUrl']);
            }

            // Deep merge for nested objects
            if (isset($updates['profileInfo'])) {
                $resume->profile_info = array_merge($resume->profile_info ?? [], $updates['profileInfo']);
            }

            if (isset($updates['contactInfo'])) {
                $resume->contact_info = array_merge($resume->contact_info ?? [], $updates['contactInfo']);
            }

            if (isset($updates['template'])) {
                $resume->template = array_merge($resume->template ?? [], $updates['template']);
            }

            // Update arrays directly
            if (isset($updates['workExperience'])) {
                $resume->work_experience = $updates['workExperience'];
            }

            if (isset($updates['education'])) {
                $resume->education = $updates['education'];
            }

            if (isset($updates['skills'])) {
                $resume->skills = $updates['skills'];
            }

            if (isset($updates['projects'])) {
                $resume->projects = $updates['projects'];
            }

            if (isset($updates['certifications'])) {
                $resume->certifications = $updates['certifications'];
            }

            if (isset($updates['languages'])) {
                $resume->languages = $updates['languages'];
            }

            if (isset($updates['interests'])) {
                $resume->interests = $updates['interests'];
            }

            if (isset($updates['title'])) {
                $resume->title = $updates['title'];
            }

            if (isset($updates['thumbnailLink'])) {
                $resume->thumbnail_link = $updates['thumbnailLink'];
            }

            $resume->save();

            return response()->json([
                'message' => 'Resume updated successfully',
                '_id' => $resume->id,
                'userId' => $resume->user_id,
                'title' => $resume->title,
                'thumbnailLink' => $resume->thumbnail_link,
                'template' => $resume->template,
                'profileInfo' => $resume->profile_info,
                'contactInfo' => $resume->contact_info,
                'workExperience' => $resume->work_experience,
                'education' => $resume->education,
                'skills' => $resume->skills,
                'projects' => $resume->projects,
                'certifications' => $resume->certifications,
                'languages' => $resume->languages,
                'interests' => $resume->interests,
                'createdAt' => $resume->created_at,
                'updatedAt' => $resume->updated_at,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update resume',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**  
     * Delete resume (admin can delete any resume)
     * 
     * @route DELETE /api/admin/resumes/{id}
     * @access Admin only
     */
    public function deleteResume($id)
    {
        try {
            $resume = Resume::find($id);

            if (!$resume) {
                return response()->json([
                    'message' => 'Resume not found'
                ], 404);
            }

            // Delete thumbnail image from uploads folder
            if ($resume->thumbnail_link) {
                $filename = basename($resume->thumbnail_link);
                $filepath = public_path('uploads/' . $filename);
                if (file_exists($filepath)) {
                    unlink($filepath);
                }
            }

            // Delete profile image from uploads folder
            if (isset($resume->profile_info['profilePreviewUrl'])) {
                $filename = basename($resume->profile_info['profilePreviewUrl']);
                $filepath = public_path('uploads/' . $filename);
                if (file_exists($filepath)) {
                    unlink($filepath);
                }
            }

            $resume->delete();

            return response()->json([
                'message' => 'Resume deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete resume',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}