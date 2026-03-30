<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'subject_id',
        'title',
        'video_url',
    ];
}
