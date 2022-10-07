  import { Layout } from 'antd';
  import './index.less'
  import Sider from '../components/sider'
  import Header from '../components/header'
  import NProgress from 'nprogress';
  import 'nprogress/nprogress.css'
import { useEffect } from 'react';
  const { Content } = Layout;

const index = (props) => {
    NProgress.start()
    useEffect(() => {NProgress.done()})
    if(
        props.location.pathname === '/login' ||
        props.location.pathname === '/login/' ||
        props.location.pathname === '/news' ||
        props.location.pathname === '/news/' ||
        props.location.pathname.includes('/detail/')
    ) {
        return <div>{props.children}</div>
    }
    return (
        <Layout>
            <Sider />
            <Layout className="site-layout">
                <Header />
                <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    overflow: 'auto'
                }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default index;