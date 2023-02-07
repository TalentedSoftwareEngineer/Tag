<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Syain;
use App\Models\Shift;
use App\Models\ClassTable;
use App\Models\Syokui;
use App\Models\Kd_m_team;

use App\Http\Requests\MsgsDeleteRequest;
use Symfony\Component\HttpFoundation\Response;

class MsgsDeleteController extends Controller
{
    public function index()
    {
    }

    public function store(MsgsDeleteRequest $request)
    {
        foreach ($request->checkedMsgs as $value) {
            $kb_msg_id = DB::table('kb_b_msg_send')
                ->where('id', $value)
                ->get(['msg_id'])
                ->first()->msg_id;

            $deletedMsgs = DB::table('kb_b_msg_send')
                ->where('id', $value)
                ->delete();

            $msg_count = DB::table('kb_b_msg_send')
                ->where('msg_id', $kb_msg_id)
                ->count();
            if ($msg_count <= 0) {
                $delete_kb_msg = DB::table('kb_b_msg')
                    ->where('kb_b_msg.id', $kb_msg_id)
                    ->delete();
            }
        }
        return response()->json($msg_count);
    }
}
