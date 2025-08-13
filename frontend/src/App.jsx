import { useState } from "react";
import Navbar from "./components/Navbar"
import Step1Form from "./components/Step1Form";
import Step2Form from "./components/Step2Form";
import Footer from "./components/Footer";
import WarningMarquee from "./components/WarningMarquee";



function App() {

  const [submissionId, setSubmissionId] = useState(null);

  return (
    <>

      <Navbar />

      <div className="bg-[#f2f6f9] py-3 pt-22 ">
        <h1 className="text-center text-[#1a1a55] font-[Source_Sans_Pro] text-lg md:text-xl ">
          UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
        </h1>
        <WarningMarquee />
      </div>


      <div className="max-w-5xl mx-auto p-4 space-y-6 mt-6">
        {/* Step 1 Form */}
        <Step1Form onSuccess={(id) => setSubmissionId(id)} />

        {/* Step 2 Form appears after Step 1 success */}
        {submissionId && <Step2Form submissionId={submissionId} />}
      </div>

      <Footer />
    </>
  )
}

export default App
