import {useState, useEffect, useRef} from "react";
import gptLogo from '../../../assets/chatgpt.svg'
import addBtn from '../../../assets/add-30.png'
import msgIcon from '../../../assets/message.svg'
import home from '../../../assets/home.svg'
import saved from '../../../assets/bookmark.svg'
import sendBtn from '../../../assets/send.svg'
import userIcon from '../../../assets/user-icon.png'
import gptImgLogo from '../../../assets/chatgptLogo.svg'

function Chat_View(){
    const msgEnd = useRef();

    const [input, setInput] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([{
        text: "say somethig!",
        isBot: true
    }])
    const [sel_model, setsel_model] = useState("gpt-3.5-turbo");


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

        const url = new URL("/api/ai/sendquery", "http://localhost:5000");
        url.searchParams.append("model_name", sel_model);
        url.searchParams.append("message", input);
        const response = await fetch(url);


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

    useEffect(()=>{
        msgEnd.current.scrollIntoView();
    },[messages, answer])

    return(
        <div className="ChatView">
            <div className="sideBar">
                <div className="upperSide">
                    <div className="upperSideTop"><img src={gptLogo} className="logo" alt="logo" /><span className="brand">SearchPDFs</span></div>
                    <button className="midBtn"><img src={addBtn} className="addBtn"/>New Chat</button>
                    <div className="upperSideBottom">
                        <button className="query"><img src={msgIcon} alt="query" />Test</button>
                        <button className="query"><img src={msgIcon} alt="query" />What is DeepLearning</button>
                    </div>
                </div>
                <div className="lowerSide">
                    <div className="listItems"><img src={home} alt="home" className="listItemsImg"/>Home</div>
                    <div className="listItems"><img src={saved} alt="save" className="listItemsImg"/>Saved</div>
                </div>
            </div>
            <div className="main">
                <div className="chats">
                    {messages.map((message, i)=>
                        <div key={i} className={message.isBot?"chat bot":"chat"}>
                            <img className="chatImg" src={message.isBot?gptImgLogo:userIcon} /> <p className="txt">{message.text}</p>
                        </div>
                    )}
                    {answer &&
                        <div className="chat bot">
                            <img className="chatImg" src={gptImgLogo} /> <p className="txt">{answer}</p>
                        </div>
                    }
                    <div ref={msgEnd} />
                </div>
                <div className="chatFooter">
                    <div className="inp">
                        <input type="text" placeholder="Send a message" onKeyDown={handleOnKeyPress} value={input} onChange={(e)=>{setInput(e.target.value)}}/><button className="send" onClick={handleSend}><img src={sendBtn} alt="Send"/></button>
                    </div>
                    <p>ChatGPT may productalsidjalsdjiasldij</p>
                </div>
            </div>
        </div>
    )
}


export default Chat_View