import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Message, MessageCreate } from '@/types/messages'
import { InputWrapper, Input, Textarea, Button, Space, Grid, Col, Group, Text, Divider, Radio } from '@mantine/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import { getUrlParam } from '@/libs/libs'

import { useAppDispatch } from '../../store/hooks';
import { setIsToastLocked } from '../../store/message/messageSlice';

import {
    faSearch,
    faPaperPlane,
  } from "@fortawesome/free-solid-svg-icons";

type Props = {
    message: Message|MessageCreate,
    children?: React.ReactNode,
    submitAction: (message: Message, callback?: () => void) => Promise<void>,
    isReservation: string,
    reservationDateTimeProp: Date | null,
    msgReceiverProp: string[]
}

const MessageForm: React.VFC<Props> = ({
    message,
    children,
    submitAction,
    isReservation,
    reservationDateTimeProp,
    msgReceiverProp
}) => {
    const dispatch = useAppDispatch();

    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, control } = useForm<Message>()
    const [ isButtonLoading, setIsButtonLoading ] = useState(false)
    const [ notificationType_value, setNotificationType_value ] = useState('contact')
    const [ confirmationRequired_value, setConfirmationRequired_value ] = useState('confirmReqTransmission')
    const isMultiReply:any = getUrlParam('isMultiReply');
    const send_syain: any = getUrlParam('send_syain');
    const kb_b_msg_send_id:any = getUrlParam('kb_b_msg_send_id');

    let tmp_local: any;
    let classId: number;
    let sendSyain: number;
    let sendSyainName: string;
    if(typeof window !== 'undefined'){
        tmp_local = localStorage.getItem("AUTH_USER");
        classId = JSON.parse(tmp_local).main_class;
        sendSyain = JSON.parse(tmp_local).syain_id;
        sendSyainName = JSON.parse(tmp_local).syain_name;
    }

    useEffect(() => {
        return () => {
            setIsButtonLoading(false)
        }
    }, [])

    const onSubmit: SubmitHandler<Message> = data => {
        setIsButtonLoading(true);
        const reservationSendTime: any = isReservation == 'reservationSend' ? moment(reservationDateTimeProp).format('MM/DD/YYYY HH:mm:ss') : null;
        const sendTime: any = isReservation == 'reservationSend' ? null : moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
        const updateData: Message = {
            ...message, 
            ...data, 
            ...{
                renraku_nomi_flag: notificationType_value == 'contact',
                bosyu_flag: notificationType_value == 'recRanking',
                kaito_flag: notificationType_value == 'inputAnswer',
                kaito_yesno_flag: notificationType_value == 'isAnswer',
                yo_kakunin_flag: confirmationRequired_value == 'confirmReqTransmission',
                yo_henshin_flag: confirmationRequired_value == 'sendReplyRequired',
                yo_auto_henshin_flag: confirmationRequired_value == 'autoSendReplyRequired',
                send_yoyaku_date: reservationSendTime,
                send_date: sendTime,
                to_syain: isMultiReply==0 ? [send_syain] : msgReceiverProp,
                class_id: classId,
                send_syain: sendSyain,
                syain_name: sendSyainName,
                isMultiReply: isMultiReply,
                kb_b_msg_send_id: kb_b_msg_send_id
            }
        }
        console.log("message|data", updateData);

        dispatch(setIsToastLocked(false));

        return submitAction(updateData, () => {
            setIsButtonLoading(false)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Space h="xl" />
            <Space h="xl" />
            <div className='mt-4'>
                <Text size='xl' weight={700}>通知種類</Text>
                <Divider my="sm" />
                <Group>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='contact' 
                                checked={notificationType_value == 'contact'} 
                                onChange={e => setNotificationType_value(e.target.value)} />連絡
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='isAnswer'
                                checked={notificationType_value == 'isAnswer'} 
                                onChange={e => setNotificationType_value(e.target.value)} />回答（YES/NO)
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='inputAnswer' 
                                checked={notificationType_value == 'inputAnswer'} 
                                onChange={e => setNotificationType_value(e.target.value)} />回答（入力）
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='recRanking' 
                                checked={notificationType_value == 'recRanking'} 
                                onChange={e => setNotificationType_value(e.target.value)} />募集連格
                        </label>
                    </div>
                </Group>
            </div>
            <Space h="sm"  />

            <div className='mt-4'>
                <Text size='xl' weight={700}>確認要否</Text>
                <Divider my="sm" />
                <Group>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="confirmationRequiredName" 
                                value='confirmReqTransmission' 
                                checked={ confirmationRequired_value == 'confirmReqTransmission' } 
                                onChange={e => setConfirmationRequired_value(e.target.value)} />要確認送信
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="confirmationRequiredName" 
                                value='sendReplyRequired'
                                checked={ confirmationRequired_value == 'sendReplyRequired'} 
                                onChange={e => setConfirmationRequired_value(e.target.value)} />要返信送信
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="confirmationRequiredName" 
                                value='autoSendReplyRequired' 
                                checked={ confirmationRequired_value == 'autoSendReplyRequired'} 
                                onChange={e => setConfirmationRequired_value(e.target.value)} />要返信送信（既読は自動で付さます）
                        </label>
                    </div>
                </Group>
            </div>
            <Space h="sm"  />

            <div className='mt-4'>
                <Text size='xl' weight={700}>タイトル</Text>
                <Divider my="sm" />
                <InputWrapper
                    id="input-title"
                    required
                    label=""
                    error={errors.title?.message}
                >
                    <Input
                        defaultValue={message.title}
                        {...register('title', {
                            required: '必ず入力してください。',
                            maxLength: {
                                value: 255,
                                message: '255文字以内で入力してください。'
                            }
                        })}
                        invalid={errors.title !== undefined}
                        placeholder='タイトル'
                    />
                </InputWrapper>
            </div>
            <Space h="sm"  />

            <div className='mt-4'>
                <Text size='xl' weight={700}>内容</Text>
                <Divider my="sm" />
                <Textarea
                    label=""
                    required
                    minRows={6}
                    defaultValue={message.message}
                    {...register('message', {
                        maxLength: {
                            value: 1000,
                            message: '1000文字以内で入力してください。'
                        }
                    })}
                    error={errors.message?.message}
                    placeholder='内容。。'
                />
            </div>
            <Space h="xl"  />

            { children }
            <Space h="xl"  />

            <Group position='center' spacing="xs">
                <Button type="submit" loading={isButtonLoading}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span className='m-3'>選択スタッフに送信</span>
                </Button>
            </Group>
        </form>
    )
}

export default MessageForm
