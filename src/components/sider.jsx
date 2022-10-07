import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'umi';
import axios from 'axios'
import './sider.less'
// import {useCollapsedStore, CollapsedStoreProvider} from '../models/useCollapsed';
const { Sider } = Layout;

const sider = () => {
    const [collapsed] = useState(false)
    // const { collapsed } = useCollapsedStore()
    const [menulist, setMenulist] = useState([])
    const location = useLocation()
    const history = useHistory()
    useEffect(() => {
        axios.get('http://localhost:5000/rights_children').then(
            res => {
                // console.log(res.data)
                setMenulist(res.data)
            }
        )
    }, [])
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const checkpagepermission = (pe) => {
        return pe.pagepermission === 1 && rights.checked.includes(pe.key)
    }
    const iconList = {
        '/home': <UserOutlined />,
        '/user_manage/list': <UserOutlined />,
        '/user_manage': <UserOutlined />,
        '/right_manage/role/list': <UserOutlined />,
        '/right_manage/right/list': <UserOutlined />,
        '/right_manage': <UserOutlined />
    }
    const check = (list) => {
        return list.map(item => {
            // console.log(item)
            if (item.children && checkpagepermission(item) && item.children.length > 0) {
                return {
                    key: item.key,
                    label: item.title,
                    icon: iconList[item.key],
                    children: check(item.children)
                }
            }
            return checkpagepermission(item) && {
                key: item.key,
                icon: iconList[item.key],
                label: item.title
            }
        })
    }
    // const menulist = [
    //     {
    //         key: '/home',
    //         icon: <UserOutlined />,
    //         title: '首页'
    //     },
    //     {
    //         key: '/user_manage',
    //         icon: <UserOutlined />,
    //         title: '用户管理',
    //         children: [
    //             {
    //                 key: '/user_manage/list',
    //                 icon: <UserOutlined />,
    //                 title: '用户列表',
    //             }
    //         ]
    //     },
    //     {
    //         key: '/right_manage',
    //         icon: <UserOutlined />,
    //         title: '权限管理',
    //         children: [
    //             {
    //                 key: '/right_manage/role/list',
    //                 icon: <UserOutlined />,
    //                 title: '角色列表',
    //             },
    //             {
    //                 key: '/right_manage/right/list',
    //                 icon: <UserOutlined />,
    //                 title: '权限列表',
    //             }
    //         ]
    //     }
    // ]
    return (
        // <CollapsedStoreProvider>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                    <div className="logo" >后台系统</div>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <Menu
                            theme="dark"
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
                            items={check(menulist)}
                            onClick={({ key }) => {
                                history.push(key)
                            }}
                        />
                    </div>
                </div>
            </Sider>
        // </CollapsedStoreProvider>
    )
}

export default sider;