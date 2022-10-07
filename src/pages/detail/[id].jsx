import { useParams } from 'umi'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment';

const id = () => {
    const [newsInfo, setNewsInfo] = useState()
    const params = useParams()
    useEffect(() => {
        axios.get(`http://localhost:5000/news/${params.id}?_expand=category&_expand=role`).then(
            res => {
                setNewsInfo({
                    ...res.data,
                    view: res.data.view + 1
                })
                return res.data
            }
        ).then(res => {
            axios.patch(`http://localhost:5000/news/${params.id}?_expand=category&_expand=role`, {
                view: res.view + 1
            })
        })
    }, [params.id])
    return (
        <div>
            {newsInfo && <div><PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={<div>
                    {newsInfo.category.title}
                    <HeartTwoTone twoToneColor="#eb2f96" style={{ paddingLeft: '10px' }} onClick={() => {
                        setNewsInfo({
                            ...newsInfo,
                            star: newsInfo.star + 1
                        })
                        axios.patch(`http://localhost:5000/news/${params.id}?_expand=category&_expand=role`, {
                            star: newsInfo.star + 1
                        })
                    }} />
                </div>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量"><span style={{ color: 'green' }}>0</span></Descriptions.Item>
                </Descriptions>
            </PageHeader>
                <div dangerouslySetInnerHTML={{
                    __html: newsInfo.content
                }} style={{ border: '0.5px solid green', margin: '0 24px' }} />
            </div>
            }

        </div>
    )
}

export default id;