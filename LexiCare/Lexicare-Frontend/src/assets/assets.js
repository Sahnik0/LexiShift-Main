import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Mental_Health_Counselor from './icons8-mental-health-64.png'
import Behavioral_Therapist from './icons8-doctor-giving-advice-64.png'
import Speech_Therapist  from './icons8-speech-therapist-female-100.png'
import Occupational_Therapist from './icons8-physical-therapy-80.png'
import Family_Therapist from './icons8-defend-family-100.png'
import Child_Psychologist from './icons8-child-safe-zone-100.png'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'Speech Therapist',
        image: Speech_Therapist  // keeping existing image reference
    },
    {
        speciality: 'Occupational Therapist',
        image: Occupational_Therapist
    },
    {
        speciality: 'Mental Health Counselor',
        image: Mental_Health_Counselor
    },
    {
        speciality: 'Child Psychologist',
        image: Child_Psychologist
    },
    {
        speciality: 'Family Therapist',
        image: Family_Therapist
    },
    {
        speciality: 'Behavioral Therapist',
        image: Behavioral_Therapist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'Speech Therapist',
        degree: 'MS, CCC-SLP',
        experience: '4 Years',
        about: 'Dr. James specializes in speech and language disorders, focusing on helping patients overcome communication challenges. With expertise in both pediatric and adult speech therapy, he employs evidence-based techniques for optimal outcomes.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Occupational Therapist',
        degree: 'OTD',
        experience: '3 Years',
        about: 'Dr. Larson is dedicated to helping patients improve their daily living skills and independence. She specializes in pediatric occupational therapy and sensory integration techniques.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Mental Health Counselor',
        degree: 'Ph.D, LPC',
        experience: '1 Years',
        about: 'Dr. Patel provides compassionate mental health counseling, specializing in anxiety, depression, and stress management. She utilizes a combination of cognitive behavioral therapy and mindfulness techniques.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Child Psychologist',
        degree: 'Psy.D',
        experience: '2 Years',
        about: 'Dr. Lee specializes in child psychology, focusing on developmental disorders, behavioral issues, and family dynamics. He uses play therapy and evidence-based interventions to support childrens emotional well-being.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Family Therapist',
        degree: 'LMFT',
        experience: '4 Years',
        about: 'Dr. Garcia specializes in family therapy, helping families improve communication and resolve conflicts. She uses systemic approaches to strengthen family relationships and promote healthy dynamics.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Behavioral Therapist',
        degree: 'Ph.D, BCBA',
        experience: '4 Years',
        about: 'Dr. Williams is an expert in behavioral therapy, specializing in applied behavior analysis. He works with children and adults to address challenging behaviors and develop positive behavioral strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'Speech Therapist',
        degree: 'MS, CCC-SLP',
        experience: '4 Years',
        about: 'Dr. Davis specializes in speech and language disorders, with particular expertise in early intervention and developmental speech delays. He employs innovative therapy techniques to enhance communication skills.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Occupational Therapist',
        degree: 'OTD',
        experience: '3 Years',
        about: 'Dr. White focuses on helping patients regain independence through occupational therapy. He specializes in rehabilitation and adaptive equipment training for both adults and children.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Mental Health Counselor',
        degree: 'Ph.D, LPC',
        experience: '1 Years',
        about: 'Dr. Mitchell specializes in trauma-informed counseling and EMDR therapy. She helps clients process trauma and develop resilience through evidence-based therapeutic approaches.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Child Psychologist',
        degree: 'Psy.D',
        experience: '2 Years',
        about: 'Dr. King specializes in child psychology with a focus on anxiety disorders and ADHD. He uses a combination of cognitive behavioral therapy and family-based interventions.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Family Therapist',
        degree: 'LMFT',
        experience: '4 Years',
        about: 'Dr. Kelly specializes in family therapy and couples counseling. She helps families navigate transitions, improve communication, and strengthen relationships through systemic therapy approaches.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Behavioral Therapist',
        degree: 'Ph.D, BCBA',
        experience: '4 Years',
        about: 'Dr. Harris specializes in behavioral therapy for autism spectrum disorders. He develops comprehensive behavior intervention plans and provides parent training to support long-term success.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'Speech Therapist',
        degree: 'MS, CCC-SLP',
        experience: '4 Years',
        about: 'Dr. Evans specializes in adult speech therapy, focusing on stroke recovery and voice disorders. She employs cutting-edge techniques and technology to optimize communication outcomes.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Occupational Therapist',
        degree: 'OTD',
        experience: '3 Years',
        about: 'Dr. Martinez specializes in pediatric occupational therapy, focusing on sensory processing disorders and developmental delays. He creates individualized treatment plans to enhance daily living skills.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Mental Health Counselor',
        degree: 'Ph.D, LPC',
        experience: '1 Years',
        about: 'Dr. Hill specializes in anxiety and depression treatment, utilizing a holistic approach that combines cognitive behavioral therapy with mindfulness and stress reduction techniques.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]