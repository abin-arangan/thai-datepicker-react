import { useState } from "react"
import ThaiCustomDatePicker from "./components/ThaiCustomDatePicker"

function App() {

  const [dob, setDob] = useState<string>("")

  return (
    <>
      <ThaiCustomDatePicker
        label="วันเกิด"
        placeholder="เช่น  26/09/2002"
        dob={dob}
        onSet={(thaiDate: string) => {
          console.info(thaiDate)
          setDob(thaiDate)
        }}
      />
    </>
  )
}

export default App
