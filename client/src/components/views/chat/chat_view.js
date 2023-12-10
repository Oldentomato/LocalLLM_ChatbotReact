import {useState, useEffect, useRef} from "react";
import gptLogo from '../../../assets/chatgpt.svg'
import addBtn from '../../../assets/add-30.png'
import msgIcon from '../../../assets/message.svg'
import home from '../../../assets/home.svg'
import saved from '../../../assets/bookmark.svg'
import sendBtn from '../../../assets/send.svg'
// import userIcon from '../../../assets/user-icon.png'
import userIcon from '../../../assets/ui.png'
import gptImgLogo from '../../../assets/chatgptLogo.svg'
import {Link} from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { Radio } from 'antd';
import { Button, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Table  } from 'antd';


const model_options = [
  // {
  //   label: 'GPT-3.5',
  //   value: 'gpt-3.5-turbo',
  // },
  {
    label: 'LocalModel',
    value: 'LocalModel',
  },
  {
    label: 'SearchDoc',
    value: 'SearchDoc',
  }
];

const embedding_options = [
  {
    label: 'BERT',
    value: 'bert',
  },
  {
    label: 'TF-IDF',
    value: 'tf-idf',
  }
];

const columns = [
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'Page',
    dataIndex: 'page',
    key: 'page',
  }
]

