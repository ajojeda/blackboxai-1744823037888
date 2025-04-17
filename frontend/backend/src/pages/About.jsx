import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center mb-6">
          <FontAwesomeIcon icon={faInfoCircle} className="h-8 w-8 text-blue-500 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
        </div>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">
            Welcome to our modern React application built with cutting-edge technologies.
            We utilize React for dynamic user interfaces, Tailwind CSS for beautiful styling,
            and Font Awesome for scalable icons.
          </p>
          <p>
            Our mission is to provide a seamless and engaging user experience while
            maintaining clean, maintainable code and following best practices in
            web development.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
