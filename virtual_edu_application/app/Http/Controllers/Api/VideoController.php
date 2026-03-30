<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subjects;
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

    public function index(Request $request){
        if ($request->has('subjectId')) {
            $videos = Video::where('subject_id', $request->subjectId)->get();
            return response()->json($videos, 200);
        }
        return response()->json(Video::all(), 200);
    }

    public function show($subjectId)
    {
        $subjects = Subjects::findOrFail($subjectId);
        $videos = $subjects->videos;
        return response()->json($videos,200);
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
