import type { NextPage } from 'next'
import Layout from '@/components/Layout'
import { InputWrapper, Input, Textarea, Button, Space, Group, Text, Divider } from '@mantine/core'
import { getUrlParam } from '@/libs/libs'
import { useForm } from 'react-hook-form'
import { Message } from '@/types/messages'
import { getAuthUser } from '@/services/users';
import Link from 'next/link'
import { Router, useRouter } from 'next/router'

const MessageDetailPage: NextPage = () => {
    const router = useRouter()

    const kb_b_msg_id = getUrlParam('kb_b_msg_id');
    const kb_b_msg_send_id = getUrlParam('kb_b_msg_send_id');
    const bosyu_flag: any = getUrlParam('bosyu_flag');
    const kaito_flag: any = getUrlParam('kaito_flag');
    const kaito_yesno_flag: any = getUrlParam('kaito_yesno_flag');
    let renraku_nomi_flag: any = getUrlParam('renraku_nomi_flag');
    const yo_auto_henshin_flag: any = getUrlParam('yo_auto_henshin_flag');
    const yo_henshin_flag: any = getUrlParam('yo_henshin_flag');
    const yo_kakunin_flag: any = getUrlParam('yo_kakunin_flag');
    const title: any = getUrlParam('title');
    const message: any = getUrlParam('message');
    const send_syain = getUrlParam('send_syain');
    const send_to_syain = getUrlParam('send_to_syain');

    let login_user:any = getAuthUser();

    const { register, handleSubmit, formState: { errors }, control } = useForm<Message>();

    return (
        <Layout title="">
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
                                disabled
                                checked={renraku_nomi_flag} />連絡
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='isAnswer'
                                disabled
                                checked={kaito_yesno_flag} />回答（YES/NO)
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='inputAnswer' 
                                disabled
                                checked={kaito_flag} />回答（入力）
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="notificationTypeName" 
                                value='recRanking' 
                                disabled
                                checked={bosyu_flag} />募集連格
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
                                disabled
                                checked={ yo_kakunin_flag } />要確認送信
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="confirmationRequiredName" 
                                value='sendReplyRequired'
                                disabled
                                checked={ yo_henshin_flag } />要返信送信
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <label className="form-check-label">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                name="confirmationRequiredName" 
                                value='autoSendReplyRequired' 
                                disabled
                                checked={ yo_auto_henshin_flag } />要返信送信（既読は自動で付さます）
                        </label>
                    </div>
                </Group>
            </div>
            <Space h="sm"  />

            <div className='mt-4'>
                <Text size='xl' weight={700}>タイトル</Text>
                <Divider my="sm" />
                <InputWrapper>
                    <Input
                        id='detail_title'
                        style={{backgroundColor: 'white'}}
                        color='white'
                        defaultValue={title}
                        disabled
                    />
                </InputWrapper>
            </div>
            <Space h="sm"  />

            <div className='mt-4'>
                <Text size='xl' weight={700}>内容</Text>
                <Divider my="sm" />
                <Textarea
                    id='detail_text'
                    style={{backgroundColor: 'white'}}
                    color='white'
                    defaultValue={message}
                    disabled
                />
            </div>
            <Space h="xl"  />

            {send_to_syain==login_user.syain_id &&
                <Group spacing="xs">
                    <Link href={{
                        pathname: '/messages/reply',
                        query: {
                            ...router.query,
                            isMultiReply: 0,
                            send_syain: send_syain,
                            kb_b_msg_send_id: kb_b_msg_send_id,
                        }
                    }}>
                        <Button size="md">返信</Button>
                    </Link>
                    <Space w="md"  />
                    <Link href={{
                        pathname: '/messages/reply',
                        query: {
                            ...router.query,
                            isMultiReply: 1
                        }
                    }}>
                        <Button size="md">複数返信</Button>
                    </Link>
                </Group>
            }

        </Layout>
    )
}

export default MessageDetailPage
