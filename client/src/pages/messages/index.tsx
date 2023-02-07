import { useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import MessageList from '@/components/messages/List'
import { Button, Space, Group, Checkbox } from '@mantine/core'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faSearch,
    faSquarePlus,
    faTrashCan,
    faEyeSlash
  } from "@fortawesome/free-solid-svg-icons";

import { useConfirmModal } from '@/hooks/confirmModal'
import { Message } from '@/types/messages'
import { useMessages } from '@/hooks/message'
import { useRouter } from 'next/router'

const MessagePage: NextPage = () => {
    const router = useRouter()

    const { deleteAction, hidenAction } = useMessages();
    const { deleteModal } = useConfirmModal<Message[]>(deleteAction)
    const [checkedMsgs, setCheckedMsgs] = useState([]);

    const onOpenDeleteModal = () => {
        deleteModal(checkedMsgs);
        setCheckedMsgs([]);
    }

    const onHiden = () => {
        hidenAction(checkedMsgs);
        setCheckedMsgs([]);
    }

    return (
        <Layout title="募集一覧（メール送信一覧)">
            <Space h="md" />

            <div className='d-flex justify-content-between'>
                <Group spacing="xs">
                    <Link href={{
                        pathname: "/messages/create",
                        query: {
                            ...router.query,
                            isMultiReply: 1
                        }
                    }}>
                        <Button>
                            <FontAwesomeIcon icon={faSquarePlus} className='p-1' />
                            新規追加
                        </Button>
                    </Link>
                    <Button color="red" onClick={() => onOpenDeleteModal()}>
                        <FontAwesomeIcon  icon={faTrashCan} className='p-1' />
                        削除
                    </Button>
                    <Button color="gray" onClick={()=>onHiden()}>
                        <FontAwesomeIcon icon={faEyeSlash} className='p-1' />
                        非表示
                    </Button>
                </Group>

                <Group spacing="xs">
                    <div className="input-group" style={{width: "auto"}}>
                        <input type="text" className="form-control" placeholder="" />
                        <button className="btn btn-primary" type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>      

                    <Checkbox className='' label="非表示も検索"/>
                </Group>
            </div>

            <Space h="md" />
            <MessageList checkedMsgsProp={checkedMsgs} setCheckedMsgsProp={setCheckedMsgs} />
        </Layout>
    )
}

export default MessagePage
