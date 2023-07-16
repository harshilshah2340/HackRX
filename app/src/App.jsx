import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

var numberOfMessagesSent = 0;
var userDescription = "";

const API_KEY = "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";

const systemMessage = {
  "role": "system",
  "content": 
    "Explain things like you are a medical professional for a client with this information"
    +userDescription+"."
}

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm PharmaBuddy! To start, What is your name?",
      sender: "PharmaBuddy"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user"
      };

      const newMessages = [...messages, newMessage];
      
      setMessages(newMessages);

      setIsTyping(true);
      
      if(numberOfMessagesSent > 5){

      await processMessageToChatGPT(newMessages);

      } else if (numberOfMessagesSent == 0){

        userDescription = "Name: "+message
        setMessages([...newMessages, {
          message: "What is your Sex, Height and Weight?",
          sender: "PharmaBuddy"
        }]);

        setIsTyping(false);

      } else if (numberOfMessagesSent == 1){

        userDescription = userDescription + "\nSex,Height and Weight: "+message
        setMessages([...newMessages, {
          message: "Do you have any chronic conditions?",
          sender: "PharmaBuddy"
        }]);

        setIsTyping(false);

      } else if (numberOfMessagesSent == 2){

        userDescription = userDescription + "\nChronic Conditions: "+message
        setMessages([...newMessages, {
          message: "Have you had any surgeries",
          sender: "PharmaBuddy"
        }]);

        setIsTyping(false);

      } else if (numberOfMessagesSent == 3){

        userDescription = userDescription + "\nPast Surgeries: "+message
        setMessages([...newMessages, {
          message: "Do you gave any allergies?",
          sender: "PharmaBuddy"
        }]);

        setIsTyping(false);

      } else if (numberOfMessagesSent == 4){

        userDescription = userDescription + "\nAllergies: "+message
        setMessages([...newMessages, {
          message: "Are you on any medication?",
          sender: "PharmaBuddy"
        }]);

        setIsTyping(false);

      } else if (numberOfMessagesSent == 5){

        userDescription = userDescription + "\nCurrent Medication: "+message
        setMessages([...newMessages, {
          message: "What is the reason for your visit today?",
          sender: "PharmaBuddy"
        }]);

        setIsTyping(false);

      } 

      console.log(userDescription)
      numberOfMessagesSent++;

};

  async function processMessageToChatGPT(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "PharmaBuddy") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  
        ...apiMessages 
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "PharmaBuddy"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="PharmaBuddy is typing" /> : null}
            >
              {messages.map((message, i) => {
                return (<Message  key={i} model={message} />)
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App