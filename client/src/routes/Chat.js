import React, { useState, useEffect, useCallback, useRef } from "react";
import '../css/Components.css';
import "../css/Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faCode, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import AceEditors from "../lib/AceImport";

const socket = socketIOClient.connect("/");

function Chat(props) {
   const mounted = useRef(false);
   const aceinput = useRef(null);
   const [sendMode, setSend] = useState(true);
   const [language, setLanguage] = useState(45);
   const [name, setName] = useState('');
   const [lang, setLang] = useState('');
   const [input, setInput] = useState(''); 

   const [inputMessage, setInputMessage] = useState(''); // 입력값을 저장하는 상태값
   const [chatMonitor, setChatMonitor] = useState([]);

   const [user, setUser] = useState();
   const [recentChat, setRecentChat] = useState('');

   const getUser = async (e) => {
      await Axios.get("/member/session").then((res) => {
         if(res.data !== "fail") {
            setUser(res.data.id);
            setName(res.data.name);
         }
      });
   }

   useEffect(() => {
      getUser();
   }, [])

   useEffect(() => {
      if(!mounted.currnet) {
         mounted.currnet = true;
      } else {
         getUser();
      }
   }, [user]);


   const scrollToBottom = () => {
      window.scrollTo(0,document.getElementById("chatMonitor").scrollHeight);
   };

   const lanChange = async (e) => { setLanguage(e.target.value); setmode(e.target.value);}

   function setmode(num){
      if(num === "html"){
         setLang('html');
         aceinput.current.editor.setValue('<div>Hello World!</div>');
      }
      else{
         switch(parseInt(num)){
            //case 19 : setLang('crystal'); aceinput.current.editor.setValue(''); break;
            //case 43 : setLang('plain_text'); aceinput.current.editor.setValue(''); break;
            case 45 : setLang('assembly_x86'); aceinput.current.editor.setValue('section .data\nmsg   db    \'Hello world!\', 0AH\nlen   equ   $-msg\n\nsection .text\nglobal _WinMain@16\n\n_WinMain@16:\nmov   edx, len\nmov   ecx, msg\nmov   ebx, 1\nmov   eax, 4\n\nint   80h\n\nmov   ebx, 0\nmov   eax, 1\nint   80h\n'); break;
            case 50 : setLang('c_cpp'); aceinput.current.editor.setValue('void main(){\n\tprintf("Hello World");\n}'); break;
            case 51 : setLang('csharp'); aceinput.current.editor.setValue('using System;\nclass HelloWorld {\n  static void Main() {\n    Console.WriteLine("Hello World");\n  }\n}'); break;
            case 54 : setLang('c_cpp'); aceinput.current.editor.setValue('#include <iostream>\nusing namespace std;\n\nint main(){\n    cout<<"Hello world";\nreturn 0;\n}'); break;
            case 55 : setLang('lisp'); aceinput.current.editor.setValue('(defun hello ()\n    (format t "Hello, World!~%"))\n(hello)'); break;
            case 56 : setLang('d'); aceinput.current.editor.setValue('import std.stdio; \n\nvoid main() {\n    writeln("Hello world!");\n}'); break;
            //case 57 : setLang('elixir'); aceinput.current.editor.setValue(''); break;
            //case 58 : setLang('erlang'); aceinput.current.editor.setValue(''); break;
            case 59 : setLang('fortran'); aceinput.current.editor.setValue('Program Hello\nPrint *, "Hello World"\nEnd Program Hello'); break;
            case 60 : setLang('golang'); aceinput.current.editor.setValue('package main  \n import "fmt"\n func main() {\n fmt.Println("Hello World")\n}'); break;
            case 61 : setLang('haskell'); aceinput.current.editor.setValue('main = putStrLn "Hello World"'); break;
            case 62 : setLang('java'); aceinput.current.editor.setValue('public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}'); break;
            case 63 : setLang('javascript'); aceinput.current.editor.setValue('console.log("Hello world");'); break;
            case 64 : setLang('lua'); aceinput.current.editor.setValue('print "Hello world"'); break;
            case 67 : setLang('pascal'); aceinput.current.editor.setValue('program Hello;\nbegin\n  writeln ("Hello, world.");\nend.'); break;
            case 68 : setLang('php'); aceinput.current.editor.setValue('<?php\n echo "Hello World";'); break;
            //case 69 : setLang('prolog'); aceinput.current.editor.setValue(''); break;
            case 71 : setLang('python'); aceinput.current.editor.setValue('print("Hello World!")'); break;
            //왜안돼 case 72 : setLang('ruby'); aceinput.current.editor.setValue('puts "Hello World"'); break;
            case 73 : setLang('rust'); aceinput.current.editor.setValue('fn main() {\n    println!("Hello World");\n}'); break;
            case 74 : setLang('typescript'); aceinput.current.editor.setValue('console.log("Hello");'); break;
            case 86 : setLang('clojure'); aceinput.current.editor.setValue('(ns clojure.examples.main\n    (:gen-class))\n(defn Example []    (println (str "Hello World")) )\n(Example)'); break;
            defualt : aceinput.current.editor.setValue('default');
         }
      }
   }

   const codeOn = async () => {
      setSend(!sendMode);
   }

   const complieOn = async () => {
      let outputText = "";
      if(language == "html") {
         let tests = "";
         tests += input;

         outputText = tests;
      } else {
         outputText += "";
         outputText += "Creating Submission ...\n";
         const response = await fetch(
            "https://judge0-extra.p.rapidapi.com/submissions",
            {   method: "POST",
            headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com", //"judge0-extra.p.rapidapi.com",
                    "x-rapidapi-key": "010d0e431bmsh5ec04bcfb3323c6p179977jsn34a62e011152", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
                    "content-type": "application/json",
                    accept: "application/json"
                },
                body: JSON.stringify({
                   source_code: input,
                   language_id: language
                   // stdin: user_input,
                }),
            }
            );
         //outputText.innerHTML += "Submission Created ...\n";
         outputText += "Submission Created ...\n";
         const jsonResponse = await response.json();

         let jsonGetSolution = {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
         };

         while (
            jsonGetSolution.status.description !== "Accepted" &&
            jsonGetSolution.stderr == null &&
            jsonGetSolution.compile_output == null
            ){
            //outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
               outputText = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
               if (jsonResponse.token) {
                  let url = `https://judge0-extra.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

                  const getSolution = await fetch(url, {
                     method: "GET",
                     headers: {
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                               "x-rapidapi-key": "010d0e431bmsh5ec04bcfb3323c6p179977jsn34a62e011152", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
                                //"useQueryString": true
                                "content-type": "application/json",
                            },
                        });
                  jsonGetSolution = await getSolution.json();
               }
         }
         if (jsonGetSolution.stdout) {
            const output = atob(jsonGetSolution.stdout);
            outputText = "";
            outputText += `Results :\n${output} \n Execution Time : ${jsonGetSolution.time} Secs \n Memory used : ${jsonGetSolution.memory} bytes`;
         } else if (jsonGetSolution.stderr) {
            const error = atob(jsonGetSolution.stderr);
            outputText = "";
            outputText += `\n Error :${error}`;
         } else {
            const compilation_error = atob(jsonGetSolution.compile_output);
            outputText = "";
            outputText += `\n Error :${compilation_error}`;
         }
      }
      
      socket.emit('code_send', { name: name, code : input, lang: lang, message: outputText });
   }

   const submit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(sendMode) { // txt - true
      	console.log(inputMessage);
         socket.emit('message', { name: name, message: inputMessage });
          setInputMessage("");
      } else {
         complieOn();
      }
   };

   const inputChange = (e) => {setInputMessage (e.target.value);}

   useEffect(() => {
      socket.on('upload', (data) => {
         setRecentChat(data);
      });
   }, []);

   useEffect(() => {
      socket.on('uploads', (data) => {
         setRecentChat(data);
      });
   }, []);

   useEffect(async () => {      
      (await Object.keys(recentChat).length) > 0 && setChatMonitor([...chatMonitor, recentChat]);
      scrollToBottom();
      setRecentChat('');
   }, [recentChat]);

   return (

   <div className="menu__container" >            
      <div id="chat_box">
         <h2>Chatting</h2>       
         <section className="chat-list" id="chatMonitor">
             {
                chatMonitor.map((item: Message, i: number) =>
                   <div className="msgbox">
                      <div key={i} className={
                         (item.name === name) ? "message mright" : "message mleft"
                      }>
                      <p className={
                         (item.name === name) ? "username uright" : "username uleft"
                      }>{item.name}</p>
                      {
                         (item.code) ? (
                            // 보낸 언어를 받아와서 mode = {itme.lang} 으로 뿌려줘야할듯
                            <div id="code_box">
                               
                               <div id="code-ace">
                                  <React.Fragment>
                                        <AceEditors
                                          className="aceeditors"
                                          mode= {item.lang}
                                          theme="monokai"
                                          value={item.code}
                                          fontSize={20}
                                          showPrintMargin={true}
                                          showGutter={true}
                                          highlightActiveLine={true}
                                         
                                          setOptions={{
                                          showLineNumbers: true,
                                          tabSize: 2,
                                          }}
                                          />
                                     </React.Fragment>
                               </div>
                               
                            <p className="message-result">{item.message}</p>
                            </div>
                         ) : <p className="message-text">{item.message}</p>
                      }
                      
                      </div>
                   </div>      
                )
             }
          </section>
         
         <div className="chat-form">
         <form onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}>
            {
               (sendMode) ? <input type="text" autoComplete="off" onChange={inputChange} value={inputMessage} id="txt" />
               :
                  (<div id="chat_ace">
                     <React.Fragment>
                            <AceEditors
                              className="aceeditor"
                              id="input"
                              ref={aceinput}

                              mode= {lang}
                              theme="monokai"
                              onChange={(value)=>setInput(value)}
                              fontSize={20}
                              showPrintMargin={true}
                              showGutter={true}
                              highlightActiveLine={true}
                             
                              setOptions={{
                              showLineNumbers: true,
                              tabSize: 2,
                              }}
                              />
                         </React.Fragment>
                  </div>)
            }

            <div id="send_box">
               
                  { (!sendMode) && 
                     (<select name="code_lang" onChange={lanChange}>
                        <option value="45">Assembly (NASM 2.14.02)</option>                     
                        <option value="html">HTML</option>
                        <option value="50">C (GCC 9.2.0)</option>
                        <option value="54">C++ (GCC 9.2.0)</option>
                        <option value="51">C# (Mono 6.6.0.161)</option>

                        <option value="86">Clojure (1.10.1)   </option>
                        <option value="55">Common Lisp (SBCL 2.0.0)</option>
                        <option value="56">D (DMD 2.089.1)</option>
                        <option value="59">Fortran (GFortran 9.2.0)</option>
                        <option value="60">Go (1.13.5)</option>

                        <option value="61">Haskell (GHC 8.8.1)</option>
                        <option value="62">Java (OpenJDK 13.0.1)</option>
                        <option value="63">JavaScript (Node.js 12.14.0)</option>
                        <option value="64">Lua (5.3.5)</option>
                        <option value="67">Pascal (FPC 3.0.4)</option>

                        <option value="68">PHP(7.4.1)</option>
                        <option value="71">Python (3.8.1)</option>
                        <option value="72">Ruby (2.7.0)</option>
                        <option value="73">Rust (1.40.0)</option>
                        <option value="74">TypeScript (3.7.4)</option>
                     </select>)
                  }

                  <div id="send_btn">
                     <button type="submit" id="send" className="left"><FontAwesomeIcon icon={faPaperPlane} size="2x"/></button>
                     
                     {
                        (sendMode) ? <button type="button" id="code" className="right" onClick={codeOn}><FontAwesomeIcon icon={faCode} size="2x" /></button> :
                        <button type="button" id="codes" className="right" onClick={codeOn}><FontAwesomeIcon icon={faCommentDots} size="2x"/></button>
                     }
                     
                  </div>
               
            </div>
            </form>
         </div>
      
      </div>
   </div>
   );
};

export default Chat;

   