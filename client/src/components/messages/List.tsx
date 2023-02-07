import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Message } from '@/types/messages'
import { useGetCount, useMessages } from '@/hooks/message'
import { Table, Button, Group, Loader, Pagination, Space, Badge, Anchor } from '@mantine/core'
import dayjs from 'dayjs'
import { getUrlParam } from '@/libs/libs'
import { type } from 'os'
import { User } from '@/types/User';
import Pusher from 'pusher-js';
import { Flip, toast } from 'react-toastify';
import io from 'socket.io-client';
import { getAuthUser } from '@/services/users';
import { NEXT_PUBLIC_REALTIME_API_URL } from '@/services/links';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsToastLocked, getIsToastLocked, addReservationMsg, getReservationMsgs } from '../../store/message/messageSlice';
import axios from '@/libs/axios'

let socket;

type Props = {
    checkedMsgsProp: string[],
    setCheckedMsgsProp: any
}

const MessageList: React.VFC<Props> = ({
    checkedMsgsProp,
    setCheckedMsgsProp
}) => {

    const dispatch = useAppDispatch();
    const isToastLocked = useAppSelector(getIsToastLocked);
    // const [state_reservationMsgs, setReservationMsgs] = useState<any>([]);

    const ENDPOINT = NEXT_PUBLIC_REALTIME_API_URL;

    const router = useRouter()
    const defaultPage: number = Number(getUrlParam('page')) || 1
    const [pageIndex, setPageIndex] = useState<number>(defaultPage)
    const [workerPageIndex, setWorkerPageIndex] = useState<number>(defaultPage)
    const { messages, error, mutate } = useMessages(pageIndex)
    const { worker_messages, worker_error, worker_mutate } = useMessages(workerPageIndex)
    const { reservationMsgs, reservationMutate } = useMessages()
    const { display_count } = useGetCount();

    const [sendCount, setSendCount] = useState({ logged: false, send_count: 0 });
    const [openCount, setOpenCount] = useState({ logged: false, open_count: 0 });
    const [confirmCount, setConfirmCount] = useState({ logged: false, confirm_count: 0 });
    const [replyCount, setReplyCount] = useState({ logged: false, reply_count: 0 });

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
    
    if(!sendCount.logged && !openCount.logged && !confirmCount.logged && !replyCount.logged && display_count != undefined) {
        setSendCount({logged: true, send_count: display_count.sendCount});
        setOpenCount({logged: true, open_count: display_count.openCount});
        setConfirmCount({logged: true, confirm_count: display_count.confirmCount});
        setReplyCount({logged: true, reply_count: display_count.replyCount});
    }

    useEffect(()=>{
        subscribeToPusher();
        displayReservationMsgs();
    }, [reservationMsgs]);

    const subscribeToPusher = () => {
        socket = io(ENDPOINT, { transports: ['websocket'] });
        socket.off('msgGet');
        socket.on('msgGet', (message)=>{
            console.log('+++message+++', message);
            if(message.send_date != null) {
                getMessage(message);
            } else {
                reservationMutate(reservationMsgs);
            }
        })
    }

    const getMessage = (message: any) => {
        let login_user = getAuthUser();
            if(login_user.syain_id == message.to_syain_id) {
                if(!isToastLocked) {
                    toast.info('「' + message.send_name + '」' + 'から新たなメッセージが届きました。', {
                        position: "bottom-right",
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                        
                    });
                    window.setTimeout(()=>{
                        toast.dismiss();
                        toast.clearWaitingQueue();
                    }, 10000);
                    dispatch(setIsToastLocked(true));
                }
                mutate(messages);
                worker_mutate(worker_messages);
            }
    }

    const displayReservationMsgs = () => {
        
        //clear all setTimeout
        var id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }

        window.setTimeout(()=>{
            toast.dismiss();
            toast.clearWaitingQueue();
        }, 10000);

        if(reservationMsgs != undefined) {
            reservationMsgs.forEach((element: any) => {
                if(new Date(element.send_yoyaku_date).valueOf() > Date.now()) {
                    window.setTimeout(()=>{
                        sendReservationMsg(element.send_syain_name, element.id, element.send_yoyaku_date);
                    }, new Date(element.send_yoyaku_date).valueOf() - Date.now());
                } else {
                    sendReservationMsg(element.send_syain_name, element.id, element.send_yoyaku_date);
                }
            });
        }
    }

    const sendReservationMsg = async (send_syain_name: any, sendReservationMsg_id: any, updatedSend_date: any) => {
        await axios
        .post('/api/updateSendDate', { sendReservationMsg_id: sendReservationMsg_id, updatedSend_date: updatedSend_date })
        .then(() => {
            toast.info('「' + send_syain_name + '」' + 'から新たなメッセージが届きました。', {
                position: "bottom-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Flip,
                
            });
            window.setTimeout(()=>{
                toast.dismiss();
                toast.clearWaitingQueue();
            }, 10000);
            reservationMutate(reservationMsgs);
            mutate(messages);
            worker_mutate(worker_messages);
        })
    }

    const handlePagerClick = (page: number) => {
        setPageIndex(page)
        router.push({
            query: { ...router.query, page :page }
        });
    }

    const handleWorkerPagerClick = (page: number) => {
        setWorkerPageIndex(page)
        router.push({
            query: { ...router.query, page :page }
        });
    }

    const handleMessagesCheckbox = (event: any) => {
        if(event.target.checked) {
            checkedMsgsProp.push(event.target.className);
            setCheckedMsgsProp(checkedMsgsProp);
        } else {
            checkedMsgsProp.splice(checkedMsgsProp.indexOf(event.target.className), 1);
            setCheckedMsgsProp(checkedMsgsProp);
        }
    }

    const display_part_1 = (bosyu_flag: boolean, renraku_nomi_flag: boolean, kaito_flag: boolean, kaito_yesno_flag: boolean) => {
        if(bosyu_flag){
            return '募集';
        }

        if(renraku_nomi_flag){
            return '連絡';
        }

        if(kaito_flag){
            return '回答';
        }

        if(kaito_yesno_flag){
            return '回答';
        }
    }

    const display_part_2 = (yo_kakunin_flag: boolean, yo_henshin_flag: boolean, yo_auto_henshin_flag: boolean) => {
        if(yo_kakunin_flag){
            return '要確認';
        }

        if(yo_henshin_flag){
            return '要返信';
        }

        if(yo_auto_henshin_flag){
            return '要返信';
        }
    }

    const display_send_date = (send_date: string | null, send_yoyaku_date: string | null) => {
        if(send_date == null) {
            return send_yoyaku_date;
        } else {
            return send_date;
        }
    }

    if (error || worker_error) return <div>エラーが発生しました</div>
    if (!messages || !worker_messages) return <Loader />

    return (
        <div>
            {auth_user.role_id==0 &&
                <div>
                    <Table striped highlightOnHover captionSide="bottom"  verticalSpacing="xs" style={{textAlign: 'center'}}>
                        <thead>
                        <tr>
                            <th style={{textAlign: 'center'}}>
                                <input id = "allMsgCheckId" type="checkbox"/>
                            </th>
                            <th style={{textAlign: 'center'}}>区分1</th>
                            <th style={{textAlign: 'center'}}></th>
                            <th style={{textAlign: 'center'}}>日時</th>
                            <th style={{textAlign: 'center'}}>送信</th>
                            <th style={{textAlign: 'center'}}>既読</th>
                            <th style={{textAlign: 'center'}}>確認</th>
                            <th style={{textAlign: 'center'}}>返信</th>
                            <th style={{textAlign: 'center'}}>題名</th>
                            <th style={{textAlign: 'center'}}>受信者</th>
                            <th style={{textAlign: 'center'}}>送信者</th>
                            <th style={{textAlign: 'center'}}>詳細</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            messages.data.map((message, index) => (
                                <tr key={index}>
                                    <td>
                                        <input 
                                            id = {"msgCheckId_" + message.id} 
                                            className={`${message.id}`}
                                            type="checkbox"
                                            onChange={handleMessagesCheckbox}
                                        />
                                    </td>
                                    <td>{display_part_1(message.bosyu_flag, message.renraku_nomi_flag, message.kaito_flag, message.kaito_yesno_flag)}</td>
                                    <td>{display_part_2(message.yo_kakunin_flag, message.yo_henshin_flag, message.yo_auto_henshin_flag)}</td>
                                    <td>{display_send_date(message.send_date, message.send_yoyaku_date)}</td>
                                    <td>{sendCount.send_count}</td>
                                    <td>{openCount.open_count}</td>
                                    <td>{confirmCount.confirm_count}</td>
                                    <td>{replyCount.reply_count}</td>
                                    <td>{message.title}</td>
                                    <td>{message.syain_name}</td>
                                    <td>{message.send_syain_name}</td>
                                    <td>
                                        <Link href={{
                                            pathname: '/messages/detail',
                                            query: {
                                                ...router.query,
                                                kb_b_msg_id: message.kb_b_msg_id,
                                                kb_b_msg_send_id: message.id,
                                                bosyu_flag: message.bosyu_flag,
                                                kaito_flag: message.kaito_flag,
                                                kaito_yesno_flag: message.kaito_yesno_flag,
                                                renraku_nomi_flag: message.renraku_nomi_flag,
                                                yo_auto_henshin_flag: message.yo_auto_henshin_flag,
                                                yo_henshin_flag: message.yo_henshin_flag,
                                                yo_kakunin_flag: message.yo_kakunin_flag,
                                                title: message.title,
                                                message: message.message,
                                                send_syain: message.send_syain,
                                                send_to_syain: message.send_to_syain,
                                            }
                                        }}>
                                            <Button size="xs">詳細</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                        <tfoot></tfoot>
                    </Table>
                    <Space h="md" />
                    <div>
                        <Pagination
                            page={pageIndex}
                            onChange={handlePagerClick}
                            total={messages.last_page}
                            position="center"
                            styles={(theme) => ({
                                item: {
                                '&[data-active]': {
                                    backgroundImage: "red",
                                },
                                },
                            })}
                            radius="xl"
                        />
                    </div>
                </div>
            }

            {auth_user.role_id==2 &&
                <div>
                    <Table striped highlightOnHover captionSide="bottom"  verticalSpacing="xs" style={{textAlign: 'center'}}>
                        <thead>
                        <tr>
                            <th style={{textAlign: 'center'}}>
                                <input id = "allMsgCheckId" type="checkbox"/>
                            </th>
                            <th style={{textAlign: 'center'}}>区分1</th>
                            <th style={{textAlign: 'center'}}></th>
                            <th style={{textAlign: 'center'}}>日時</th>
                            <th style={{textAlign: 'center'}}>題名</th>
                            <th style={{textAlign: 'center'}}>送信者</th>
                            <th style={{textAlign: 'center'}}>詳細</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            worker_messages.data.map(message => (
                                <tr key={message.id}>
                                    <td>
                                        <input 
                                            id = {"msgCheckId_" + message.id} 
                                            className={`${message.id}`}
                                            type="checkbox"
                                            onChange={handleMessagesCheckbox}
                                        />
                                    </td>
                                    <td>{display_part_1(message.bosyu_flag, message.renraku_nomi_flag, message.kaito_flag, message.kaito_yesno_flag)}</td>
                                    <td>{display_part_2(message.yo_kakunin_flag, message.yo_henshin_flag, message.yo_auto_henshin_flag)}</td>
                                    <td>{display_send_date(message.send_date, message.send_yoyaku_date)}</td>
                                    <td>{message.title}</td>
                                    <td>{message.send_syain_name}</td>
                                    <td>
                                        <Link href={{
                                                pathname: '/messages/detail',
                                                query: {
                                                    ...router.query,
                                                    kb_b_msg_id: message.kb_b_msg_id,
                                                    kb_b_msg_send_id: message.id,
                                                    bosyu_flag: message.bosyu_flag,
                                                    kaito_flag: message.kaito_flag,
                                                    kaito_yesno_flag: message.kaito_yesno_flag,
                                                    renraku_nomi_flag: message.renraku_nomi_flag,
                                                    yo_auto_henshin_flag: message.yo_auto_henshin_flag,
                                                    yo_henshin_flag: message.yo_henshin_flag,
                                                    yo_kakunin_flag: message.yo_kakunin_flag,
                                                    title: message.title,
                                                    message: message.message,
                                                    send_syain: message.send_syain,
                                                    send_to_syain: message.send_to_syain,
                                                }
                                            }}>
                                                <Button size="xs">詳細</Button>
                                            </Link>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                        <tfoot></tfoot>
                    </Table>
                    <Space h="md" />
                    <div>
                        <Pagination
                            page={workerPageIndex}
                            onChange={handleWorkerPagerClick}
                            total={worker_messages.last_page}
                            position="center"
                            styles={(theme) => ({
                                item: {
                                    '&[data-active]': {
                                        backgroundImage: "red",
                                    },
                                },
                            })}
                            radius="xl"
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default MessageList
