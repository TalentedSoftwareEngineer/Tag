import { Pager } from './Pager'

export type Staff = {
    id: number,
    syain_name: string,
    class_id: number,
    class_name: string,
    kinmu_from: string,
    kinmu_to: string,
    kyujitu_name: string,
    kinmupattern_name: string,
    pattern_id: number,
    syokui_name: string,
    workset_id: number,
    kbn1_name: string,
    kbn2_name: string,
    kbn3_name: string,
    team_code1: string,
    team_code2: string,
    team_code3: string,
    hiduke: Date;
}

export type StaffPager = Pager & {
    data: Staff[]
}