import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios, { validateErrorNotice } from '@/libs/axios'
import { toast } from 'react-toastify'
import { User } from '@/types/User'
import io from 'socket.io-client';
import { getAuthUser } from '@/services/users';
import { NEXT_PUBLIC_REALTIME_API_URL } from '@/services/links';

export const useAuth = () => {

    const ENDPOINT = NEXT_PUBLIC_REALTIME_API_URL;
    let socket = io(ENDPOINT, { transports: ['websocket'] });

    const router = useRouter()
    let tmp_authUser: User;

    const register = async ({ ...props }) => {
        await axios
            .post('/api/register', props)
            .then(() => {
                router.push('/');
            })
            .catch(error => {
                validateErrorNotice(error)
            })
    }

    const login = async ({ ...props }) => {
        const redirect = router.query.redirect || '/'
        await axios
            .post('/api/login', props)
            .then((res) => {
                console.log('login succesfully!', redirect);
                localStorage.setItem('AUTH_USER', JSON.stringify(res.data));
                tmp_authUser = JSON.parse(JSON.stringify(res.data));

                var auth_id = tmp_authUser.syain_id;
                socket.emit('join', {auth_id}, (error: any) => {
                    if(error) {
                        console.log(error);
                    }
                });

                if(tmp_authUser.role_id == 0) {
                    router.push(String(redirect));
                } else if (tmp_authUser.role_id == 2) {
                    router.push('/worker');
                }
            })
            .catch((error) => {
                console.log('login failed');
                validateErrorNotice(error)
            })
    }

    const logout = async () => {
        await axios
            .post('/api/logout').then(() => {
                let loginUserId = getAuthUser().syain_id;
                socket.emit('logout', { loginUserId }, () => {

                });
                localStorage.removeItem('AUTH_USER');
                router.push('/login');
            })
            .catch(() => {
                toast.error('ログアウトに失敗しました')
            })
    }

    return {
        register,
        login,
        logout
    }
}
