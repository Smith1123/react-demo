// import { useState, useEffect } from 'react'

// function App() {
//   const [message, setMessage] = useState('Loading...');

//   useEffect(() => {
//     fetch('http://localhost:1080/') // MockServer endpoint
//       .then(res => res.text())
//       .then(setMessage)
//       .catch((e) => {
//         setMessage('Error connecting to MockServer')
//         console.error(e);
//       });
//   }, []);

//   return (
//     <div style={{ padding: '2rem', fontSize: '1.5rem' }}>
//       <h1>MockServer says:</h1>
//       <p>{message}</p>
//     </div>
//   )
// }

// export default App;
import { useState } from 'react';

function App() {
  const [javaMsg, setJavaMsg] = useState('');
  const [jsMsg, setJsMsg] = useState('');

  const callJava = async () => {
    const res = await fetch('http://localhost:1080/java');
    setJavaMsg(await res.text());
  };

  const callJs = async () => {
    const res = await fetch('http://localhost:1080/js');
    setJsMsg(await res.text());
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>MockServer Dual-Client Demo</h1>
      <button onClick={callJava}>Call /java (Java expectation)</button>
      <p>{javaMsg}</p>
      <button onClick={callJs}>Call /js (JS expectation)</button>
      <p>{jsMsg}</p>
    </div>
  );
}

export default App;
