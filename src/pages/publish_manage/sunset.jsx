import NewsPublish from "../../components/NewsPublish";
import { Button } from 'antd'
import useNews from '../../components/useNews'

const sunset = () => {
    const {table, handleDelete} = useNews(3)
    return (
        <NewsPublish table={table} button={(id) => <Button type="primary" onClick={() => handleDelete(id)}>删除</Button>} />
    )
}

export default sunset;