import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import axios, { validateErrorNotice } from '@/libs/axios'
import { StaffPager } from '@/types/staffs'

const APIURL = '/api/staffs'

export const useStaffs = (pageIndex: number = 1) => {
    const api = `${APIURL}?page=${pageIndex}`

    const { data: staffs, error, mutate } = useSWR<StaffPager>(api, () =>
        axios
            .get(api)
            .then((res: any) => res.data)
    )

    return {
        staffs,
        error
    }
}