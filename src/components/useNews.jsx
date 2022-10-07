import axios from "axios"
import { useEffect, useState } from "react"
import {notification} from 'antd'

const useNews = (publishState) => {
    const [table, setTable] = useState([])
    const {username} = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&publishState=${publishState}&_expand=category`).then(
            res => {
                console.log(res.data)
                setTable(res.data)
            }
        )
    },[publishState, username])
    const handleDelete = (id) => {
        setTable(table.filter(data => data.id !== id))
        axios.delete(`http://localhost:5000/news/${id}`).then(
            res => {
                    notification.info({
                    message: '通知',
                    description:
                        '此新闻已删除',
                    placement: 'bottomRight',
                })
            }
        )
    }
    const handleSunset = (id) => {
        setTable(table.filter(data => data.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            "publishState": 3
        }).then(
            res => {
                    notification.info({
                    message: '通知',
                    description:
                        '请到【发布管理/已下线】查看',
                    placement: 'bottomRight',
                })
            }
        )
    }
    const handlePublish = (id) => {
        setTable(table.filter(data => data.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(
            res => {
                    notification.info({
                    message: '通知',
                    description:
                        '请到【发布管理/已发布】查看',
                    placement: 'bottomRight',
                })
            }
        )
    }
    return {
        table,
        handleDelete,
        handleSunset,
        handlePublish
    }
}

export default useNews;