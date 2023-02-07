import { User } from '@/types/User';

export const getAuthUser = () => {
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

    return auth_user;
}