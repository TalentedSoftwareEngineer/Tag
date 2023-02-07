<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\GetWorkerMsgRequest;

class WorkerMsgController extends Controller
{
    private $arr_logincheck;
    private $g_loginUser;
    public function index()
    {
    }

    public function getWorkerMsgs(GetWorkerMsgRequest $request)
    {
        $this->arr_logincheck = [];
        $this->g_loginUser = $request->all()['login_worker'];
        $login_user = DB::table('login')
            ->select('syain_id')
            ->get();

        foreach ($login_user as $item) {
            array_push($this->arr_logincheck, $item->syain_id);
        }

        $messages = DB::table('kb_b_msg')
            ->join('kb_b_msg_send', function ($join) {
                $join->on('kb_b_msg.id', '=', 'kb_b_msg_send.msg_id');
            })
            ->join(
                'login',
                'kb_b_msg_send.send_to_syain',
                '=',
                'login.syain_id'
            )
            ->select(
                'kb_b_msg.id as kb_b_msg_id',
                'kb_b_msg.class_id',
                'kb_b_msg.oya_msg_id',
                'kb_b_msg.renraku_nomi_flag',
                'kb_b_msg.kaito_flag',
                'kb_b_msg.kaito_yesno_flag',
                'kb_b_msg.yo_kakunin_flag',
                'kb_b_msg.yo_henshin_flag',
                'kb_b_msg.title',
                'kb_b_msg.message',
                'kb_b_msg.biko',
                'kb_b_msg.status',
                'kb_b_msg.bosyu_flag',
                'kb_b_msg.yo_auto_henshin_flag',
                'kb_b_msg_send.id',
                'kb_b_msg_send.msg_id',
                'kb_b_msg_send.send_syain',
                'kb_b_msg_send.send_to_syain',
                'kb_b_msg_send.send_yoyaku_date',
                'kb_b_msg_send.send_date',
                'kb_b_msg_send.open_date',
                'kb_b_msg_send.kakunin_date',
                'kb_b_msg_send.kaito_date',
                'kb_b_msg_send.kaito',
                'kb_b_msg_send.kaito_yesno_date',
                'kb_b_msg_send.kaito_yesno',
                'kb_b_msg_send.oubo_date',
                'kb_b_msg_send.henshin_date',
                'kb_b_msg_send.henshin_id',
                'kb_b_msg_send.send_syain_name',
                'login.syain_name'
            )
            // ->where('kb_b_msg.class_id', '!=', null)
            ->where(function ($query) {
                return $query->whereIn(
                    'kb_b_msg_send.send_to_syain',
                    $this->arr_logincheck
                );
            })
            ->where('kb_b_msg_send.hiden_flag', '=', false)
            ->where(function ($query) {
                return $query
                    ->where(function ($query_1) {
                        return $query_1
                            ->where(
                                'kb_b_msg_send.send_to_syain',
                                '=',
                                $this->g_loginUser
                            )
                            ->where('kb_b_msg_send.send_date', '!=', null);
                    })
                    ->orWhere(
                        'kb_b_msg_send.send_syain',
                        '=',
                        $this->g_loginUser
                    );
            })
            ->orderBy('kb_b_msg_send.id', 'desc')
            ->paginate(10);
        return response()->json($messages);
    }
}
