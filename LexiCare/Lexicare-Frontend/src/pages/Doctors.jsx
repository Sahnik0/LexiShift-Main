import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const Therapists = () => {
  const { speciality } = useParams();
  const [filterTherapists, setFilterTherapists] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors: therapists } = useContext(AppContext);

  const specialties = [
    'Speech Therapist',
    'Occupational Therapist',
    'Mental Health Counselor',
    'Child Psychologist',
    'Family Therapist',
    'Behavioral Therapist'
  ];

  useEffect(() => {
    if (therapists && therapists.length > 0) {
      if (speciality) {
        const filtered = therapists.filter(
          therapist => therapist.speciality === speciality
        );
        setFilterTherapists(filtered);
      } else {
        setFilterTherapists(therapists);
      }
    }
  }, [therapists, speciality]);

  const handleSpecialtyClick = (specialty) => {
    if (specialty === speciality) {
      navigate('/doctors');  // Changed from '/therapists' to '/doctors'
    } else {
      navigate(`/doctors/${specialty}`);  // Changed from '/therapists/' to '/doctors/'
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-gray-800'>
          FIND YOUR <span className='text-[#1CBBB4]'>SPECIALIST</span>
        </h2>
        <p className='mt-3 text-gray-600 max-w-xl mx-auto'>
          Connect with experienced therapists and consultants who can help you thrive
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="lg:w-1/4">
          <div className="sticky top-4">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden w-full mb-4 px-6 py-3 bg-gradient-to-r from-[#1CBBB4] to-[#0D8B86] text-white rounded-full font-medium hover:shadow-lg hover:shadow-teal-900/20 transition-all duration-300"
            >
              {showFilter ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className={`${showFilter ? 'block' : 'hidden lg:block'} bg-white rounded-xl shadow-sm border border-gray-200 p-6`}>
              <h3 className='text-xl font-semibold text-gray-800 mb-6'>SPECIALTIES</h3>
              <div className="flex flex-col gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => handleSpecialtyClick(specialty)}
                    className={`px-4 py-3 rounded-lg text-left transition-all ${
                      speciality === specialty
                        ? 'bg-[#E6F6F7] text-[#1CBBB4] font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Therapists Grid */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filterTherapists.map((therapist, index) => (
              <div
                key={index}
                onClick={() => { navigate(`/appointment/${therapist._id}`); scrollTo(0, 0); }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="relative aspect-w-4 aspect-h-3">
                  <img 
                    className="w-full h-full object-cover" 
                    src={therapist.image} 
                    alt={therapist.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className={`w-2.5 h-2.5 rounded-full ${
                        therapist.available ? 'bg-[#1CBBB4]' : 'bg-gray-400'
                      }`}
                    />
                    <span className={`text-sm font-medium ${
                      therapist.available ? 'text-[#1CBBB4]' : 'text-gray-500'
                    }`}>
                      {therapist.available ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{therapist.name}</h3>
                  <p className="text-gray-600">{therapist.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Therapists;