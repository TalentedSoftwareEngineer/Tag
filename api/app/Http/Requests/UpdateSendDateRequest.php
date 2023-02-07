<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSendDateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'sendReservationMsg_id' => '',
            'updatedSend_date' => '',
        ];
    }

    public function attributes()
    {
        return [
            'sendReservationMsg_id' => '',
            'updatedSend_date' => '',
        ];
    }
}
