<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Syain;
use App\Models\Shift;
use App\Models\ClassTable;
use App\Models\Syokui;
use App\Models\Kd_m_team;

class StaffController extends Controller
{
    private $arr_logincheck;
    public function index()
    {
        $this->arr_logincheck = [];
        $login_user = DB::table('login')
            ->select('syain_id')
            ->get();

        foreach ($login_user as $item) {
            array_push($this->arr_logincheck, $item->syain_id);
        }

        $staffs = DB::table('syain')
            ->leftjoin('shift', function ($join) {
                $join->on('syain.id', '=', 'shift.syain_id');
                $join->on('syain.workset_id', '=', 'shift.workset_id');
            })
            ->leftjoin('kyujitu', function ($join) {
                $join->on('shift.kyujitu_id', '=', 'kyujitu.id');
                $join->on('shift.workset_id', '=', 'kyujitu.workset_id');
            })
            ->leftjoin('kyujitumaster', function ($join) {
                $join->on('kyujitu.kyujitu_id', '=', 'kyujitumaster.id');
                $join->on(
                    'kyujitu.workset_id',
                    '=',
                    'kyujitumaster.workset_id'
                );
            })
            ->leftjoin('kinmupattern', function ($join) {
                $join->on('shift.pattern_id', '=', 'kinmupattern.id');
                $join->on('shift.workset_id', '=', 'kinmupattern.workset_id');
            })
            ->leftjoin('syain_busyo', function ($join) {
                $join->on('syain_busyo.syain_id', '=', 'syain.id');
                $join->on('syain_busyo.workset_id', '=', 'syain.workset_id');
            })
            ->leftjoin('class', function ($join) {
                $join->on('class.id', '=', 'syain_busyo.class_id');
                $join->on('class.workset_id', '=', 'syain_busyo.workset_id');
            })
            ->leftjoin('staff_syokui', function ($join) {
                $join->on('syain.id', '=', 'staff_syokui.syain_id');
                $join->on('syain.workset_id', '=', 'staff_syokui.workset_id');
            })
            ->leftjoin('syokui', function ($join) {
                $join->on('staff_syokui.syokui_id', '=', 'syokui.id');
                $join->on('staff_syokui.workset_id', '=', 'syokui.workset_id');
            })
            ->leftjoin('kd_m_team', function ($join) {
                $join->on('syain.team_code1', '=', 'kd_m_team.team_code1');
                $join->on('syain.team_code2', '=', 'kd_m_team.team_code2');
                $join->on('syain.team_code3', '=', 'kd_m_team.team_code3');
                $join->on('syain.workset_id', '=', 'kd_m_team.workset_id');
            })
            ->select(
                'syain.id',
                'syain.workset_id',
                'syain.syain_name',
                'shift.hiduke',
                'shift.pattern_id',
                'shift.kinmu_from',
                'shift.kinmu_to',
                'kyujitumaster.kyujitu_name',
                'kinmupattern.kinmupattern_name',
                'syain_busyo.class_id',
                'class.class_name',
                'syokui.syokui_name',
                'kd_m_team.team_code1',
                'kd_m_team.team_code2',
                'kd_m_team.team_code3',
                'kd_m_team.kbn1_name',
                'kd_m_team.kbn2_name',
                'kd_m_team.kbn3_name'
            )
            ->groupBy([
                'syain.id',
                'syain.workset_id',
                'shift.hiduke',
                'shift.pattern_id',
                'shift.kinmu_from',
                'shift.kinmu_to',
                'kyujitumaster.kyujitu_name',
                'kinmupattern.kinmupattern_name',
                'syain_busyo.class_id',
                'class.class_name',
                'syokui.syokui_name',
                'kd_m_team.team_code1',
                'kd_m_team.team_code2',
                'kd_m_team.team_code3',
                'kd_m_team.kbn1_name',
                'kd_m_team.kbn2_name',
                'kd_m_team.kbn3_name',
            ])
            ->where(function ($query) {
                return $query->whereIn('syain.id', $this->arr_logincheck);
            })
            // ->where(function ($query) {
            //     return $query
            //         ->where('shift.pattern_id', '!=', 0)
            //         ->where('kinmupattern.kinmupattern_name', '!=', null);
            // })
            ->orderBy('syain.id')
            ->paginate(10);

        return response()->json($staffs);
    }
}
