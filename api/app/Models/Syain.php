<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syain extends Model
{
    use HasFactory;

    protected $table = 'syain';

    protected $fillable = [
        'id',
        'syain_cd',
        'syain_name',
        'hurigana',
        'syain_nameryaku',
        'sortkey',
        'koyokubun_id',
        'yakusyoku_id',
        'stutend_flag',
        'foreign_flag',
        'kyuyo_kbn',
        'kyuyo_kingaku',
        'kagen_hi_f_flag',
        'jogen_syu_f_flag',
        'kagen_syu_f_flag',
        'jogen_kikan_f_flag',
        'kagen_kikan_f_flag',
        'pattern_adjust_flag',
        'tobikyu_kinsi_flag',
        'syujikan_flag',
        'jogen_hi_f_flag',
        'hukususagyou_kinsi_flag',
        'hukususagyou_kinsi_f_flag',
        'syubetu_koteikyujitu_flag',
        'kibo_zettai_flag',
        'koteikyujitu_kbn',
        'ato_adjust_flag',
        'core_change_lock_flag',
        'kibo_kyujitu_flag',
        'site_kyujitu_flag',
    ];
}
