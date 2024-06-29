// import React, { useEffect } from 'react';
// import Codemirror  from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/edit/closetag'
// import 'codemirror/addon/edit/closebrackets'

// const Editor = () => {
//     useEffect(()=>{
//         async function init(){
//             Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
//                 mode:{ name: 'javascript' , json: true },
//                 theme:'dracula',
//                 autoCloseTags: true,
//                 autoCloseBrackets: true,
//                 lineNumbers: true,
//             });
//         }
//         init(); 
//     },[]);
//   return (
//     <textarea name="" id="realtimeEditor"></textarea>
//   )
// }

// export default Editor

import CodeMirror from 'codemirror';
import React, { useEffect,useRef } from 'react'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'

export const Editor = ({ socketRef, roomId, onCodeChange }) => {

     const editorRef = useRef(null);

    useEffect(()=>{
        async function init(){
            editorRef.current = CodeMirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode: {name:'javascript',json: true},
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit('code-change', {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('code-change', ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off('code-change');
        };
    }, [socketRef.current]);
  return (
    <textarea id = "realtimeEditor">

    </textarea>
  )
}
export default Editor;