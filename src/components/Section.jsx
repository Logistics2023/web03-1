'use client'
import { useUser } from '@/context/Context'
import { onAuth, signInWithEmail, writeUserData, removeData } from '@/firebase/utils'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Subtitle from '@/components/Subtitle'
import MiniTarjeta from '@/components/MiniTarjeta'
import { glosario } from '@/db'
import Footer from '@/components/Footer'
import TextMaquina from '@/components/TextMaquina'
import { useRouter } from 'next/navigation';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.compat.css"
import 'react-awesome-slider/dist/styles.css';
import InputEspecial from '@/components/InputEspecial'
import QRscanner from '@/components/QRscanner'
import { QRreaderUtils } from '@/utils/QRreader'
import InputFlotante from '@/components/InputFlotante'
import { generateUUID } from '@/utils/UIDgenerator'
import SelectSimple from '@/components/SelectSimple'
import priceFTL from '@/db/FTL.json'
import mercancias from '@/db/mercancias.json'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import dynamic from 'next/dynamic'
import { equipoDB, mercanciaDB, tipoDeUnidadDB } from '@/db/arrDB'

const InvoicePDF = dynamic(() => import("@/components/CotizacionPDF"), {
  ssr: false,
});


function Componente({ title, image, paragraph, id, route }) {

    const router = useRouter()
  
    return <div className='relative w-full min-h-full md:w-auto bg-[#ffffffcb] my-5 flex  lg:max-w-[500px] lg:min-w-[250px]  lg:text-[18px] lg:mx-5 lg:flex lg:flex-col lg:justify-between lg:items-center rounded-[15px] '>
      <img src={image} className="relative w-[150px] md:min-h-[40%] lg:max-w-[200px] object-contain p-5" alt="" />
      <div className="relative w-full bg-gradient-to-t md:min-h-[45%] from-[#00195cbe] via-[#00195cbe] to-[#00195c] space-y-5 p-5 py-5 rounded-r-[15px] lg:rounded-t-[0]  lg:rounded-b-[15px]">
        <h4 className="w-full text-left font-medium border-b-[3px] text-white pb-5 pl-0 ml-0 border-[#ffffff] p-5">{title}</h4>
        <p className="relative text-white " dangerouslySetInnerHTML={{ __html: paragraph }} >
        </p>
        <div className=" relative flex mt-5 mb-10 justify-end w-[100%]">
          <button className="block bg-[#ffb834] px-3 text-[12px] border text-center font-medium py-2 m-1  
         cursor-pointer rounded-[5px]"  onClick={() => router.push(`/Contenedores/Detalles?query=${id}&item=${route}`)}>Saber mas</button>
        </div>
      </div>
    </div>
  }

  function Componente2({ title, image, paragraph, id, route }) {

    const router = useRouter()
  
    return <div className='relative w-full min-h-full md:w-auto bg-[#ffffffcb] my-5 flex  lg:max-w-[500px] lg:min-w-[250px]  lg:text-[18px] lg:mx-5 lg:flex lg:flex-col lg:justify-between lg:items-center rounded-[15px] '>
      <img src={image} className="relative w-[150px] md:min-h-[40%] lg:max-w-[200px] object-contain p-5" alt="" />
      <div className="relative w-full bg-gradient-to-t md:min-h-[45%] from-[#00195cbe] via-[#00195cbe] to-[#00195c] space-y-5 p-5 py-5 rounded-r-[15px] lg:rounded-t-[0]  lg:rounded-b-[15px]">
        <h4 className="w-full text-left font-medium border-b-[3px] text-white pb-5 pl-0 ml-0 border-[#ffffff] p-5">{title}</h4>
        <p className="relative text-white " dangerouslySetInnerHTML={{ __html: paragraph }} >
        </p>
        <div className=" relative flex mt-5 mb-10 justify-end w-[100%]">
          <button className="block bg-[#ffb834] px-3 text-[12px] border text-center font-medium py-2 m-1  
         cursor-pointer rounded-[5px]"  onClick={() => router.push(`/Galeria?query=${id}&item=${route}`)}>Saber mas</button>
        </div>
      </div>
    </div>
  }

