import { Redirect } from "umi";

const index = () => {
    return (
    <Redirect to='/home' />
    )
}

index.wrappers = ['@/wrappers/Auth'];
export default index;