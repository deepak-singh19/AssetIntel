import './App.css'
import MyEditor from './component/EditorComponent'

function App() {

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Draft.js Editor</h1>
      <MyEditor />
    </div>
  )
}

export default App
