import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className="container mx-auto px-6 py-16">
            <div className='text-center mb-12'>
                <h2 className='text-3xl font-bold text-gray-800'>
                    MY <span className='text-[#1CBBB4]'>APPOINTMENTS</span>
                </h2>
            </div>

            <div className='max-w-5xl mx-auto space-y-6'>
                {appointments.map((item, index) => (
                    <div key={index} className='bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden'>
                        <div className='flex flex-col sm:flex-row p-6 gap-6'>
                            {/* Doctor Image */}
                            <div className='w-full sm:w-48 flex-shrink-0'>
                                <img 
                                    className='w-full h-48 sm:h-40 object-cover rounded-lg bg-[#EAEFFF]' 
                                    src={item.docData.image} 
                                    alt={item.docData.name} 
                                />
                            </div>

                            {/* Appointment Details */}
                            <div className='flex-1 space-y-4'>
                                <div>
                                    <h3 className='text-xl font-semibold text-gray-800'>{item.docData.name}</h3>
                                    <p className='text-[#1CBBB4] font-medium'>{item.docData.speciality}</p>
                                </div>

                                <div className='space-y-2'>
                                    <h4 className='font-medium text-gray-700'>Address</h4>
                                    <p className='text-gray-600'>{item.docData.address.line1}</p>
                                    <p className='text-gray-600'>{item.docData.address.line2}</p>
                                </div>

                                <div className='flex items-center gap-2 text-gray-600'>
                                    <span className='font-medium'>Date & Time:</span>
                                    <span>{slotDateFormat(item.slotDate)} | {item.slotTime}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex flex-col gap-3 sm:w-48'>
                                {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                    <button 
                                        onClick={() => setPayment(item._id)}
                                        className='w-full py-2.5 rounded-full bg-gradient-to-r from-[#1CBBB4] to-[#0D8B86] text-white hover:opacity-90 transition-all'
                                    >
                                        Pay Online
                                    </button>
                                )}

                                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                    <>
                                        <button 
                                            onClick={() => appointmentStripe(item._id)}
                                            className='w-full py-2.5 px-4 rounded-full border border-[#1CBBB4] hover:bg-gray-50 transition-all flex items-center justify-center'
                                        >
                                            <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="Stripe" />
                                        </button>
                                        <button 
                                            onClick={() => appointmentRazorpay(item._id)}
                                            className='w-full py-2.5 px-4 rounded-full border border-[#1CBBB4] hover:bg-gray-50 transition-all flex items-center justify-center'
                                        >
                                            <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="Razorpay" />
                                        </button>
                                    </>
                                )}

                                {!item.cancelled && item.payment && !item.isCompleted && (
                                    <div className='w-full py-2.5 rounded-full bg-[#E5F7F6] text-[#1CBBB4] font-medium text-center'>
                                        Paid
                                    </div>
                                )}

                                {item.isCompleted && (
                                    <div className='w-full py-2.5 rounded-full bg-green-50 text-green-500 font-medium text-center'>
                                        Completed
                                    </div>
                                )}

                                {!item.cancelled && !item.isCompleted && (
                                    <button 
                                        onClick={() => cancelAppointment(item._id)}
                                        className='w-full py-2.5 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition-all'
                                    >
                                        Cancel Appointment
                                    </button>
                                )}

                                {item.cancelled && !item.isCompleted && (
                                    <div className='w-full py-2.5 rounded-full bg-red-50 text-red-500 font-medium text-center'>
                                        Appointment Cancelled
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments