import { useState } from "react"
import {createGlobalStore} from 'hox'

const useCollapsed = () => {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }
    return {
        collapsed,
        changeCollapsed
    }
}


export default createGlobalStore(useCollapsed)