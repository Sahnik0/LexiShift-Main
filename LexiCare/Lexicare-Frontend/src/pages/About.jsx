import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-gray-800'>
          ABOUT <span className='text-[#1CBBB4]'>LEXICARE</span>
        </h2>
        <p className='mt-3 text-gray-600 max-w-xl mx-auto'>
          A proud initiative dedicated to connecting individuals with dyslexia to experienced mentors
        </p>
      </div>
      
      <div className='flex flex-col md:flex-row items-center gap-12 lg:gap-20'>
        {/* Left: Image */}
        <div className='w-full md:w-1/2'>
          <img 
            className='w-full max-w-lg mx-auto rounded-lg shadow-lg' 
            src={assets.about_image} 
            alt="Dyslexia support illustration" 
          />
        </div>
        
        {/* Right: About Information */}
        <div className='w-full md:w-1/2 flex flex-col gap-8'>
          <div className='space-y-4'>
            <p className='text-gray-600 leading-relaxed'>
              Welcome to LexiCare, a proud initiative of LexiShift, dedicated to connecting individuals with dyslexia to experienced mentors and consultants. We understand the unique challenges that people with dyslexia face in their educational and professional journeys, and we're here to provide specialized support and guidance.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              At LexiCare, we believe that everyone deserves access to quality educational support. Our platform brings together certified dyslexia specialists, educational consultants, and experienced mentors who are passionate about helping individuals with dyslexia unlock their full potential.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              For any inquiries, feel free to reach out to us at <span className='text-[#1CBBB4]'>sankalpasarkar68@gmail.com</span>
            </p>
          </div>
          
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-gray-800'>OUR VISION</h3>
            <p className='text-gray-600 leading-relaxed'>
              LexiCare envisions a world where dyslexia is never a barrier to success. We aim to create an inclusive learning environment by connecting individuals with the right mentors and resources, empowering them to overcome challenges and achieve their goals with confidence.
            </p>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className='mt-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-800'>
            WHY <span className='text-[#1CBBB4]'>CHOOSE US</span>
          </h2>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white border rounded-xl px-8 py-10 hover:bg-gradient-to-r hover:from-[#1CBBB4] hover:to-[#0D8B86] hover:text-white transition-all duration-300 group'>
            <h3 className='text-xl font-semibold text-gray-800 group-hover:text-white mb-4'>EXPERTISE</h3>
            <p className='text-gray-600 group-hover:text-white/90 leading-relaxed'>
              Access to certified dyslexia specialists and experienced educational mentors who understand your unique needs.
            </p>
          </div>
          
          <div className='bg-white border rounded-xl px-8 py-10 hover:bg-gradient-to-r hover:from-[#1CBBB4] hover:to-[#0D8B86] hover:text-white transition-all duration-300 group'>
            <h3 className='text-xl font-semibold text-gray-800 group-hover:text-white mb-4'>PERSONALIZED SUPPORT</h3>
            <p className='text-gray-600 group-hover:text-white/90 leading-relaxed'>
              Customized mentoring programs tailored to your specific learning style and goals.
            </p>
          </div>
          
          <div className='bg-white border rounded-xl px-8 py-10 hover:bg-gradient-to-r hover:from-[#1CBBB4] hover:to-[#0D8B86] hover:text-white transition-all duration-300 group'>
            <h3 className='text-xl font-semibold text-gray-800 group-hover:text-white mb-4'>FLEXIBILITY</h3>
            <p className='text-gray-600 group-hover:text-white/90 leading-relaxed'>
              Convenient online sessions and flexible scheduling to fit your lifestyle and learning pace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About