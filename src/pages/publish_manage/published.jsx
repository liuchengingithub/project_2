import NewsPublish from "../../components/NewsPublish";
import { Button } from 'antd'
import useNews from '../../components/useNews'

const published = () => {
    const {table, handleSunset} = useNews(2)
    console.log(table)
    return (
        <NewsPublish table={table} button={(id) => <Button type="primary" onClick={() => handleSunset(id)}>下线</Button>} />
    )
}

export default published;