import { Table, Button, Space, Modal, notification } from 'antd'
import { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { useHistory } from 'umi'
import axios from 'axios';
import category from './category';
const { confirm } = Modal;

const draft = () => {
    const [table, setTable] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    const history = useHistory()
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expand=category`).then(
            res => {
                setTable(res.data)
            }
        )
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`/news_manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '开关',
            render: (item) => {
                return <div>
                    <Space size='middle'>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { deleteItem(item) }} />
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => {
                            history.push(`/news_manage/update/${item.id}`)
                        }} />
                        <Button shape="circle" icon={<CloudUploadOutlined />} onClick={() => handleUp(item.id)} />
                    </Space>
                </div>
            }
        }
    ];
    const handleUp = (id) => {
        axios.patch(`http://localhost:5000/news/${id}`, {
            "auditState": 1
        }).then(
            res => {
                history.push('/audit_manage/list')
                notification.info({
                    message: '通知',
                    description:
                        '请到审核列表查看',
                    placement: 'bottomRight',
                });
            }
        )
    }
    const deleteItem = (item) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认删除吗',

            onOk() {
                deleteok(item);
            },

            onCancel() {
                console.log('Cancel');
            }
        })
    }

    const deleteok = (item) => {
        setTable(table.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/news/${item.id}`)
    }
    return (
        <>
            <Table dataSource={table} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
        </>
    )
}



export default draft;