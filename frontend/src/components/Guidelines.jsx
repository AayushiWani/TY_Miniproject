import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'

function Guidelines() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-700 text-white p-4 mb-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold">RojGar Guidelines</h1>
          <p className="mt-2">Official rules and standards for platform users</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Guidelines for Workers */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">For Workers</h2>
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
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Verify your identity with Aadhar card to increase your credibility and trust.</span>
              </li>
            </ul>
          </div>

          {/* Guidelines for Contractors */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">For Contractors</h2>
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
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Register with GSTIN to verify your business legitimacy and improve trust with workers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-gray-700">By using this platform, both workers and contractors agree to follow these guidelines to ensure a productive and professional working environment.</p>
        </div>

        {/* FAQs Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium text-blue-600 mb-2">How do I verify my Aadhar as a worker?</h3>
                <p className="text-gray-700">To verify your Aadhar, go to your profile settings and select the "Verify Identity" option. You'll need to provide your Aadhar number and complete the verification process securely through our platform.</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium text-blue-600 mb-2">What is GSTIN and why do I need it as a contractor?</h3>
                <p className="text-gray-700">GSTIN (Goods and Services Tax Identification Number) verifies your business legitimacy. Adding this to your profile builds trust with workers and confirms you operate a registered business in compliance with tax regulations.</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium text-blue-600 mb-2">How are payment disputes resolved?</h3>
                <p className="text-gray-700">If there's a payment dispute, both parties should first attempt to resolve it directly. If that's unsuccessful, you can report the issue through our dispute resolution system, where a mediator will review the case based on evidence provided by both parties.</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium text-blue-600 mb-2">Can I work in multiple categories as a worker?</h3>
                <p className="text-gray-700">Yes, you can list multiple skills and work in different job categories. Make sure to accurately represent your experience level in each skill to help contractors find the right match for their projects.</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium text-blue-600 mb-2">How long does verification take?</h3>
                <p className="text-gray-700">Aadhar verification for workers typically takes 24-48 hours, while GSTIN verification for contractors may take 2-3 business days as we conduct necessary checks to ensure compliance with regulations.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-blue-600 mb-2">Is my personal information secure?</h3>
                <p className="text-gray-700">Yes, we maintain strict security protocols that comply with data protection regulations. Your Aadhar and GSTIN information is encrypted and only used for verification purposes. We do not share this information with other users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Guidelines