export default function Section({ subtitle, description, video, gradiente, id, children, tarjetas, miniTarjetas }) {

    const { user, introVideo, userDB, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, nav, cliente, setCliente, focus, setFocus } = useUser()
  
    const redirectHandlerWindow = (ref) => {
      window.open(ref, '_blank')
    }
  
    return <section className='relative w-full  bg-gradient-to-tr from-[#00195c] via-[#274492] to-[#00195c] overflow-x-hidden overflow-hidden' id={id}>
      {/* <div className='relative px-5 py-12 w-full min-h-[50vh] flex flex-col z-30 lg:grid lg:grid-cols-2 justify-around items-center  from-[#00195cdc] via-[#00195cb6] to-[#00195cdc] '> */}
  
      <div className='relative px-5 py-12 w-full lg:px-[100px]  z-30    from-[#00195cdc] via-[#00195cb6] to-[#00195cdc] '>
        <div>
          <Subtitle><h3 className='text-[30px] text-[white] text-center font-medium  py-10'>{subtitle}</h3></Subtitle>
          <ScrollAnimation animateIn='bounceInLeft'
            animateOut='bounceOutLeft'
            initiallyVisible={true}
          >
            <p className=' text-[16px] text-[white] pb-5  ql-editor' dangerouslySetInnerHTML={{ __html: description }}>
            </p>
          </ScrollAnimation>
        </div>
  
        {/* ---------------------------------------------Mini Tarjetas---------------------------------------- */}
  
        <div className={`relative w-full h-full text-[white] gap-5 py-12 ${cliente && cliente[id] && cliente[id].miniTarjetas && Object.values(cliente[id].miniTarjetas).length > 4 ? 'grid grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-2'}`}>
          {cliente && cliente[id] && cliente[id].miniTarjetas && Object.values(cliente[id].miniTarjetas).map((i, index) => <MiniTarjeta e1={i[`ip`]} e2={i[`ic`]} />)}
        </div>
        <div className='flex w-full justify-start '>
          <button type="button" className="w-full border-[2px] md:max-w-[300px] text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center inline-flex items-center " onClick={() => redirectHandlerWindow(`https://api.whatsapp.com/send?phone=${cliente.contactos.celular.replaceAll(' ', '')}&text=hola%20Logistics%20Gear,%20quiero%20ordenar%20un%20servicio%20${subtitle}%20`)}>
            Solicitar Cotización
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </button>
        </div>
      </div>
  
      {/* ---------------------------------------------Tarjetas---------------------------------------- */}
      <div className='relative min-h-screen  w-full flex flex-col justify-top lg:flex-wrap  lg:flex-row lg:justify-center lg:items-center  z-20  '>
  
        <video className='absolute bottom-0  w-full h-full min-h-[100vh] object-cover z-10' autoPlay loop muted playsInline>
          <source src={video} type="video/mp4" />
        </video>
        <div className='absolute top-0 w-full min-h-[100vh] h-full object-cover z-20 bg-gradient-to-tr from-[#00195c]  via-[#cfbd7546] to-[#00195c]    lg:bg-gradient-to-tr lg:from-[#00195cd7]  lg:via-[#cfbd7546] lg:to-[#00195c] '></div>
  
        <div className={`relative flex flex-wrap py-10 ${tarjetas && Object.entries(tarjetas).length > 2 ? 'md:grid md:grid-cols-3' : 'md:grid md:grid-cols-2'}`}>
          {cliente && cliente[id] && cliente[id].tarjetas && Object.entries(tarjetas).map((i, index) => {
            return <div className=' w-full  md:w-auto p-5 z-50' key={index}>
              {id !== 'experiencia' && <Componente route={i[0]} id={id} db={i[1]} title={i[1].title} image={i[1].url} paragraph={i[1].paragraph} />}
              {id === 'experiencia' && <Componente2 route={i[0]} id={id} db={i[1]} title={i[1].title} image={i[1].url} paragraph={i[1].paragraph} />}
            </div>
          })}
        </div>
      </div>
    </section>
  
  }