import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
//import ACTIONS from '../Actions.js';
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
   
  const [clients,setClients] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const ReactNavigator = useNavigate();

  useEffect(()=>{
   const init = async()=>{
    socketRef.current = await initSocket();
    socketRef.current.on('connect_error',(err)=>handleError(err));
    socketRef.current.on('connect_failed',(err)=>handleError(err));

    function handleError(e){
      console.log('socket error',e);
      toast.error('Socket connection failed,try again later');
      ReactNavigator('/');

    }
      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
    });

    socketRef.current.on(
      'joined',
      ({clients,username,socketId})=>{
        if(username != location.state?.username){
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
      });
      }
    );

    socketRef.current.on(
      'disconnected',
      ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
              return prev.filter(
                  (client) => client.socketId !== socketId
              );
          });
      }
  );

};
   init();
   return () => {
    socketRef.current.disconnect();
    socketRef.current.off('joined');
    socketRef.current.off('disconnected');
};
   
  },[]);

  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('RoomId has been copied')
    } catch (error) {
      toast.error('Could not copy roomId');
      console.error(error);
    }
  }

  function leaveRoom(){
    ReactNavigator('/');
  }

  if(!location.state){
    return <Navigate to =  '/'/>
  } 

  return (
    <div className='main grid grid-cols-12 h-[100vh]'>
      <div className='left flex flex-col justify-between text-white p-4 col-span-2'>
        <div className='leftInner'>
          <div>
            <img src="https://repository-images.githubusercontent.com/745411638/f2ff988b-ee07-4ca3-b6c3-6784735026d6" alt="Logo" className=' logo w-[175px] h-[100px] mb-4 pb-3' />
          </div>
          <h3 className='mb-5'>Connected</h3>
          <div className='List flex items-center flex-wrap gap-8'>
            {

              clients.map((client) =>(
                <Client key = {client.socketId} username = {client.username}/>
              ))
              } 

          </div>
        </div>
        <div>
          <div className=' mt-4 h-10 mb-3'>
            <button className='btn copyBtn border-none p-2 rounded-md text-lg text-slate-900 font-bold  w-[100%]' onClick = {copyRoomId}>Copy ROOM ID</button>
          </div>
          <div className=' mt-4 h-10 mb-3'>
            <button className='btn leaveBtn border-none p-2 rounded-md text-lg  w-[100%] font-bold  hover:bg-[#2b824c]' onClick={leaveRoom}>Leave</button>
          </div>
        </div>
        
        

      </div>
      <div className='editor col-span-10'>
        <Editor 
          socketRef = {socketRef}
          roomId = {roomId}
          onCodeChange = {(code)=>{
            codeRef.current = code;
          }}
        />

      </div>
    </div>
  )
}

export default EditorPage;