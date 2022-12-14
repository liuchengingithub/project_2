import { useParams } from 'umi'
import { Button, Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import category from '../category';
import moment from 'moment';

const id = () => {
    const [newsInfo, setNewsInfo] = useState()
    const params = useParams()
    useEffect(() => {
        axios.get(`http://localhost:5000/news/${params.id}?_expand=category&_expand=role`).then(
            res => {
                setNewsInfo(res.data)
            }
        )
    }, [params.id])
    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['grey', 'orange', 'green', 'red']
    return (
        <div>
            { newsInfo && <div><PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={newsInfo.category.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss'): '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><span style={{color: colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><span style={{color: colorList[newsInfo.auditState]}}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span style={{color: 'green'}}>{newsInfo.view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span style={{color: 'green'}}>{newsInfo.star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量"><span style={{color: 'green'}}>0</span></Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{
                __html:newsInfo.content
            }} style={{border: '0.5px solid green', margin: '0 24px'}}/>
            </div>
            }
            
        </div>
    )
}

export default id;