<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syokui extends Model
{
    use HasFactory;

    protected $table = 'syokui';

    protected $fillable = [
        'id',
        'class_id',
        'syokui_name',
        'koyokubun_id',
        'update_date',
        'update_user',
        'workset_id',
    ];
}
