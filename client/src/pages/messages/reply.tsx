import type { NextPage } from 'next'
import Layout from '@/components/Layout'
import { MessageCreate }  from '@/types/messages'
import { useMessage } from '@/hooks/message'
import MessageForm from '@/components/messages/Form'
import StaffList from '@/components/staff/List'
import { Group, Space } from '@mantine/core'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getUrlParam } from '@/libs/libs'

const MessageReplyPage: NextPage = () => {
    const { createAction } = useMessage()
    const [isReservation_value, setIsReservation_value] = useState('reservationSend');
    const [reservationDateTime, setReservationDateTime] = useState<Date | null>(
        new Date(),
    );
    const [ msgReceiver, setMsgReceiver ] = useState([]);
    const tmp_isMultiReply:any = getUrlParam('isMultiReply');
    const [isMultiReply, setIsMultiReply] = useState(false);

    const message: MessageCreate = {
        renraku_nomi_flag: false,
        bosyu_flag: false,
        kaito_flag: false,
        kaito_yesno_flag: false,
        yo_kakunin_flag: false,
        yo_henshin_flag: false,
        yo_auto_henshin_flag: false,
        title: '',
        message: ''
    }

    useEffect(()=>{
        if(tmp_isMultiReply==1) {
            setIsMultiReply(true);
        } else {
            setIsMultiReply(false);
        }
    }, [tmp_isMultiReply]);

    return (
        <Layout title="">
            <MessageForm 
                submitAction={createAction} 
                message={message} 
                isReservation={isReservation_value} 
                reservationDateTimeProp={reservationDateTime} 
                msgReceiverProp={msgReceiver} >

                {isMultiReply &&
                    <div>
                        <StaffList msgReceiverProp={msgReceiver} setMsgReceiverProp={setMsgReceiver} />
                    </div>
                }

                <Space h="xl"  />

                <Group position='center'>
                    <Group>
                        <div className="form-check-inline">
                            <label className="form-check-label">
                                <input 
                                    type="radio" 
                                    className="form-check-input" 
                                    name="msgReservationName" 
                                    value='reservationSend'
                                    checked={ isReservation_value == 'reservationSend' } 
                                    onChange={e => setIsReservation_value(e.target.value)} /> 送信予約
                            </label>
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="送信予約"
                                disabled={ isReservation_value == 'reservationSend' ? false : true }
                                value={reservationDateTime}
                                onChange={(newValue) => {
                                    setReservationDateTime(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />                            
                        </LocalizationProvider>
                    </Group>
                    <div className="form-check-inline ml-4">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="msgReservationName" 
                                value='nowSend'
                                checked={ isReservation_value == 'nowSend'} 
                                onChange={e => setIsReservation_value(e.target.value)} /> すぐに送信
                        </label>
                    </div>
                </Group>
            </MessageForm>
        </Layout>
    )
}

export default MessageReplyPage
