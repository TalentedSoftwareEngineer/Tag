<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Kb_b_msg;
use App\Models\Kb_b_msg_send;
use App\Http\Requests\MsgsCreateRequest;
use App\Http\Requests\MsgsHidenRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\GetWorkerMsgRequest;
use App\Http\Requests\UpdateSendDateRequest;

class MessageController extends Controller
{
    private $arr_logincheck;
    private $g_loginUser;
    private $g_reservationLoginUser;
    public function index()
    {
    }

    public function store(MsgsCreateRequest $request)
    {
        $message = Kb_b_msg::create([
            'renraku_nomi_flag' => $request->all()['renraku_nomi_flag'],
            'bosyu_flag' => $request->all()['bosyu_flag'],
            'kaito_flag' => $request->all()['kaito_flag'],
            'kaito_yesno_flag' => $request->all()['kaito_yesno_flag'],
            'yo_kakunin_flag' => $request->all()['yo_kakunin_flag'],
            'yo_henshin_flag' => $request->all()['yo_henshin_flag'],
            'yo_auto_henshin_flag' => $request->all()['yo_auto_henshin_flag'],
            'title' => $request->all()['title'],
            'message' => $request->all()['message'],
            'class_id' => $request->all()['class_id'],
        ]);

        foreach ($request->all()['to_syain'] as $value) {
            $message_send = Kb_b_msg_send::create([
                'msg_id' => $message->id,
                'send_to_syain' => (int) $value,
                'send_yoyaku_date' =>
                    $request->all()['send_yoyaku_date'] == null
                        ? null
                        : date(
                            'd/M/Y H:i:s',
                            strtotime($request->all()['send_yoyaku_date'])
                        ),
                'send_date' =>
                    $request->all()['send_date'] == null
                        ? null
                        : date(
                            'd/M/Y H:i:s',
                            strtotime($request->all()['send_date'])
                        ),
                'send_syain' => $request->all()['send_syain'],
                'send_syain_name' => $request->all()['syain_name'],
                'hiden_flag' => false,
                'henshin_id' =>
                    $request->all()['isMultiReply'] == 0
                        ? $request->all()['kb_b_msg_send_id']
                        : null,
                'henshin_date' =>
                    $request->all()['isMultiReply'] == 0
                        ? ($request->all()['send_date'] == null
                            ? $request->all()['send_yoyaku_date']
                            : $request->all()['send_date'])
                        : null,
            ]);
        }

        return response()->json($message, Response::HTTP_CREATED);
    }

    public function getCount()
    {
        $sendCount = DB::table('kb_b_msg_send')
            ->where('kb_b_msg_send.send_date', '!=', null)
            ->count();
        $openCount = DB::table('kb_b_msg_send')
            ->where('kb_b_msg_send.open_date', '!=', null)
            ->count();
        $confirmCount = DB::table('kb_b_msg_send')
            ->where('kb_b_msg_send.kakunin_date', '!=', null)
            ->count();
        $replyCount = DB::table('kb_b_msg_send')
            ->where('kb_b_msg_send.henshin_date', '!=', null)
            ->count();
        $counts = [
            'sendCount' => $sendCount,
            'openCount' => $openCount,
            'confirmCount' => $confirmCount,
            'replyCount' => $replyCount,
        ];
        return response()->json($counts);
    }

    public function msgHiden(MsgsHidenRequest $request)
    {
        foreach ($request->checkedMsgs as $value) {
            DB::table('kb_b_msg_send')
                ->where('id', $value)
                ->update(['hiden_flag' => true]);
        }

        return response()->json($request);
    }

    public function getMngerMessage(GetWorkerMsgRequest $request)
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
                'login.syain_name',
                'kb_b_msg_send.hiden_flag'
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
                    ->where('kb_b_msg_send.send_date', '!=', null)
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

    public function getReservationMsgs(GetWorkerMsgRequest $request)
    {
        $this->g_reservationLoginUser = $request->all()['login_worker'];
        $msg_reservation = DB::table('kb_b_msg_send')
            ->where(
                'kb_b_msg_send.send_to_syain',
                '=',
                $this->g_reservationLoginUser
            )
            ->where('kb_b_msg_send.send_yoyaku_date', '!=', null)
            ->where('kb_b_msg_send.send_date', '=', null)
            ->get();

        return response()->json($msg_reservation);
    }

    public function updateSendDate(UpdateSendDateRequest $request)
    {
        $updateSendDate = DB::table('kb_b_msg_send')
            ->where('id', $request->all()['sendReservationMsg_id'])
            ->update([
                'send_date' => date(
                    'd/M/Y H:i:s',
                    strtotime($request->all()['updatedSend_date'])
                ),
            ]);

        return response()->json($request);
    }
}
