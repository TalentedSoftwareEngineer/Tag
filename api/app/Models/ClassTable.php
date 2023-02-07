<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassTable extends Model
{
    use HasFactory;

    protected $table = 'class';

    protected $fillable = [
        'id',
        'class_name',
        'class_namekana',
        'class_shortname',
        'gyomu_flag',
        'color',
        'external_code',
        'update_date',
        'update_user',
        'workset_id',
        'team_code',
    ];
}
