import { useState, useEffect } from 'react';
import Label from "./common//Label";
import AutoComplete from './common/AutoComplete';
import './App.css';

function App() {
  const [javaMsg, setJavaMsg] = useState('');
  const [jsMsg, setJsMsg] = useState('');
  const [autoCompleteValues, setAutoCompleteValues] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    fetch('http://localhost:1080/autoComplete')
    .then(response => response.json())
    .then(json => {
      console.log(json);
      setAutoCompleteValues(json.message);
    })
    .catch(error => console.error(error));
  }, []);

  const callJava = async () => {
    const res = await fetch('http://localhost:1080/java');
    setJavaMsg(await res.text());
  };

  const callJs = async () => {
    const res = await fetch('http://localhost:1080/js');
    setJsMsg(await res.text());
  };

  const handleChange = (input) => {

    if (!input.trim()) {
      return [];
    }

    return [autoCompleteValues.find(item =>
      item.toLowerCase().includes(input.toLowerCase())
    )];
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <h1>MockServer Dual-Client Demo</h1>
        <button onClick={callJava}>Call /java (Java expectation)</button>
        <p>{javaMsg}</p>
        <button onClick={callJs}>Call /js (JS expectation)</button>
        <p>{jsMsg}</p>
      </div>
      <div>
        <h2>AutoComplete demo</h2>
        {!isEditable ? (
          <div>
            {autoCompleteValues && autoCompleteValues.map((label) => (
              <Label key={label} label={label} />
            ))}
            <button onClick={() => setIsEditable(true)}>
              Szerkeszt
            </button>
          </div>
        ) : (
          autoCompleteValues && autoCompleteValues.length > 0 && (
            <AutoComplete
              labelValues={autoCompleteValues}
              multiple={true}
              onChange={handleChange}
              onConfirm={() => setIsEditable(false)}
              onCancel={() => setIsEditable(false)}
            />
          )
        )}
      </div>
    </>
  );
}

export default App;
