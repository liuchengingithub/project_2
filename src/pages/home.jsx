import { Card, Col, Row, Divider, List, Typography, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;

const home = () => {
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [dataList, setDatalist] = useState([])
    const [current, setCurrent] = useState(null)
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    const [open, setOpen] = useState(false)
    const barRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get('http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(
            res => {
                setViewList(res.data)
            }
        )
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(
            res => {
                setStarList(res.data)
            }
        )
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/news?publishState=2&_expand=category').then(
            res => {
                setDatalist(res.data)
                ech(_.groupBy(res.data, item => item.category.title))
            }
        )
        return () => {
            window.onresize = null
        }
    }, [])
    const pie = () => {
        const currentList = dataList.filter(item => item.author === username)
        const groupOBJ = _.groupBy(currentList, item => item.category.title)
        const renderList = []
        for(var i in groupOBJ) {
            renderList.push({
                value: groupOBJ[i].length,
                name: i
            })
        }

        var myChart
        if(!current){
            myChart = echarts.init(pieRef.current);
            setCurrent(myChart)
        }else {
            myChart = current
        }

        var option;

        option = {
            title: {
                text: '用户新闻分类图示',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: renderList,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }
    const ech = (obj) => {
        var myChart = echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: 45,
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            myChart.resize()
        }
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="最常浏览" border={true}>
                        <List
                            dataSource={viewList}
                            renderItem={(item) => <List.Item><a href={`/news_manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="点赞最多" bordered={true}>
                        <List
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`/news_manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{
                            width: 300,
                        }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setTimeout(() => {
                                    setOpen(true) 
                                    pie()
                                }, 0)
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <span>{region ? region : '全球'}</span>
                                    <span style={{ padding: '30px' }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer title="个人新闻分类" placement="right" onClose={() => {
                setOpen(false)
            }} open={open} closable={true} width='600px'>
                <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
            </Drawer>
            <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
        </div>

    )
}

home.wrappers = ['@/wrappers/Auth'];
export default home;