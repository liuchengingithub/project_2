import { PageHeader, Card, Col, Row, List } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import _ from 'lodash'

const news = () => {
    const [list, setList] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/news?publishState=2&_expand=category').then(
            res => {
                setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            }
        )
    })
    return (
        <div style={{ width: '95%', margin: '0 auto' }}>
            <PageHeader
                className="site-page-header"
                title="新闻浏览"
                subTitle="查看"
            />
            <div className="site-card-wrapper" style={{ marginTop: '30px' }}>
                <Row gutter={[16, 16]}>
                    {
                        list.map(item => {
                            return <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 2
                                        }}
                                        renderItem={data => <List.Item><a href={`/detail/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div>
        </div>
    )
}

export default news