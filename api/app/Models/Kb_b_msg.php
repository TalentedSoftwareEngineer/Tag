<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kb_b_msg extends Model
{
    use HasFactory;

    protected $table = 'kb_b_msg';

    protected $fillable = [
        'id',
        'class_id',
        'oya_msg_id',
        'renraku_nomi_flag',
        'kaito_flag',
        'kaito_yesno_flag',
        'yo_kakunin_flag',
        'yo_henshin_flag',
        'title',
        'message',
        'biko',
        'status',
        'create_date',
        'create_user',
        'update_date',
        'update_user',
        'bosyu_flag',
        'yo_auto_henshin_flag',
        'to_syain',
        'send_yoyaku_date',
        'send_date',
        '',
    ];
}
