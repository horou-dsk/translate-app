import { createSignal, onMount } from "solid-js";
// import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import "jsoneditor/dist/jsoneditor.min.css";
import JSONEditor from "jsoneditor";

function App() {
  const [toLang, setToLang] = createSignal("en");

  let fromElem: HTMLDivElement | undefined;
  let toElem: HTMLDivElement | undefined;

  let editorFrom: JSONEditor;
  let editorTo: JSONEditor;

  async function translate() {
    let keys: string[] = [];
    let values: string[] = [];
    try {
      const obj = JSON.parse(editorFrom.getText());
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          keys = keys.concat(Object.keys(obj[key]));
          values = values.concat(Object.values(obj[key]));
        } else {
          keys.push(key);
          values.push(obj[key]);
        }
      }
      const result = await invoke<string[]>('google_translate', {value: values, outputLang: toLang()});
      let i = 0;
      let newObj: Record<string, any> = {};
      for (let k of Object.keys(obj)) {
        if (typeof obj[k] === 'object') {
          newObj[k] = {};
          for (let _ of Object.keys(obj[k])) {
            const key = keys[i];
            const value = result[i];
            newObj[k][key] = value;
            i += 1;
          }
        } else {
          const key = keys[i];
          const value = result[i];
          newObj[key] = value;
          i += 1;
        }
      }
      editorTo.setText(JSON.stringify(newObj, null, 2));
    } catch (e: any) {
      console.log(e);
      alert(e);
    }
  }

  onMount(() => {
    editorFrom = new JSONEditor(fromElem!, {
      onChangeText: (_jsonText: string) => {
        // console.log(jsonText);
      }
    });
    editorTo = new JSONEditor(toElem!, {});
    editorFrom.setMode('text');
    editorTo.setMode('text');
  });

  return (
    <div class="container">
      <div class="from" ref={fromElem}></div>
      <div class="btn-wrap">
        <select name="" id="" value={toLang()} onChange={event => setToLang(event.currentTarget.value)}>
          <option value="en">英文</option>
          <option value="zh-TW">繁体</option>
          <option value="ja">日语</option>
        </select>
        <button onClick={translate}>Translate</button>
      </div>
      <div class="to" ref={toElem}></div>
    </div>
  );
}

export default App;
