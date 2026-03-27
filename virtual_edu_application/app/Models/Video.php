<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    public function subject() {
        return $this->belongsTo(Subjects::class);
    }
}
