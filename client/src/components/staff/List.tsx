import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Message } from '@/types/messages'
import { useStaffs } from '@/hooks/staff'
import { Table, Button, Group, Loader, Pagination, Space, Badge, Anchor } from '@mantine/core'
import dayjs from 'dayjs'
import { getUrlParam } from '@/libs/libs'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faSearch,
  } from "@fortawesome/free-solid-svg-icons";

type Props = {
    msgReceiverProp: string[],
    setMsgReceiverProp: any
}

const StaffList: React.VFC<Props> = ({
    msgReceiverProp,
    setMsgReceiverProp
}) => {
    const router = useRouter()
    const defaultPage: number = Number(getUrlParam('page')) || 1
    const [pageIndex, setPageIndex] = useState<number>(defaultPage)
    const { staffs, error } = useStaffs(pageIndex)

    useEffect(() => {
        
    }, [])

    const handlePagerClick = (page: number) => {
        
        setPageIndex(page)
        router.push({
            query: { ...router.query , page :page }
        });
    }

    const handleStaffCheckbox = (event: any) => {
        if(event.target.checked) {
            msgReceiverProp.push(event.target.className);
            setMsgReceiverProp(msgReceiverProp);
        } else {
            msgReceiverProp.splice(msgReceiverProp.indexOf(event.target.className), 1);
            setMsgReceiverProp(msgReceiverProp);
        }
    }

    const display_target_date = (patternId: number, str_timeFrom: string | null, str_timeTo: string | null, kyujitu_name: string, kinmupattern_name: string) => {
        // console.log(patternId, '+', str_timeFrom, '+', str_timeTo, '+', kyujitu_name, '+', kinmupattern_name);

        if(patternId==0) {
            if(str_timeFrom!=null && str_timeTo!=null && str_timeFrom!='' && str_timeTo!='') {
                return str_timeFrom.slice(0, 2) + ':' + str_timeFrom.slice(2) + '~' + str_timeTo.slice(0, 2) + ':' + str_timeTo.slice(2);
            } else {
                return kyujitu_name;
            }
        } else {
            return kinmupattern_name;
        }
    }

    const display_team = (team_code_1: string, team_code_2: string, team_code_3: string, team_name_1: string, team_name_2: string, team_name_3: string) => {
        if(team_code_3 == '') {
            if(team_code_2 == '') {
                return team_name_1;
            } else {
                return team_name_2;
            }
        } else {
            return team_name_3;
        }
    }

    if (error) return <div>エラーが発生しました</div>
    if (!staffs) return <Loader />

    return (
        <div>
            <Group position='right'>
                <div className="input-group" style={{width: "auto"}}>
                    <input type="text" className="form-control" placeholder="" />
                    <button className="btn btn-primary" type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </Group>
            <Space h="xl" />

            <Table striped highlightOnHover captionSide="bottom"  verticalSpacing="xs" style={{textAlign: 'center'}}>
                <thead>
                    <tr>
                        <th style={{textAlign: 'center'}}>
                            <input id = "allStaffCheckId" type="checkbox"/>
                        </th>
                        <th style={{textAlign: 'center'}}>社員名</th>
                        <th style={{textAlign: 'center'}}>対象日</th>
                        <th style={{textAlign: 'center'}}>部署</th>
                        <th style={{textAlign: 'center'}}>所属グループ</th>
                        <th style={{textAlign: 'center'}}>チーム</th>
                    </tr>
                </thead>
                <tbody>
                {
                    staffs.data.map((staff, index) => (
                        <tr key={index}>
                            <td>
                                <input 
                                    id = {"staffCheckId_" + staff.id + '_' + staff.workset_id} 
                                    className={`${staff.id}`}
                                    type="checkbox"
                                    onChange={handleStaffCheckbox}
                                 />
                            </td>
                            <td>{staff.syain_name}</td>
                            <td>{display_target_date(staff.pattern_id, staff.kinmu_from, staff.kinmu_to, staff.kyujitu_name, staff.kinmupattern_name)} : {staff.hiduke?staff.hiduke.toString():''}</td>
                            <td>{staff.class_name}</td>
                            <td>{staff.syokui_name}</td>
                            <td>{display_team(staff.team_code1, staff.team_code2, staff.team_code3, staff.kbn1_name, staff.kbn2_name, staff.kbn3_name)}</td>
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
                    total={staffs.last_page}
                    position="center"
                    styles={(theme) => ({
                        item: {
                          '&[data-active]': {
                            backgroundImage: "red",
                          },
                        },
                    })}
                    radius="xl"
                    siblings={3}
                />
            </div>
        </div>
    )
}

export default StaffList
