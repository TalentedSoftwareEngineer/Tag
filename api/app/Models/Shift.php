<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $table = 'shift';

    protected $fillable = [
        'workset_id',
        'hiduke',
        'syain_id',
        'shift_seq',
        'pattern_id',
        'motopattern_id',
        'syuttyouji_pattern_id',
    ];
}
