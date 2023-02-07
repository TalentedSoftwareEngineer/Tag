<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kb_b_msg_send extends Model
{
    use HasFactory;

    protected $table = 'kb_b_msg_send';

    protected $fillable = [
        'id',
        'msg_id',
        'send_syain',
        'send_to_syain',
        'send_yoyaku_date',
        'send_date',
        'open_date',
        'kakunin_date',
        'kaito_date',
        'kaito',
        'kaito_yesno_date',
        'kaito_yesno',
        'oubo_date',
        'henshin_date',
        'henshin_id',
        'update_date',
        'update_user',
        'send_syain_name',
        'hiden_flag',
    ];
}
