<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user (User or Admin)
     * 
     * @route POST /api/auth/register
     * @access Public
     */
    public function register(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'nullable|in:user,admin', // ✅ Accept role during registration
                'profileImageUrl' => 'nullable|string',
                'passkey' => 'required_if:role,admin|string', // ✅ Required if role is admin
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first()
                ], 400);
            }

            // ✅ Validate admin passkey
        if ($request->role === 'admin') {
            $adminPasskey = 'CODECLOUDS'; // The secret passkey
            
            if (!$request->has('passkey') || $request->passkey !== $adminPasskey) {
                return response()->json([
                    'message' => 'Invalid admin passkey. Access denied.'
                ], 403);
            }
        }

            // Check if user already exists
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                return response()->json([
                    'message' => 'User already exists.'
                ], 400);
            }

            // Fix profile image URL
            $profileImageUrl = $request->profileImageUrl;
            if ($profileImageUrl && !str_starts_with($profileImageUrl, 'http')) {
                $profileImageUrl = config('app.url') . $profileImageUrl;
            }

            // Create new user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'user', // ✅ Default to 'user' if not provided
                'profile_image_url' => $profileImageUrl,
            ]);

            // Generate token with 7 days expiry
            $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

            // Return user data with token
            return response()->json([
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // ✅ Include role in response
                'profileImageUrl' => $user->profile_image_url,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user (User or Admin)
     * 
     * @route POST /api/auth/login
     * @access Public
     */
    public function login(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
                'role' => 'nullable|in:user,admin', // ✅ Optional role filter
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first()
                ], 400);
            }

            // Find user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Invalid email or password'
                ], 401);
            }

            // ✅ Check if role matches (if role is provided)
            if ($request->has('role') && $user->role !== $request->role) {
                return response()->json([
                    'message' => 'Invalid email or password'
                ], 401);
            }

            // Check password
            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Invalid email or password'
                ], 401);
            }

            // Generate token with 7 days expiry
            $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

            // Return user data with token
            return response()->json([
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // ✅ Include role in response
                'profileImageUrl' => $user->profile_image_url,
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user profile
     * 
     * @route GET /api/auth/profile
     * @access Private (Requires JWT)
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // ✅ Include role
                'profileImageUrl' => $user->profile_image_url,
                'createdAt' => $user->created_at,
                'updatedAt' => $user->updated_at,
                '__v' => 0, // For MongoDB compatibility
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload profile image
     * 
     * @route POST /api/auth/upload-image
     * @access Private
     */
    public function uploadImage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first()
                ], 400);
            }

            if (!$request->hasFile('image')) {
                return response()->json([
                    'message' => 'No file uploaded'
                ], 400);
            }

            // Store image in public/uploads directory
            $image = $request->file('image');
            $filename = time() . '-' . $image->getClientOriginalName();
            $image->move(public_path('uploads'), $filename);

            // Generate URL
            $baseUrl = config('app.url');
            $imageUrl = $baseUrl . '/uploads/' . $filename;

            return response()->json([
                'imageUrl' => $imageUrl
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
