<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


// Route::get('/uploads/{filename}', function ($filename) {
//     $path = public_path('uploads/' . $filename);

//     if (!file_exists($path)) {
//         abort(404);
//     }

//     return response()->file($path, [
//         'Access-Control-Allow-Origin' => 'http://localhost:5173',
//         'Access-Control-Allow-Methods' => 'GET',
//         'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
//     ]);
// });