import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'

function Guidelines() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">RojGar Guidelines</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Guidelines for Workers */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">For Workers</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Maintain accurate and up-to-date profile information, including skills, experience, and availability.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Respond promptly to job offers and maintain clear communication with contractors.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Complete assigned tasks with professionalism and meet agreed-upon deadlines.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Report any workplace safety concerns or issues immediately to the contractor.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Maintain a positive work ethic and professional conduct at all times.</span>
              </li>
            </ul>
          </div>

          {/* Guidelines for Contractors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">For Contractors</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Provide clear job descriptions, requirements, and compensation details in job postings.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Ensure a safe working environment and provide necessary safety equipment and training.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Pay workers promptly according to agreed terms and maintain accurate payment records.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Provide clear instructions and necessary resources for workers to complete their tasks.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Maintain professional communication and address worker concerns promptly and fairly.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>By using this platform, both workers and contractors agree to follow these guidelines to ensure a productive and professional working environment.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Guidelines
