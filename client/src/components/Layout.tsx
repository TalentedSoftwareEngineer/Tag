import React, { useEffect } from 'react'
import Head from 'next/head'
import { Container, LoadingOverlay, Anchor, Header, Space, Menu, Group } from '@mantine/core'
import { useAuth } from '@/hooks/auth'
import { useRouter } from "next/router"
import Link from 'next/link'
import { GearIcon, ExitIcon, CaretDownIcon } from '@radix-ui/react-icons'
import { faL } from '@fortawesome/free-solid-svg-icons'
import { User } from '@/types/User';

type Props = {
    children?: React.ReactNode
    title?: string
    isGuest?: boolean
}

export default function Layout ({ children, title, isGuest = false }: Props) {
    const pageTitle = title || ''
    const router = useRouter()
    const { logout } = useAuth()
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
    let isAuth: boolean = true;

    if (typeof window !== 'undefined') {
        tmp_local = localStorage.getItem("AUTH_USER");
        if(JSON.parse(tmp_local)!=null)
        {
            auth_user = JSON.parse(tmp_local);
        }
    }

    useEffect(() => {
        if (!isGuest && localStorage.getItem('AUTH_USER') == null ) {
            const redirectUrl = router.pathname
                ? '?redirect=' + router.pathname + window.location.search
                : ''

            isAuth = false;
            router.push('/login' + redirectUrl)
        }
    }, [])

    if ( !isAuth ) return <LoadingOverlay visible={true} />

    return (
        <>
            <Header height={50} padding="md" fixed>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    {auth_user.role_id==0 &&
                        <div style={{ display: 'flex' }}>
                            <Link href="/"><Anchor size="sm">ダッシュボード</Anchor></Link>
                            <Space w="md" />

                            <Link href="/messages/"><Anchor size="sm">メール送信一覧</Anchor></Link>
                        </div>
                    }

                    {auth_user.role_id==2 &&
                        <div style={{ display: 'flex' }}>
                            <Link href="/worker"><Anchor size="sm">ダッシュボード</Anchor></Link>
                            <Space w="md" />

                            <Link href="/worker/messages/"><Anchor size="sm">受信一覧</Anchor></Link>
                        </div>
                    }

                    <div style={{ marginLeft: 'auto' }}>
                        <Menu control={
                            <Group spacing="xs">
                                <CaretDownIcon />
                                <Anchor variant="text">{ auth_user.syain_name==null? 'ログアウト': auth_user.syain_name }</Anchor>
                            </Group>
                        } gutter={12} zIndex={1000}>
                            <Menu.Item icon={<GearIcon />}>設定</Menu.Item>
                            <Menu.Item icon={<ExitIcon />} onClick={logout}>ログアウト</Menu.Item>
                        </Menu>
                    </div>
                </div>
            </Header>
            <Container style={{ paddingTop: 60, paddingBottom: 40 }}>
                <Head>
                    <title>{ pageTitle }</title>
                </Head>
                <header>
                    <h1>{ pageTitle }</h1>
                </header>
                <main>{ children }</main>
            </Container>
        </>
    )
}
