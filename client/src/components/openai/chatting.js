import {useState, useCallback} from 'react';
import {Input, Button, Radio} from 'antd';

//few shot prompting으로 우리가 원하는 모델결과를 방향으로 재학습 (전이학습같은 느낌)

const model_options = [
    {label: 'GPT-3.5', value: 'gpt-3.5-turbo'},
    {label: 'LLaMA', value: 'LLaMA'},
    {label: 'GPT4', value: 'gpt4'},
]

const GPT_Chatting = () =>{
    const [user_chats, setuser_chats] = useState([]);
    const [bot_chats, setbot_chats] = useState([]);
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sel_model, setsel_model] = useState("gpt-3.5-turbo")


    const onChangeModel = ({target: {value}})=>{
        setsel_model(value)
    }

    //axios말고 fetch써야함 stream으로 응답을 받아와야하는데 
    //axios에도 stream으로 받아오는게 있긴하지만 browser에서 xmlhttprequests를 이용해서 request를 만들게 되는데,
    //이것이 stream형식을 지원하지 않는다고 한다.
    //참고 https://yogae.github.io/etc/2019/06/11/node_client_stream.html
    const handleSubmit = useCallback(async (e) => {
        if(query !== ""){
            setIsLoading(true)
            e.preventDefault()
        
            // Send request
            const url = new URL("/api/ai/sendquery", "http://localhost:5000");
            url.searchParams.append("model_name", sel_model);
            url.searchParams.append("message", query);
            const response = await fetch(url);
        
            // Stream response
            if (!response.body) throw new Error("No response body");
            const reader = response.body.getReader();
        
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const text = new TextDecoder("utf-8").decode(value);
              setAnswer((prevText) => prevText + text);
            }
            setIsLoading(false)
        }

      }, [setAnswer, setQuery, query]);

    const onQueryInput = (e) =>{
        setQuery(e.currentTarget.value)
    }


    return (
        <div>
            <div>
                <Radio.Group options={model_options} onChange={onChangeModel} value={sel_model} defaultValue={sel_model} optionType="button" />
            </div>
                <br />
            <div>
                <Input placeholder="Chat with Bot!" onChange={onQueryInput} value={query}/>
                <Button type="primary" onClick={handleSubmit} loading={isLoading}>
                    Send
                </Button>
            </div>
        <div>
            {answer && (
                <div>
                    <b>Answer:</b>
                    <b>{answer}</b>
                </div>
                )}
        </div>

        </div>
    )
}

export default GPT_Chatting