function Chat_View(){
    const msgEnd = useRef();

    const [uploadloading, setUploadLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [input, setInput] = useState("");
    const [answer, setAnswer] = useState("");
    const [filelist, setFilelist] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([{
        text: "say something!",
        isBot: true
    }])
    const [model, setModel] = useState('SearchDoc');
    const [embeddingmodel, setEmbeddingModel] = useState('tf-idf');

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleOk = async() => {
      setUploadLoading(true);
      const url = new URL("/model/pdfembedding", "http://localhost:8000");
      const formData = new FormData();
      filelist.forEach(file => formData.append('pdfs', file))
      if(embeddingmodel === 'tf-idf'){
        formData.append('mode',embeddingmodel)
      }
      let response = null

      response = await fetch(url,{
        method: 'POST',
        body: formData
      });
      message.success("upload successful!")
      setUploadLoading(false);
      setFilelist([])
      setIsModalOpen(false);
      
    };

    const handleCancel = () => {
        setIsModalOpen(false);
      };

    const modelChange = ({ target: { value } }) => {
        setModel(value);
      };

    const embeddingChange = ({ target: { value } }) => {
      setEmbeddingModel(value);
    };

    const handleOnKeyPress = e => {
        if (e.key === 'Enter') {
            handleSend(); // Enter 입력이 되면 클릭 이벤트 실행
        }
      };

    const handleSend = async(e) =>{
        setIsLoading(true)
        setMessages(()=>[
            ...messages,
            {text: input, isBot: false}
          ])
        setInput("")
        let response = null

        if(model === "gpt-3.5-turbo"){
            const url = new URL("/api/ai/sendquery", "http://localhost:5000");
            url.searchParams.append("message", input);
            url.searchParams.append("model_name", model);
            response = await fetch(url);
        }
        else if(model === "LocalModel"){
            const url = new URL("/model/llamaquery", "http://localhost:8000");

            const formData  = new FormData();
            formData.append("query", input);
            response = await fetch(url,{
                method: 'POST',
                body: formData
            });

            if (!response.body) throw new Error("No response body");
            const reader = response.body.getReader();
            let temp_str = ""
    
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const text = new TextDecoder("utf-8").decode(value);
              temp_str += text
              setAnswer((prevText) => prevText + text);
              
            }
            setMessages(()=>[
                ...messages,
                {text: input, isBot: false},
                {text: temp_str, isBot: true}
              ])
            setAnswer("")
            setIsLoading(false)
        }
        else if(model === "SearchDoc"){
          const url = new URL("/model/searchdoc", "http://localhost:8000");

          const formData  = new FormData();
          formData.append("query", input);
          formData.append("doc_count", 1);
          formData.append("mode", embeddingmodel);
          response = await fetch(url,{
              method: 'POST',
              body: formData
          });

          if (!response.body) throw new Error("No response body");
          const reader = response.body.getReader();
          const { done, value } = await reader.read();
          const text = new TextDecoder("utf-8").decode(value);
          const dict = JSON.parse(text)
          const doc_template = {content: dict.doc,
                                source: dict.source,
                                page: dict.page}
          setMessages(()=>[
            ...messages,
            {text: input, isBot: false},
            {text: doc_template, isBot: true}
          ])
          setIsLoading(false)
      }




    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'application/pdf';
        if (!isJpgOrPng) {
          message.error('You can only upload pdf file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
          message.error('Pdf must smaller than 50MB!');
        }

        setFilelist(filelist.concat(file));
        return isJpgOrPng && isLt2M;
      };

    const handleChange = async(info) => {
        if (info.file.status === 'uploading') {
            setUploadLoading(true);
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
        //   getBase64(info.file.originFileObj, (url) => {
        //     setUploadLoading(false);
        //   });
        setUploadLoading(false);
        }
      };



    useEffect(()=>{
        msgEnd.current.scrollIntoView();
    },[messages, answer])

    return(
        <div className="ChatView">
            <Modal title="PDF Uploader" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="file-uploader"
                    showUploadList={true}
                    beforeUpload={beforeUpload}
                    onRemove={handleOk}
                    
                    // onChange={handleChange}
                >
                    <div>
                        {uploadloading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div
                            style={{
                            marginTop: 8,
                            }}
                        >
                            Upload
                        </div>
                    </div>
                </Upload>
            </Modal>
            <div className="sideBar">
                <div className="upperSide">
                    <div className="upperSideTop"><img src={gptLogo} className="logo" alt="logo" /><span className="brand">SearchPDFs</span></div>
                    <button className="midBtn"><img src={addBtn} className="addBtn"/>New Chat</button>
                    <div className="upperSideBottom">
                        <button className="query"><img src={msgIcon} alt="query" />Test</button>
                        <button className="query"><img src={msgIcon} alt="query" />What is DeepLearning</button>
                    </div>
                    <div>
                        <Button type="primary" onClick={showModal}>
                            Upload PDF
                        </Button>
                    </div>
                </div>
                <div className="lowerSide">
                    <div className="listItems"><img src={home} alt="home" className="listItemsImg"/><Link to="/"><p style={{color:"white"}}>Home</p></Link></div>
                    <div className="listItems"><img src={saved} alt="save" className="listItemsImg"/>Saved</div>
                </div>
            </div>
            <div className="main">
                <div className="chats">
                    <AnimatePresence>
                        {messages.map((message, i)=>
                            <Item key={i}>
                                <div className={message.isBot?"chat bot":"chat"}>
                                    <img className="chatImg" src={message.isBot?gptImgLogo:userIcon} /> 
                                    {typeof message.text === "object" ? <Table columns={columns} dataSource={[message.text]} /> : <p className="txt">{message.text}</p>}
                                </div>
                            </Item>

                        )}
                    </AnimatePresence>
                    {(!answer && isLoading) &&
                        <div className="chat bot">
                            <img className="chatImg" src={gptImgLogo} /> <p className="txt">. . .</p>
                        </div>
                    }
                    {answer &&
                        <div className="chat bot">
                            <img className="chatImg" src={gptImgLogo} /> <p className="txt">{answer}</p>
                        </div>
                    }
                    <div ref={msgEnd} />
                </div>
                <div className="chatFooter">
                    <Radio.Group optionType="button" buttonStyle="solid" options={embedding_options} onChange={embeddingChange} value={embeddingmodel} />
                    <br />
                    <Radio.Group optionType="button" buttonStyle="solid" options={model_options} onChange={modelChange} value={model} />
                    <br />
                    <div className="inp">
                        <input type="text" placeholder="Send a message" onKeyDown={handleOnKeyPress} value={input} onChange={(e)=>{setInput(e.target.value)}}/><button className="send" onClick={handleSend}><img src={sendBtn} alt="Send"/></button>
                    </div>
                    <p>Searching pdfs for uinetworks</p>
                </div>
            </div>
        </div>
    )
}
const Item = ({ children, onClick }) => {
    const isPresent = useIsPresent();
    const animations = {
      style: {
        position: isPresent ? "static" : "absolute"
      },
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      transition: { type: "spring", stiffness: 900, damping: 40 }
    };
    return (
      <motion.div {...animations}>
        {children}
      </motion.div>
    );
};


export default Chat_View