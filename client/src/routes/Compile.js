import "../css/Menu.css";
import React, { Component, useState } from "react";

function Compile() {
  const[value, setValue] = useState();
  const[output, setOutput] = useState(``);
  //const[input, setInput] = useState(`/**********************************************************************\n                            Online C Compiler.\n         Write your code in this editor and press \"Run\" button.\n***********************************************************************/\n\n#include <stdio.h>\n\nint main() {\n\n    printf( \"Hello World\\n\");\n\n    return 0;\n}`); 
  const[input, setInput] = useState(``); 
  const[user_input, setUserInput] = useState(``);
  const onInputHandler = (e) => { setInput( e.currentTarget.value); }
  const onUserInputHandler = (e) => { setUserInput(e.currentTarget.value); }
  const lanChange = (e) => { setValue(e.target.value); }
  const clear = async (e) => { setInput(""); setUserInput(""); }
  const run = async (e) => {
    e.preventDefault();
    if(value == "html") {
      let outputText = document.getElementById("output");
      let tests = "";
      tests += input;

      outputText.innerHTML = tests;
    } else {
      let outputText = document.getElementById("output");
      outputText.innerHTML = "";
      outputText.innerHTML += "Creating Submission ...\n";
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
                  stdin: user_input,
                  language_id: value
                }),
            }
          );
      outputText.innerHTML += "Submission Created ...\n";
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
        outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
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
      outputText.innerHTML = "";
      outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
  }
};

    return (
      <div className="menu__container">
          <div className="compile">
              {/* <h2>Online Compiler
                  <sub style={{fontSize: 'small'}}> Powered by 
                    <a href="https://bit.ly/2UCsWRM">Judge0</a>
                  </sub>
               </h2>*/}
              <ul className="left">
                <li>
                  <div className="left">Source Code</div>
                  <div className="right">
                    Language &nbsp;&nbsp;
                    <select onChange={lanChange}>    
                       <option value="45">Assembly (NASM 2.14.02)</option>
                       <option value="46">Bash (5.0.0)</option>
                       <option value="47">Basic (FBC 1.07.1)</option>
                       <option value="html">HTML</option>
                       <option value="50">C (GCC 9.2.0)</option>
                       <option value="54">C++ (GCC 9.2.0)</option>
                       <option value="51">C# (Mono 6.6.0.161)</option>
                       <option value="86">Clojure (1.10.1)   </option>
                       <option value="55">Common Lisp (SBCL 2.0.0)</option>
                       <option value="56">D (DMD 2.089.1)</option>
                       <option value="44">Executable</option>
                       <option value="19">Crystal (0.23.1)</option>
                       <option value="57">Elixir (1.9.4)</option>
                       <option value="58">Erlang (OTP 22.2)</option>
                       <option value="59">Fortran (GFortran 9.2.0)</option>
                       <option value="60">Go (1.13.5)</option>
                       <option value="61">Haskell (GHC 8.8.1)</option>
                       <option value="25">Insect (5.0.0)</option>
                       <option value="62">Java (OpenJDK 13.0.1)</option>
                       <option value="63">JavaScript (Node.js 12.14.0)</option>
                       <option value="64">Lua (5.3.5)</option>
                       <option value="66">Octave (5.1.0)</option>
                       <option value="67">Pascal (FPC 3.0.4)</option>
                       <option value="68">PHP(7.4.1)</option>
                       <option value="43">Plain Text</option>
                       <option value="69">Prolog (GNU Prolog 1.4.5)</option>
                       <option value="71">Python (3.8.1)</option>
                       <option value="72">Ruby (2.7.0)</option>
                       <option value="73">Rust (1.40.0)</option>
                       <option value="74">TypeScript (3.7.4)</option>
                    </select>
                  </div>
                </li>
                <li><textarea onChange={onInputHandler} id="source" value={input}/></li>
                <li></li>
                <li>
                  
                </li>
                <li><h4>Input</h4></li>
                <li><textarea onChange={onUserInputHandler} id="input" value={user_input} /></li>
                <li><button onClick={run} id="run" >Run (Ctrl + Enter)</button> <button onClick={clear} id="clear" >Clear</button></li>
              </ul>
              
              <ul className="compile_output">
                <li><h4>Result</h4></li>
                <li><div id="output" defaultValue={""}> </div></li>
              </ul>
          </div>
      </div>
    );
};

export default Compile;