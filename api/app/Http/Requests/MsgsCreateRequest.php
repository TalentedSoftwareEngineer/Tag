<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MsgsCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [];
    }

    public function attributes()
    {
        return [
            'renraku_nomi_flag' => '',
            'bosyu_flag' => '',
            'kaito_flag' => '',
            'kaito_yesno_flag' => '',
            'yo_kakunin_flag' => '',
            'yo_henshin_flag' => '',
            'yo_auto_henshin_flag' => '',
            'send_yoyaku_date' => '',
            'send_date' => '',
            'to_syain' => '',
            'class_id' => '',
            'send_syain' => '',
            'syain_name' => '',
            'isMultiReply' => '',
            'kb_b_msg_send_id' => '',
        ];
    }
}
