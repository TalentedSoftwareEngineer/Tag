<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kd_m_team extends Model
{
    use HasFactory;

    protected $table = 'kd_m_team';

    protected $fillable = [
        'team_id',
        'team_code1',
        'team_code2',
        'team_code3',
        'team_depth',
        'workset_id',
        'kbn1_name',
        'kbn2_name',
        'kbn3_name',
    ];
}
