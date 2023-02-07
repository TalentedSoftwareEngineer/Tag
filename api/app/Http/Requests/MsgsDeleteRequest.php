<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MsgsDeleteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'checkedMsgs' => '',
        ];
    }

    public function attributes()
    {
        return [
            'checkedMsgs' => '',
        ];
    }
}
