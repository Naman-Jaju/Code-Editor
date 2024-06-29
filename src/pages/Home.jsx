import React, { useState } from 'react'
import {v4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId,setRoomId] = useState('');
  const [username,setUsername] = useState('');
  const navigate = useNavigate();

  const createNewRoom = (e)=>{
    e.preventDefault();
    const id = v4();
    setRoomId(id);
    toast.success("Created a new room");
  }

  const joinRoom = (e)=>{
    if(!roomId){
      toast.error("Room Id is required");
      return
    }
    if(!username){
      toast.error("Username is required");
      return;
    } 

    navigate(`/editor/${roomId}`,{
      state: {
        username,
      },
    });

    
  }
  return (
    <div className='homePageWrapper flex items-center justify-center text-white'>
      <div className='formWrapper p-[20px] rounded-sm w-[400px] '>
        <img src="https://repository-images.githubusercontent.com/745411638/f2ff988b-ee07-4ca3-b6c3-6784735026d6" alt="code sync logo" className='w-[300px] mb-5' />
        <h4 className='mainLabel mb-2 mt-0'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input 

          type="text" 
          placeholder='ROOM ID'  
          className='inputBox p-3 rounded-sm outline-none border-none mb-3 font-bold font-base text-black'
          onChange={(e)=>setRoomId(e.target.value)}
          value = {roomId}
         

          />
          <input 
          type="text" 
          placeholder='USERNAME' 
          className='inputBox p-3 rounded-sm outline-none border-none mb-3 font-bold font-base text-black'
          onChange={(e)=>setUsername(e.target.value)} 
          value={username}
    
          />

          <button 
          className='btn border-none p-3 rounded-md text-sm  w-[100px] ml-auto hover:bg-[#2b824c]'
          onClick={joinRoom}
          >
          Join
          </button>
          <span className='mt-4'>
            If you do not have a invite then create &nbsp;
            <a  onClick = {createNewRoom} href=" " className='createNewButton decoration-none'>
              new Room
            </a>
          </span>
        </div>
      </div>

     </div>
  )
}

export default Home;