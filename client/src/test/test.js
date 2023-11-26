import {useState} from "react"
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import {  Input, Space } from 'antd';
import Uploading_Component from "../../Uploading/uploading";
import GPT_Chatting from "../../openai/chatting";

const { Dragger } = Upload;

//apikey
//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
function MainView(){

    const [api_text, setapi_test] = useState("")
    const [result, setresult] = useState("")


    const onChangeApiText = (e) =>{
        setapi_test(e.currentTarget.value)
    }

    // const onPromptBtnClick = () =>{
    //     GPT_Request(prompt, api_text)
    // }


    const onDrop = (e) =>{
        console.log(e)
    }

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188?mocky-delay=1000ms', //그냥 단순히 success:true를 받아오기 위함이다. 나중에 백엔드서버로 바꿀것
        headers: {
            authorization: 'authorization-text',
            'Access-Control-Allow-Origin': '*'
        },
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
        onDrop(e) {
        //   console.log('Dropped files', e.dataTransfer.files);
          onDrop(e.dataTransfer.files)
        },
      };

    const style = {
        textAlign: 'center',
        fontSize: '19px',
        lineHeight: '1.5',
    
    }

    const upload_style={
        position: 'relative',
        alightItems: 'center',
        justifyContent: 'center',
        display: 'inline-block'
    }

    const input_style={
        position: 'relative',
        paddingBottom: '50px'
    }

    return(
        <div style={style}>
            <h1>CHAT BOT</h1>
            <div style={input_style}>
                <Space.Compact style={{ width: '50%' }}>
                    <Input placeholder="OpenAI API KEY" onChange={onChangeApiText} value={api_text}/>
                    {/* <Button type="primary">Submit</Button> */}
                </Space.Compact>
            </div>
            <div style={upload_style}>
                <Dragger style={{padding: '15px'}} {...props}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                    </p>
                </Dragger>
                <Uploading_Component/>
            </div>
            <div>
                <Space.Compact style={{ width: '50%', padding: '20px' }}>
                    <GPT_Chatting />
                    {/* <Input placeholder="Debugging Prompt" onChange={onChangeprompt} value={prompt}/>
                    <Button type="primary" onClick={onPromptBtnClick}>Submit</Button> */}
                </Space.Compact>
            </div>
            <div>
                {result}
            </div>
        </div>
    )
}

export default MainView