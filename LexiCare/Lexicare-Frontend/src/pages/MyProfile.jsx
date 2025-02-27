import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className="container mx-auto px-6 py-16">
            <div className='text-center mb-12'>
                <h2 className='text-3xl font-bold text-gray-800'>
                    MY <span className='text-[#1CBBB4]'>PROFILE</span>
                </h2>
            </div>

            <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8'>
                <div className='flex flex-col md:flex-row gap-12'>
                    {/* Left: Profile Image */}
                    <div className='w-full md:w-1/3 flex flex-col items-center'>
                        {isEdit ? (
                            <label htmlFor='image' className='cursor-pointer'>
                                <div className='relative inline-block'>
                                    <img 
                                        className='w-48 h-48 rounded-full object-cover border-4 border-[#1CBBB4]' 
                                        src={image ? URL.createObjectURL(image) : userData.image} 
                                        alt="" 
                                    />
                                    <div className='absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center'>
                                        <img className='w-12' src={assets.upload_icon} alt="" />
                                    </div>
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        ) : (
                            <img 
                                className='w-48 h-48 rounded-full object-cover border-4 border-[#1CBBB4]' 
                                src={userData.image} 
                                alt="" 
                            />
                        )}
                        {isEdit ? (
                            <input 
                                className='mt-4 text-2xl font-bold text-center bg-transparent border-b-2 border-[#1CBBB4] focus:outline-none' 
                                type="text" 
                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                                value={userData.name} 
                            />
                        ) : (
                            <h3 className='mt-4 text-2xl font-bold text-gray-800'>{userData.name}</h3>
                        )}
                    </div>

                    {/* Right: Profile Information */}
                    <div className='w-full md:w-2/3'>
                        <div className='space-y-8'>
                            {/* Contact Information */}
                            <div className='bg-white rounded-xl p-6 border hover:border-[#1CBBB4] transition-all duration-300'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-4'>Contact Information</h3>
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-[120px_1fr] gap-4'>
                                        <span className='text-gray-600'>Email:</span>
                                        <span className='text-[#1CBBB4]'>{userData.email}</span>
                                    </div>
                                    <div className='grid grid-cols-[120px_1fr] gap-4'>
                                        <span className='text-gray-600'>Phone:</span>
                                        {isEdit ? (
                                            <input 
                                                className='bg-gray-50 rounded px-2 py-1 focus:outline-none focus:border-[#1CBBB4] border'
                                                type="text" 
                                                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                                                value={userData.phone} 
                                            />
                                        ) : (
                                            <span className='text-[#1CBBB4]'>{userData.phone}</span>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-[120px_1fr] gap-4'>
                                        <span className='text-gray-600'>Address:</span>
                                        {isEdit ? (
                                            <div className='space-y-2'>
                                                <input 
                                                    className='w-full bg-gray-50 rounded px-2 py-1 focus:outline-none focus:border-[#1CBBB4] border'
                                                    type="text" 
                                                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                                    value={userData.address.line1} 
                                                    placeholder="Address Line 1"
                                                />
                                                <input 
                                                    className='w-full bg-gray-50 rounded px-2 py-1 focus:outline-none focus:border-[#1CBBB4] border'
                                                    type="text" 
                                                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                                    value={userData.address.line2} 
                                                    placeholder="Address Line 2"
                                                />
                                            </div>
                                        ) : (
                                            <span className='text-gray-600'>
                                                {userData.address.line1}<br/>{userData.address.line2}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className='bg-white rounded-xl p-6 border hover:border-[#1CBBB4] transition-all duration-300'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-4'>Basic Information</h3>
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-[120px_1fr] gap-4'>
                                        <span className='text-gray-600'>Gender:</span>
                                        {isEdit ? (
                                            <select 
                                                className='bg-gray-50 rounded px-2 py-1 focus:outline-none focus:border-[#1CBBB4] border'
                                                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                                                value={userData.gender}
                                            >
                                                <option value="Not Selected">Not Selected</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        ) : (
                                            <span className='text-gray-600'>{userData.gender}</span>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-[120px_1fr] gap-4'>
                                        <span className='text-gray-600'>Birthday:</span>
                                        {isEdit ? (
                                            <input 
                                                className='bg-gray-50 rounded px-2 py-1 focus:outline-none focus:border-[#1CBBB4] border'
                                                type='date' 
                                                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                                                value={userData.dob} 
                                            />
                                        ) : (
                                            <span className='text-gray-600'>{userData.dob}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className='mt-8 flex justify-end'>
                            {isEdit ? (
                                <button 
                                    onClick={updateUserProfileData} 
                                    className='px-8 py-3 bg-gradient-to-r from-[#1CBBB4] to-[#0D8B86] text-white rounded-full hover:opacity-90 transition-all'
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setIsEdit(true)} 
                                    className='px-8 py-3 bg-gradient-to-r from-[#1CBBB4] to-[#0D8B86] text-white rounded-full hover:opacity-90 transition-all'
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile