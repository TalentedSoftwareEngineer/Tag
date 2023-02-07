<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetWorkerMsgRequest extends FormRequest
{
    public function rules()
    {
        return [
            'login_worker' => '',
        ];
    }

    public function attributes()
    {
        return [
            'login_worker' => '',
        ];
    }
}
