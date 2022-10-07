import NewsPublish from "../../components/NewsPublish";
import { Button } from 'antd'
import useNews from '../../components/useNews'

const unpublished = () => {
    const {table, handlePublish} = useNews(1)
    return (
        <NewsPublish table={table} button={(id) => <Button type="primary" onClick={() => handlePublish(id)}>发布</Button>} />
    )
}

export default unpublished;