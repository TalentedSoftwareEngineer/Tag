import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import axios, { validateErrorNotice } from '@/libs/axios'
import { Message, MessagePager, MessageCreate, DisplayCounts } from '@/types/messages'
import { toast } from 'react-toastify'
import { User } from '@/types/User';

import io from 'socket.io-client';

import { NEXT_PUBLIC_REALTIME_API_URL } from '@/services/links';

const APIURL = '/api/messages'
const WORKERAPIURL = '/api/workermessages'
const MNGERAPIURL = '/api/getMngerMessage'

const ENDPOINT = NEXT_PUBLIC_REALTIME_API_URL;
let socket = io(ENDPOINT, { transports: ['websocket'] });

export const useMessages = (pageIndex: number = 1) => {
    const api = `${APIURL}?page=${pageIndex}`
    const worker_api = `${WORKERAPIURL}?page=${pageIndex}`
    const mnger_api = `${MNGERAPIURL}?page=${pageIndex}`
    let timer: number;

    let tmp_local: any;
    let auth_user: User = {
        id: 0,
        syain_id: 0,
        user_id: 0,
        password: '',
        role_id: 0,
        mail: '',
        mail_alert1_flag: false,
        mail_alert2_flag: false,
        syain_name: '',
        main_class: 0,
        force_change: false
    };

    if (typeof window !== 'undefined') {
        tmp_local = localStorage.getItem("AUTH_USER");
        if(JSON.parse(tmp_local)!=null)
        {
            auth_user = JSON.parse(tmp_local);
        }
    }

    const { data: messages, error, mutate } = useSWR<MessagePager>(mnger_api, () =>
        axios
            .post(mnger_api, {login_worker: auth_user.syain_id})
            .then((res: any) => res.data)
    )

    const { data: worker_messages, error: worker_error, mutate: worker_mutate } = useSWR<MessagePager>(worker_api, () =>
        axios
            .post(worker_api, {login_worker: auth_user.syain_id})
            .then((res: any) => res.data)
    );

    const {data: reservationMsgs, mutate: reservationMutate} = useSWR<any>('/api/getReservationMsgs/', () => 
        axios
            .post('/api/getReservationMsgs/', {login_worker: auth_user.syain_id})
            .then((res: any)=>res.data)
    );
    
    const deleteAction = async (checkedMsgs: Message[]) => {
        const api = '/api/msgsdelete';
        await axios
            .post(api, {checkedMsgs: checkedMsgs})
            .then(() => {
                toast.success('削除に成功しました')
                mutate(messages)
                worker_mutate(worker_messages)
            })
            .catch(() => {
                toast.error('削除に失敗しました')
            })
    }

    const hidenAction = async (checkedMsgs: number[], callback?: ()=>void) => {
        const api = '/api/msghiden';
        await axios
            .post(api, {checkedMsgs: checkedMsgs})
            .then(()=> {
                mutate(messages)
                worker_mutate(worker_messages)
                toast.success('非表示に成功しました。')
            })
            .catch((error)=>{
                validateErrorNotice(error)
            })
            .finally(()=>{
                if (callback) {
                    timer = window.setTimeout(() => {
                        callback()
                    }, 1000)
                }
            });
    }

    return {
        mutate,
        messages,
        worker_mutate,
        worker_messages,
        reservationMsgs,
        reservationMutate,
        deleteAction,
        hidenAction,
        error,
        worker_error
    }
}

export const useMessage = () => {
    const { mutate } = useSWRConfig()
    const router = useRouter()
    let timer: number

    const getItem = (id: number) => {
        const api = `${APIURL}/${id}`

        return useSWR<Message>(api, async () => 
            await axios
                .get(api)
                .then((res: any) => res.data)
        )
    }

    const createAction = async (message: MessageCreate, callback?: () => void) => {
        await axios
            .post(APIURL, message)
            .then(() => {
                socket.emit('msgSent', {message}, () => {
                    toast.success('メッセージが成果的に送信されました。')
                });

                // router.replace('/messages/')
                window.location.href = '/messages/';
            })
            .catch(error => {
                validateErrorNotice(error)
            })
            .finally(() => {
                if (callback) {
                    timer = window.setTimeout(() => {
                        callback()
                    }, 1000)
                }
            })
    }

    useEffect(() => {
        return () => clearInterval(timer)
    }, [])

    return {
        getItem,
        createAction
    }
}

export const useGetCount = () => {
    const api = '/api/getcount';
    const {data: display_count, error} = useSWR(api, async () => await axios.get<DisplayCounts>(api).then(res => res.data).catch(error => {throw error.response}));

    return {display_count, error};
}