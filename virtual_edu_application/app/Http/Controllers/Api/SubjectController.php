<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subjects;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subjects::all();
        return response()->json($subjects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // image validation
        ]);

        // Create a new subject
        $subject = new Subjects();
        $subject->title = $request->title;
        $subject->description = $request->description;

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Save directly to public/uploads/ — same as Node
            $file->move(public_path('uploads'), $filename);
            // Store same format as Node: 'public/uploads/filename.jpg'
            $subject->imageFile = 'public/uploads/' . $filename;
        }

        $subject->save();  // Save the subject to the database

        return response()->json($subject, 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(Subjects $subject)
    {
        return response()->json($subject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subjects $subject)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $subject->title = $request->title;
        $subject->description = $request->description;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $subject->imageFile = 'public/uploads/' . $filename;
        }

        $subject->save();

        return response()->json($subject);
    }

    public function destroy(Subjects $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully']);
    }
}


