import { type } from 'os'
import { Pager } from './Pager'

export type Message = {
    id: number,
    class_id: number,
    renraku_nomi_flag: boolean,
    bosyu_flag: boolean,
    kaito_flag: boolean,
    kaito_yesno_flag: boolean,
    yo_kakunin_flag: boolean,
    yo_henshin_flag: boolean,
    yo_auto_henshin_flag: boolean
    title: string,
    message: string,
    send_yoyaku_date: string | null,
    send_date: string | null,
    to_syain: string[],
    send_syain: number,
    syain_name: string,
    send_syain_name: string,
    kb_b_msg_id: number,
    send_to_syain: number,
}

export type MessageCreate = {
    renraku_nomi_flag: boolean,
    bosyu_flag: boolean,
    kaito_flag: boolean,
    kaito_yesno_flag: boolean,
    yo_kakunin_flag: boolean,
    yo_henshin_flag: boolean,
    yo_auto_henshin_flag: boolean,
    title: string,
    message: string,
}

export type DisplayCounts = {
    sendCount: number,
    openCount: number,
    confirmCount: number,
    replyCount: number
}

export type MessagePager = Pager & {
    data: Message[]
}
