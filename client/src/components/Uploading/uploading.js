import {Upload } from 'antd';

const Uploading_Component = () =>{

    const props = {
        action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
        listType: "picture",
        headers: {
            authorization: 'authorization-text',
            'Access-Control-Allow-Origin': '*'
        }
    }

    return(
        <>
            <Upload
                {...props}
            >
            </Upload>
        </>
    )
}

export default Uploading_Component