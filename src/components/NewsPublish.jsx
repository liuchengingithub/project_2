import {Table, Tag, Button, Space, Modal, Switch, Popover} from 'antd'
import { useState, useEffect } from 'react';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;

const NewsPublish = (props) => {
    const columns = [
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
                return <div>{category.title}</div>
            }
        },
        {
            title: '开关',
            render: (item) => {
                return <div>
                    {props.button(item.id)}
                </div>
            }
        }
    ]
    return (
        <div>
            <Table dataSource={props.table} columns={columns} pagination={{pageSize:5}} rowKey={item => item.id}/>;
        </div>
    )
}

export default NewsPublish