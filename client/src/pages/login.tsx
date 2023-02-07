import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Button, Input, InputWrapper, Space, PasswordInput, Container, Anchor, Group } from '@mantine/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/hooks/auth'
import Head from 'next/head'
import Link from 'next/link'

type LoginSubmit = {
    user_id: string,
    password: string
}

const LoginPage: NextPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginSubmit>()
    const { login } = useAuth()
    const [ isButtonLoading, setIsButtonLoading ] = useState(false)

    const onSubmit: SubmitHandler<LoginSubmit> = data => {
        setIsButtonLoading(true)
        login(data)
        window.setTimeout(() => {
            setIsButtonLoading(false)
        }, 1500)
    }

    return (
        <Container size="xs" style={{marginTop: '200px'}}>
            <Head>
                <title>ログイン</title>
            </Head>
            <header>
                <h1>ログイン</h1>
            </header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputWrapper
                    required
                    label="ユーザーID"
                    error={errors.user_id?.message}
                >
                    <Input
                        {...register('user_id', {
                            required: '必ず入力してください。'
                        })}
                        invalid={errors.user_id !== undefined}
                        defaultValue="tagjapan_super"
                    />
                </InputWrapper>
                <Space h="md" />
                <PasswordInput
                    {...register('password', {
                        required: '必ず入力してください。'
                    })}
                    label="パスワード"
                    error={errors.password?.message}
                    required
                    defaultValue="123456789"
                />
                <Space h="xl" />
                <Group>
                    <Button type="submit" loading={isButtonLoading} fullWidth variant="outline">ログイン</Button>
                    {/* <Link href="/register"><Anchor size="sm">新規ユーザー登録</Anchor></Link> */}
                </Group>
            </form>
        </Container>
    )
}

export default LoginPage
