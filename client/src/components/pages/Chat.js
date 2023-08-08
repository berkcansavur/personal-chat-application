import io from 'socket.io-client';
const socket = io("http://localhost:1734");


function Chat(){
    const message = document.getElementById('message');
    const messages = document.getElementById('messages');

    const handleSubmitNewMessage = () =>{
        if(message){
            socket.emit('message', {data: message.value})
        }
    }

    socket.on('message', ({data}) =>{
        console.log(data);
        handleNewMessage(data);
    });
    const handleNewMessage = (message) =>{
        messages.appendChild(buildNewMessage(message));
    }
    const buildNewMessage = (message) =>{
        if(message!=null){
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(message));
            return li;
        }
        else{ 
            const li  = document.createElement('li');
            return li;
        }
    }
    return(
    <>
        <div>
            <ul id='messages'></ul>
        </div>
        <div>
            <input id='message' type='text'/>
            <button onClick={handleSubmitNewMessage}>Submit</button>
        </div>
    </>)
}
export default Chat;