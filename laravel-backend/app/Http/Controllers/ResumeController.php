<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ResumeController extends Controller
{
    /**
     * Create a new Resume
     * 
     * @route POST /api/resume
     * @access Private
     */
    public function createResume(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'template' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first()
                ], 400);
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
                'user_id' => $request->user()->id,
                'title' => $request->title,
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
     * Get all resumes for logged-in user
     * 
     * @route GET /api/resume
     * @access Private
     */
    // public function getUserResumes(Request $request)  //resume fetching failing
    // {
    //     try {
    //         $resumes = Resume::where('user_id', $request->user()->id)
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

    //         return response()->json($formattedResumes, 200);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to fetch resumes',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }




    public function getUserResumes(Request $request)
{
    try {
        $resumes = Resume::where('user_id', $request->user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        // ✅ SIMPLE - No URL manipulation (removing str_contains)
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

        return response()->json($formattedResumes, 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch resumes',
            'error' => $e->getMessage()
        ], 500);
    }
}






    /**
     * Get single resume by ID
     * 
     * @route GET /api/resume/{id}
     * @access Private
     */
    // public function getResumeById(Request $request, $id)   fixing resumes not appaering in user dashboard
    // {
    //     try {
    //         $resume = Resume::where('id', $id)
    //             ->where('user_id', $request->user()->id)
    //             ->first();

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
    // }



    public function getResumeById(Request $request, $id)
{
    try {
        $resume = Resume::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

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
     * Update a resume
     * 
     * @route PUT /api/resume/{id}
     * @access Private
     */
    public function updateResume(Request $request, $id)
    {
        try {
            $resume = Resume::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$resume) {
                return response()->json([
                    'message' => 'Resume not found or unauthorized'
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
     * Delete a resume
     * 
     * @route DELETE /api/resume/{id}
     * @access Private
     */
    public function deleteResume(Request $request, $id)
    {
        try {
            $resume = Resume::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$resume) {
                return response()->json([
                    'message' => 'Resume not found or unauthorized'
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

    /**
     * Upload resume images (thumbnail and profile image)   fixing upload resume images  finally by claude before showing
     * 
     * @route PUT /api/resume/{id}/upload-images
     * @access Private
     */
    // public function uploadResumeImages(Request $request, $id)
    // {
    //     try {
    //         $resume = Resume::where('id', $id)
    //             ->where('user_id', $request->user()->id)
    //             ->first();

    //         if (!$resume) {
    //             return response()->json([
    //                 'message' => 'Resume not found or unauthorized'
    //             ], 404);
    //         }

    //         $baseUrl = config('app.url');
    //         $uploadPath = public_path('uploads');

    //         // Create uploads directory if it doesn't exist
    //         if (!file_exists($uploadPath)) {
    //             mkdir($uploadPath, 0777, true);
    //         }

    //         // Handle thumbnail upload
    //         if ($request->hasFile('thumbnail')) {
    //             $thumbnail = $request->file('thumbnail');
                
    //             // Delete old thumbnail
    //             if ($resume->thumbnail_link) {
    //                 $oldFilename = basename($resume->thumbnail_link);
    //                 $oldPath = $uploadPath . '/' . $oldFilename;
    //                 if (file_exists($oldPath)) {
    //                     unlink($oldPath);
    //                 }
    //             }

    //             // Upload new thumbnail
    //             $filename = time() . '-' . $thumbnail->getClientOriginalName();
    //             $thumbnail->move($uploadPath, $filename);
    //             $resume->thumbnail_link = $baseUrl . '/uploads/' . $filename;
    //         }

    //         // Handle profile image upload
    //         if ($request->hasFile('profileImage')) {
    //             $profileImage = $request->file('profileImage');
                
    //             // Delete old profile image
    //             if (isset($resume->profile_info['profilePreviewUrl'])) {
    //                 $oldFilename = basename($resume->profile_info['profilePreviewUrl']);
    //                 $oldPath = $uploadPath . '/' . $oldFilename;
    //                 if (file_exists($oldPath)) {
    //                     unlink($oldPath);
    //                 }
    //             }

    //             // Upload new profile image
    //             $filename = time() . '-' . $profileImage->getClientOriginalName();
    //             $profileImage->move($uploadPath, $filename);
                
    //             $profileInfo = $resume->profile_info ?? [];
    //             $profileInfo['profilePreviewUrl'] = $baseUrl . '/uploads/' . $filename;
    //             $resume->profile_info = $profileInfo;
    //         }

    //         $resume->save();

    //         return response()->json([
    //             'message' => 'Images uploaded successfully',
    //             'thumbnailLink' => $resume->thumbnail_link,
    //             'profilePreviewUrl' => $resume->profile_info['profilePreviewUrl'] ?? null,
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
    try {
        $resume = Resume::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$resume) {
            return response()->json([
                'message' => 'Resume not found or unauthorized'
            ], 404);
        }

        $baseUrl = config('app.url');
        $uploadPath = public_path('uploads');

        // Create uploads directory if it doesn't exist
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $thumbnailLink = $resume->thumbnail_link;
        $profilePreviewUrl = $resume->profile_info['profilePreviewUrl'] ?? '';

        // ✅ Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            
            // Delete old thumbnail
            if ($resume->thumbnail_link) {
                $oldFilename = basename($resume->thumbnail_link);
                $oldPath = $uploadPath . '/' . $oldFilename;
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            // Upload new thumbnail
            $filename = time() . '-' . $thumbnail->getClientOriginalName();
            $thumbnail->move($uploadPath, $filename);
            $thumbnailLink = $baseUrl . '/uploads/' . $filename;
        }

        // ✅ Handle profile image upload
        if ($request->hasFile('profileImage')) {
            $profileImage = $request->file('profileImage');
            
            // Delete old profile image
            $profileInfo = $resume->profile_info ?? [];
            if (isset($profileInfo['profilePreviewUrl']) && !empty($profileInfo['profilePreviewUrl'])) {
                $oldFilename = basename($profileInfo['profilePreviewUrl']);
                $oldPath = $uploadPath . '/' . $oldFilename;
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            // Upload new profile image
            $filename = time() . '-profile-' . $profileImage->getClientOriginalName();
            $profileImage->move($uploadPath, $filename);
            
            // ✅ CRITICAL: Set server URL
            $profilePreviewUrl = $baseUrl . '/uploads/' . $filename;
        }

        // ✅ Update database
        $profileInfo = $resume->profile_info ?? [];
        $profileInfo['profilePreviewUrl'] = $profilePreviewUrl;
        $resume->profile_info = $profileInfo;
        $resume->thumbnail_link = $thumbnailLink;
        $resume->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'thumbnailLink' => $thumbnailLink,
            'profilePreviewUrl' => $profilePreviewUrl,
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to upload images',
            'error' => $e->getMessage()
        ], 500);
    }
}


}
