<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title'      => 'required|string|max:255',
            'video_url'  => 'required|url', // from Supabase.publicUrl
        ]);

        $video = Video::create([
            'subject_id' => $request->subject_id,
            'title'      => $request->title,
            'video_url'  => $request->video_url,
        ]);

        return response()->json($video, 201);
    }

    public function index(){
        return Video::all();
    }

    public function show(Video $videos)
    {
        return $videos;
    }

    
    public function update(Request $request, Video $videos)
    {
        $request->validate([
            'title'     => 'sometimes|string|max:255',
            'video_url' => 'sometimes|url',
        ]);

        $videos->update($request->only(['title', 'video_url']));

        return $videos;
    }

   
    public function destroy(Video $videos)
    {
        $videos->delete();

        return response()->noContent();
    }
}
