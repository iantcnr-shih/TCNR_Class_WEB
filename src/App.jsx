import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from "@/api/axios"

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get("/test")
        console.log(res.data)
      } catch (error) {
        console.error("API error:", error)
      }
    }

    fetchTest()
  }, [])

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-6xl font-bold text-green-400">
          Tailwind OK 🚀
        </h1>
      </div>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
