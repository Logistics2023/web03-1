'use client'
import { useUser } from '@/context/Context'
import { onAuth, signInWithEmail, writeUserData, removeData } from '@/firebase/utils'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Subtitle from '@/components/Subtitle'
import Error from '@/components/Error'
import Section from '@/components/Section'
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
import MiniTarjeta from '@/components/MiniTarjeta'
import mercancias from '@/db/mercancias.json'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import dynamic from 'next/dynamic'
import { equipoDB, mercanciaDB, tipoDeUnidadDB } from '@/db/arrDB'

const InvoicePDF = dynamic(() => import("@/components/CotizacionPDF"), {
  ssr: false,
});

export default function Home() {
  const { user, introVideo, userDB, setUserProfile, modal, setModal, setUserSuccess, calcValueFCL, setCalcValueFCL, calcValue, setCalcValue, element, setElement, naviera, setNaviera, success, setUserData, postsIMG, setUserPostsIMG, nav, cliente, setCliente, focus, setFocus, seeMore, setSeeMore } = useUser()


  const [selectValue, setSelectValue] = useState({})
  const [code, setCode] = useState('')



  const router = useRouter()
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  const inputRef = useRef('')
  const inputRef2 = useRef('')


  const redirectHandlerWindow = (ref) => {
    window.open(ref, '_blank')
  }


  function handlerClickSelect2(e) {
    setSelectValue({ ...selectValue, SERVICIO: e })

  }
  function handlerOnChangeQR(e) {
    QRreaderUtils(e, setCode)

  }
  // let data = priceFTL.reduce((acc, i, index) => {
  //   return acc.includes(i.ORIGEN) ? acc : [...acc, i.ORIGEN]
  // }, [])

  async function HandlerCheckOut(e) {

    //  const data =  Object.entries(calcValue).map((i, index) => `${i[0]}: ${i[1]}`)
    router.push('PDF')
    return

    const db = Object.entries(calcValue).reverse().reduce((acc, i, index) => {
      const data = `${i[0]}: ${i[1]}\n`
      return data + '\r\n' + acc
    }, ``)

    var whatsappMessage = "SOLICITUD DE SERVICIO" + "\r\n\r\n" + db
    whatsappMessage = window.encodeURIComponent(whatsappMessage)
    console.log(whatsappMessage)
    // window.open(`https://api.whatsapp.com/send?phone=${perfil.whatsapp.replaceAll(' ', '')}&text=${whatsappMessage}`, '_blank')
    window.open(`https://api.whatsapp.com/send?phone=+59169941749&text=${whatsappMessage}`, '_blank')

  }
  async function HandlerCheckOut2(e) {
    const db = Object.entries({ ORIGEN: inputRef.current.value, DESTINO: inputRef2.current.value, ...selectValue }).reverse().reduce((acc, i, index) => {
      const data = `${i[0]}: ${i[1]}\n`
      return data + '\r\n' + acc
    }, ``)

    var whatsappMessage = "SOLICITUD DE SERVICIO" + "\r\n\r\n" + db
    whatsappMessage = window.encodeURIComponent(whatsappMessage)
    console.log(whatsappMessage)
    // window.open(`https://api.whatsapp.com/send?phone=${perfil.whatsapp.replaceAll(' ', '')}&text=${whatsappMessage}`, '_blank')
    window.open(`https://api.whatsapp.com/send?phone=+59169941749&text=${whatsappMessage}`, '_blank')

  }

  function handlerOnChange(e) {
    e.stopPropagation();
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value })

  }

  function reset() {
    setFocus('')
  }

  function handlerSelect(i) {
    inputRef.current.value = i
    inputRef2.current.value = ''

    setFocus('')
  }
  function handlerSelect2(i) {
    inputRef2.current.value = i
    setFocus('')
  }


  function handlerClickSelect(name, i, uuid) {
    let db = { [name]: i }
    setSelectValue({ ...selectValue, ...db })
  }


  function write() {
    writeUserData('Cliente/comisionFTL', {
      [generateUUID()]: {
        de: 1,
        hasta: 1000,
        monto: 20,
      },
      [generateUUID()]: {
        de: 1001,
        hasta: 10000,
        monto: '2%,'
      },
      [generateUUID()]: {
        de: 10001,
        hasta: 20000,
        monto: '1.50%',
      },
      [generateUUID()]: {
        de: 20001,
        hasta: 30000,
        monto: '1.25%',
      },
      [generateUUID()]: {
        de: 30001,
        hasta: 50000,
        monto: '1%',
      },
      [generateUUID()]: {
        de: 50001,
        hasta: 100000,
        monto: '0.75%',
      },
      [generateUUID()]: {
        de: 100001,
        hasta: 1000000000000,
        monto: '0.50%',
      },
    }
    )
  }
  function calculator(e) {
    e.preventDefault()
    if (user === null || user === undefined) {
      router.push('/Login')
      return
    }

    let val = Object.values(cliente.priceFTL).find((i) => {
      return i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value && i.MERCANCIA === selectValue.MERCANCIA && i['PESO (KG)'] >= selectValue['PESO (KG)'] && i.SERVICIO === selectValue.SERVICIO && i['TIPO DE UNIDAD'] === selectValue['TIPO DE UNIDAD'] && i['VOLUMEN M3'] >= selectValue['VOLUMEN M3']
    })
    val !== undefined ? setCalcValue({ ...val, ['PESO (KG)']: selectValue['PESO (KG)'], ['VOLUMEN M3']: selectValue['VOLUMEN M3'], TOTAL: val['SERVICIOS LOGISTICOS USD'] * 1 + val['FLETE USD'] * 1 }) : setUserSuccess('NO DATA')
  }
  function calculatorFCL(e) {
    e.preventDefault()
    if (user === null || user === undefined) {
      router.push('/Login')
      return
    }

    let val = Object.values(cliente.priceFCL).filter((i) => {
      return i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value
    })
    val !== undefined ? setCalcValueFCL(val) : setUserSuccess('NO DATA')
  }
  function handlerSeeMore(key) {
    seeMore === key ? setSeeMore('') : setSeeMore(key)
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  function onChangeHandler(e) {
    setCode(e.target.value)

  }
  function filterTracking(e) {
    e.preventDefault()

    if (userDB) {
      router.push(`/Tracking?item=${code}`)
    } else {
      setModal('REGISTRATE')
    }
  }
  function handlerElement(data) {
    if (userDB) {
      setElement(data)
    } else {
      setModal('REGISTRATE')
    }
  }
  // console.log(inputRef.current.value)
  // console.log(inputRef2.current.value)
  // console.log(selectValue)

  function preValidate() {
    if (inputRef.current && inputRef2.current && selectValue.MERCANCIA && selectValue['PESO (KG)'] && selectValue.SERVICIO && selectValue['TIPO DE UNIDAD'] && selectValue['VOLUMEN M3']) {
      let val = Object.values(cliente.priceFTL).find((i) => {
        return i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value && i.MERCANCIA === selectValue.MERCANCIA && i['PESO (KG)'] >= selectValue['PESO (KG)'] && i.SERVICIO === selectValue.SERVICIO && i['TIPO DE UNIDAD'] === selectValue['TIPO DE UNIDAD'] && i['VOLUMEN M3'] >= selectValue['VOLUMEN M3']
      })
      return val
    }
  }
  return (
    <main className={`relative  w-screen `} onClick={reset} id='inicio'>
      <section className='relative '>
        <video className='fixed bottom-0 w-full h-[100vh] pb-[10px] object-cover object-bottom ' autoPlay loop muted playsInline>
          <source src={cliente.inicio.url} type="video/mp4" />
        </video>
        <div className='absolute top-0  w-full min-h-[100vh] h-full object-cover z-10 bg-gradient-to-tr from-[#00195c]  via-[#cfbd7546] to-[#00195c72]    lg:bg-gradient-to-tr lg:from-[#00195cd7]  lg:via-[#cfbd7546] lg:to-[#00195c] '></div>
        <div className='relative min-h-[100vh] h-auto   w-full lg:pt-[70px] pb-0 flex flex-col justify-around lg:flex-row items-center  z-20' style={{ background: '-gradient(to bottom, #000000,  #000000c7, #00000050' }}>
          <img src='/logo-comp.gif' className=' relative  inline-block w-[80vw] h-[80vw]    lg:w-[30vw] lg:h-[60vh]  object-cover object-center ' />
          <div className='relative  w-full lg:w-[40%] lg:bg-[#111a33d0] p-5 '>
            <div className='   font-bold'>
              <TextMaquina />
            </div>
            <br />
            <div className='grid grid-cols-2 gap-2 w-full '>
              {/* <button onClick={write}>Click</button> */}
              <button type="button" onClick={() => router.push('/Glosario')} className="w-full border-[2px]   text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center inline-flex items-center ">
                Glosarios
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </button>
              <button type="button" onClick={() => redirectHandlerWindow(`https://api.whatsapp.com/send?phone=${cliente.contactos.celular.replaceAll(' ', '')}&text=hola%20Logistics%20Gear`)} className="w-full border-[2px]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center inline-flex items-center ">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.0508 2.91006C16.134 1.98399 15.042 1.24973 13.8384 0.750111C12.6349 0.250494 11.3439 -0.00448012 10.0408 5.95696e-05C4.58078 5.95696e-05 0.130781 4.45006 0.130781 9.91006C0.130781 11.6601 0.590781 13.3601 1.45078 14.8601L0.0507812 20.0001L5.30078 18.6201C6.75078 19.4101 8.38078 19.8301 10.0408 19.8301C15.5008 19.8301 19.9508 15.3801 19.9508 9.92006C19.9508 7.27006 18.9208 4.78006 17.0508 2.91006ZM10.0408 18.1501C8.56078 18.1501 7.11078 17.7501 5.84078 17.0001L5.54078 16.8201L2.42078 17.6401L3.25078 14.6001L3.05078 14.2901C2.22853 12.977 1.79192 11.4593 1.79078 9.91006C1.79078 5.37006 5.49078 1.67006 10.0308 1.67006C12.2308 1.67006 14.3008 2.53006 15.8508 4.09006C16.6183 4.85402 17.2265 5.76272 17.6402 6.76348C18.0539 7.76425 18.2648 8.83717 18.2608 9.92006C18.2808 14.4601 14.5808 18.1501 10.0408 18.1501ZM14.5608 11.9901C14.3108 11.8701 13.0908 11.2701 12.8708 11.1801C12.6408 11.1001 12.4808 11.0601 12.3108 11.3001C12.1408 11.5501 11.6708 12.1101 11.5308 12.2701C11.3908 12.4401 11.2408 12.4601 10.9908 12.3301C10.7408 12.2101 9.94078 11.9401 9.00078 11.1001C8.26078 10.4401 7.77078 9.63006 7.62078 9.38006C7.48078 9.13006 7.60078 9.00006 7.73078 8.87006C7.84078 8.76006 7.98078 8.58006 8.10078 8.44006C8.22078 8.30006 8.27078 8.19006 8.35078 8.03006C8.43078 7.86006 8.39078 7.72006 8.33078 7.60006C8.27078 7.48006 7.77078 6.26006 7.57078 5.76006C7.37078 5.28006 7.16078 5.34006 7.01078 5.33006H6.53078C6.36078 5.33006 6.10078 5.39006 5.87078 5.64006C5.65078 5.89006 5.01078 6.49006 5.01078 7.71006C5.01078 8.93006 5.90078 10.1101 6.02078 10.2701C6.14078 10.4401 7.77078 12.9401 10.2508 14.0101C10.8408 14.2701 11.3008 14.4201 11.6608 14.5301C12.2508 14.7201 12.7908 14.6901 13.2208 14.6301C13.7008 14.5601 14.6908 14.0301 14.8908 13.4501C15.1008 12.8701 15.1008 12.3801 15.0308 12.2701C14.9608 12.1601 14.8108 12.1101 14.5608 11.9901Z" fill="white" />
                </svg>
                <span className='pl-5'> Contactar</span>
              </button>
            </div>
            <br />
            <div className='relative bg-[#ffffff] p-5 z-30'>
              {calcValue === 'NO DATA' && calcValueFCL === 'NO DATA'
                ? <ul className="flex border-b border-[blue] ">
                  <li className={`-mb-px mr-1 ${element === 'TRACKING' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => handlerElement('TRACKING')}>
                    <a className=" inline-block rounded-t py-2 px-2 text-blue-700 font-semibold" href="#">Tracking</a>
                  </li>
                  <li className={`-mb-px mr-1 ${element === 'FCL' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => { setSelectValue({}), handlerElement('FCL') }}>
                    <a className=" inline-block rounded-t py-2 px-2 text-blue-500 font-semibold" href="#">Cotizador FCL</a>
                  </li>
                  <li className={`-mb-px mr-1 ${element === 'FTL' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => { setSelectValue({}), handlerElement('FTL') }}>
                    <a className=" inline-block rounded-t py-2 px-2 text-blue-500  font-semibold" href="#">Cotizador FTL</a>
                  </li>
                </ul>
                : <div className='w-full text-center bg-blue-700 text-white p-2'>  COTIZACIÓN {element}  </div>
              }
              {element === 'TRACKING' && <form className="max-w-md w-full flex  mx-auto pt-5">
                <div className="flex w-full ">
                  <label htmlFor="location-search" className="mb-2 text-[12px] font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                  <div className="relative w-full">
                    <input type="search" id="location-search" className="block p-3 w-full h-full z-20 text-[12px] text-gray-900 border shadow-xl  rounded-[5px] focus:ring-blue-500 focus:border-blue-500" onChange={onChangeHandler} placeholder="Codigo de tracking" required />
                    <button type="button" onClick={filterTracking} className="absolute top-0 end-0 h-full p-2.5 text-[12px] font-medium text-white bg-blue-700 rounded-r-[5px] border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>}

              {element === 'FCL' && calcValue === 'NO DATA' && calcValueFCL === 'NO DATA' &&
                <form className="space-y-5 lg:space-y-0 py-5 lg:grid lg:grid-cols-2 lg:gap-5" onSubmit={calculatorFCL}>
                  <InputEspecial type='text' data={Object.values(cliente.priceFCL)} node={'Origen'} focusTxt='ORIGEN-FTL' id='floating_1' inputRef={inputRef} select={handlerSelect}></InputEspecial>
                  <InputEspecial type='text' data={inputRef.current ? Object.values(cliente.priceFCL).filter((i) => i.ORIGEN === inputRef.current.value) : Object.values(cliente.priceFTL)} node={'Destino'} focusTxt='DESTINO-FTL' id='floating_2' inputRef={inputRef2} select={handlerSelect2} style={{ textTransform: 'uppercase' }}></InputEspecial>
                  <SelectSimple arr={inputRef.current && Object.values(cliente.priceFCL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i.EQUIPO).filter(onlyUnique).length > 0 ? Object.values(cliente.priceFCL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i.EQUIPO).filter(onlyUnique) : equipoDB} name='EQUIPO' click={handlerClickSelect} defaultValue={selectValue['EQUIPO'] ? selectValue['EQUIPO'] : 'Seleccionar'} uuid='8768798' label='Equipo' required={true}></SelectSimple>
                  {inputRef.current && Object.values(cliente.priceFCL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i.EQUIPO).filter(onlyUnique) && Object.values(cliente.priceFCL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i.EQUIPO).filter(onlyUnique).length > 0
                    ? <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] w-full  px-5 py-2.5 text-center  mt-7 lg:col-span-2"  >Cotizar</button>
                    : <button type="button" className=" focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] w-full  px-5 py-2.5 text-center  mt-7 lg:col-span-2          text-white bg-green-500    " onClick={HandlerCheckOut2}> Solicitar Cotizacion</button>
                  }
                </form>}
              {element === 'FTL' && calcValue === 'NO DATA' && calcValueFCL === 'NO DATA' &&
                <form className="space-y-5 lg:space-y-0  py-5 lg:grid lg:grid-cols-2 lg:gap-5" onSubmit={calculator}>
                  <InputEspecial type='text' data={Object.values(cliente.priceFTL)} node={'Origen'} focusTxt='ORIGEN-FTL' id='floating_1' inputRef={inputRef} select={handlerSelect}></InputEspecial>
                  <InputEspecial type='text' data={inputRef.current ? Object.values(cliente.priceFTL).filter((i) => i.ORIGEN === inputRef.current.value) : Object.values(cliente.priceFTL)} node={'Destino'} focusTxt='DESTINO-FTL' id='floating_2' inputRef={inputRef2} select={handlerSelect2} style={{ textTransform: 'uppercase' }}></InputEspecial>
                  <InputFlotante type="number" name={'PESO (KG)'} id="floating_4" onChange={handlerOnChange} defaultValue={selectValue['PESO (KG)']} required label={'Peso (KG)'} />
                  <InputFlotante type="number" name={'VOLUMEN M3'} id="floating_5" onChange={handlerOnChange} defaultValue={selectValue['VOLUMEN']} required label={'Volumen M3'} />
                  <SelectSimple arr={inputRef.current && Object.values(cliente.priceFTL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i['TIPO DE UNIDAD']).filter(onlyUnique).length > 0 ? Object.values(cliente.priceFTL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i['TIPO DE UNIDAD']).filter(onlyUnique) : tipoDeUnidadDB} name='TIPO DE UNIDAD' click={handlerClickSelect} defaultValue={selectValue['TIPO DE UNIDAD'] ? selectValue['TIPO DE UNIDAD'] : 'Seleccionar'} uuid='8768798' label='Tipo de unidad' required={true}></SelectSimple>
                  <SelectSimple arr={inputRef.current && Object.values(cliente.priceFTL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i.MERCANCIA).filter(onlyUnique).length > 0 ? Object.values(cliente.priceFTL).filter((i) => i.ORIGEN === inputRef.current.value && i.DESTINO === inputRef2.current.value).map((i) => i.MERCANCIA).filter(onlyUnique) : mercanciaDB} name='MERCANCIA' click={handlerClickSelect} defaultValue={selectValue['MERCANCIA'] ? selectValue['MERCANCIA'] : 'Seleccionar'} uuid='8768798' label='Mercancia' required={true}></SelectSimple>
                  <div className='flex  justify-around col-span-2'>
                    <div class="flex items-center ">
                      <input id="checkbox_1" type="checkbox" checked={selectValue['SERVICIO'] === 'SIN DEVOLUCION'} value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-100 focus:ring-1 " onClick={() => handlerClickSelect2('SIN DEVOLUCION')} />
                      <label for="checkbox_1" class="ms-2 text-sm font-medium text-gray-900 ">Sin devolucion</label>
                    </div>
                    {selectValue['MERCANCIA'] && selectValue['MERCANCIA'].toLowerCase().includes('contenedor') && <div class="flex items-center">
                      <input id="checkbox_2" type="checkbox" checked={selectValue['SERVICIO'] === 'CON DEVOLUCION'} value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-100 focus:ring-1 " onClick={() => handlerClickSelect2('CON DEVOLUCION')} />
                      <label for="checkbox_2" class="ms-2 text-sm font-medium text-gray-900 ">Con devolucion</label>
                    </div>}
                  </div>
                  {preValidate()
                    ? <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] w-full  px-5 py-2.5 text-center  mt-7 lg:col-span-2">Cotizar</button>
                    : <button type="submit" className=" focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] w-full  px-5 py-2.5 text-center  mt-7 lg:col-span-2          text-white bg-green-500     " onClick={HandlerCheckOut2}>Solicitar Cotizacion</button>
                  }
                </form>
              }
              {calcValue !== 'NO DATA' &&
                <div className=" pt-5 " >
                  <div className='flex flex-col w-full'>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>ORIGEN</span><span className='w-full border px-3 py-1'>{calcValue['ORIGEN']}</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>DESTINO</span><span className='w-full border px-3 py-1'>{calcValue['DESTINO']}</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>MERCACIA</span><span className='w-full border px-3 py-1'>{calcValue['MERCANCIA']}</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>PESO</span><span className='w-full border px-3 py-1'>{calcValue['PESO (KG)']} KG</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>VOLUMEN</span><span className='w-full border px-3 py-1'>{calcValue['VOLUMEN M3']} M3</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>TIPO DE UNIDAD</span><span className='w-full border px-3 py-1'>{calcValue['TIPO DE UNIDAD']}</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>SERVICIO</span><span className='w-full border px-3 py-1'>{calcValue['SERVICIO']}</span>
                    </div>
                    <div className='grid grid-cols-2'>
                      <span className='w-full bg-slate-100  font-bold  border px-3 py-1'>FLETE USD</span><span className='w-full border px-3 py-1'>{calcValue['FLETE USD']}</span>
                    </div>
                    <div className='grid grid-cols-2 '>
                      <span className='w-full  font-bold  border px-3 py-1'>SERVICIOS LOGISTICOS USD</span><span className='w-full border px-3 py-1'>{calcValue['SERVICIOS LOGISTICOS USD']}</span>
                    </div>
                    <div className='grid grid-cols-2 bg-[#ffbb00] border-[#ffbb00]  border-[#ffbb0]'>
                      <span className='w-full  font-bold border-[#ffcc41] border px-3 py-1'>TOTAL USD</span><span className='w-full border border-[#ffcc41] font-bold px-3 py-1'>{calcValue['TOTAL']}</span>
                    </div>
                  </div>

                  <div className='relative  w-full grid grid-cols-2 gap-x-5 mt-5'>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px]  px-5 py-2.5 text-center" onClick={() => { setSelectValue({}), setCalcValue('NO DATA') }}>Volver a calcular</button>
                    <InvoicePDF  ></InvoicePDF>
                  </div>
                </div>
              }
              <br />
              {calcValueFCL !== 'NO DATA' && <h5 className='px-5 py-1 my-2 bg-blue-700  text-white '>ELIJE LA NAVIERA</h5>}

              {calcValueFCL !== 'NO DATA' &&
                calcValueFCL.map((i) => i.NAVIERA).map(i => <button className={` rounded-full border-[1px] px-10 transition-all mr-2 ${i === naviera ? 'bg-[#ffbb00] border-[#d4d4d4]' : 'border-[#d4d4d4] '}`} onClick={() => setNaviera(i)}>{i}</button>)
              }
              {console.log(calcValueFCL)}

              {calcValueFCL !== 'NO DATA' &&
                calcValueFCL.map((item) => {

                  return naviera === item.NAVIERA && <div className=" pt-5 " >
                    <h5 className='px-5 py-1 my-2 bg-blue-700  text-white  '>DETALLES</h5>
                    <div className='flex w-full'><span className='w-full bg-slate-100 font-bold border px-3 py-1'>Origen</span><span className='w-full border px-3 py-1'>{item.ORIGEN}</span></div>
                    <div className='flex w-full'><span className='w-full bg-slate-100 font-bold border px-3 py-1'>Destino</span><span className='w-full border px-3 py-1'>{item.DESTINO}</span></div>
                    <div className='flex w-full'><span className='w-full bg-slate-100 font-bold border px-3 py-1'>Equipo</span><span className='w-full border px-3 py-1'>{item.EQUIPO}</span></div>
                    <div className='flex w-full'><span className='w-full bg-slate-100  font-bold border px-3 py-1'>TT</span><span className='w-full border px-3 py-1'>{item.TT}</span></div>
                    {item.flete && <h5 className='px-5 py-1 my-2 bg-blue-700  text-white '>FLETE</h5>}
                    {item.flete && Object.entries(item.flete).map((i, index) => <div className='flex w-full'><span className='w-full bg-slate-100 font-bold border px-3 py-1'>{i[1].ip}</span><span className='w-full border px-3 py-1'>{i[1].ic} USD</span></div>)}
                    {item['recargos origen'] && <h5 className='px-5 py-1 my-2 bg-blue-700  text-white '>RECARGOS ORIGEN</h5>}
                    {item['recargos origen'] && Object.entries(item['recargos origen']).map((i, index) => <div className='flex w-full'><span className='w-full bg-slate-100 font-bold border px-3 py-1'>{i[1].ip}</span><span className='w-full border px-3 py-1'>{i[1].ic} USD</span></div>)}
                    {item['recargos destino'] && <h5 className='px-5 py-1 my-2 bg-blue-700  text-white '>RECARGOS DESTINO</h5>}
                    {item['recargos destino'] && Object.entries(item['recargos destino']).map((i, index) => <div className='flex w-full'><span className='w-full bg-slate-100 font-bold border px-3 py-1'>{i[1].ip}</span><span className='w-full border px-3 py-1'>{i[1].ic} USD</span></div>)}
                    <div className='flex w-full bg-[#ffbb00] border-[#ffcc41]'>
                      <span className='w-full  font-bold border border-[#ffcc41] px-3 py-1'>TOTAL USD</span>
                      <span className='w-full border border-[#ffcc41] px-3 py-1 font-bold'>{
                        !isNaN((item.flete && item.flete !== undefined ? Object.values(item.flete).reduce((acc, i) => {
                          let cal = i['ic'] ? acc + i['ic'] * 1 : acc
                          return cal
                        }, 0) * 1 : 0) + (item['recargos destino'] && item['recargos destino'] !== undefined ? Object.values(item['recargos destino']).reduce((acc, i) => {
                          let cal = i['ic'] ? acc + i['ic'] * 1 : acc
                          return cal
                        }, 0) * 1 : 0) + (item['recargos origen'] && item['recargos origen'] !== undefined ? Object.values(item['recargos origen']).reduce((acc, i) => {
                          let cal = i['ic'] ? acc + i['ic'] * 1 : acc
                          return cal
                        }, 0) * 1 : 0))
                          ? ((item.flete && item.flete !== undefined ? Object.values(item.flete).reduce((acc, i) => {
                            let cal = i['ic'] ? acc + i['ic'] * 1 : acc
                            return cal
                          }, 0) * 1 : 0) + (item['recargos destino'] && item['recargos destino'] !== undefined ? Object.values(item['recargos destino']).reduce((acc, i) => {
                            let cal = i['ic'] ? acc + i['ic'] * 1 : acc
                            return cal
                          }, 0) * 1 : 0) + (item['recargos origen'] && item['recargos origen'] !== undefined ? Object.values(item['recargos origen']).reduce((acc, i) => {
                            let cal = i['ic'] ? acc + i['ic'] * 1 : acc
                            return cal
                          }, 0) * 1 : 0))
                          : 0

                      } USD</span>
                    </div>




                    <div className='relative  w-full grid grid-cols-2 gap-x-5 mt-5'>
                      <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px]  px-5 py-2 text-center" onClick={() => setCalcValueFCL('NO DATA')}>Volver a calcular</button>
                      <InvoicePDF  ></InvoicePDF>
                    </div>
                    <br />

                    <div>
                      Fecha maxima de vigencia de cotizacion: {item.VALIDEZ && item.VALIDEZ !== undefined && item.VALIDEZ.split('-').reverse().map((e) => e + '/')}
                    </div>
                  </div>

                })
              }
            </div>
            <a href={`tel:${cliente.contactos.telefono}`}>
              <marquee className="text-white py-5" behavior="" direction="">Llamanos ya clickea aqui      <button className='border px-5 ml-5  rounded-full bg-[#00000070]' >{cliente.contactos.telefono}</button> </marquee>
            </a>
          </div>
        </div>
      </section>

      <section className='relative w-full z-1000 overflow-x-hidden' id="Servicios">

        <div className='relative px-5 py-12 w-full flex flex-col  lg:grid lg:grid-cols-2 justify-around items-center   bg-gradient-to-t from-[#00195cdc] via-[#00195cb6] to-[#00195cdc] ' id='Nosotros'>
          <div>

            <Subtitle><h3 className='text-[30px] text-[white] text-center font-medium  py-5'>{cliente.inicio.titulo}</h3></Subtitle>
            <ScrollAnimation animateIn='bounceInRight'
              animateOut='bounceOutLeft'
              initiallyVisible={true}
            >
              <p className=' text-[16px] text-[white] ql-editor' dangerouslySetInnerHTML={{ __html: cliente.inicio.content }}></p>
            </ScrollAnimation>

          </div>
          <div className='w-full text-[white] grid grid-cols-2 gap-5 py-12'>
            {cliente && cliente.inicio && cliente.inicio.miniTarjetas && Object.values(cliente.inicio.miniTarjetas).map((i, index) => <MiniTarjeta e1={i[`ip`]} e2={i[`ic`]} />)}
          </div>

          <div className='relative block  md:grid md:grid-cols-2 w-[100%] mt-5 ' style={{ with: '100%' }}>


            <ScrollAnimation animateIn='bounceInRight'>

              <button type="button" onClick={() => handlerSeeMore('PORQUE')} className="relative w-full border-[2px] md:min-w-[300px] md:max-w-[300px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center inline-flex items-center my-2">
                ¿POR QUE ELEGIRNOS? saber {seeMore === 'PORQUE' ? 'menos' : 'mas'}...
                <span className={seeMore === 'PORQUE' ? 'absolute right-5 rotate-[270deg]' : 'absolute right-5 rotate-90'}>{'>'}</span>

              </button>

            </ScrollAnimation>

            <div className={`col-span-2 text-center transition-all w-[100%] ${seeMore === 'PORQUE' ? 'h-auto py-5' : 'h-0'} text-[14px] overflow-hidden text-white lg:hidden`} id='PorQueElegirnos'>

              <h4 className='text-[26px] text-center font-bold text-[#F7BE38]  py-5' >¿POR QUE ELEGIRNOS?</h4>
              <p className='text-left '>
                •	Nuestro servicio está orientado a estándares de calidad, estamos comprometidos a darle una atención personalizada y crear soluciones logísticas inteligentes de acuerdo a cada negocio.
              </p>
              <p className='text-left '>
                •	Sabemos la responsabilidad que conlleva nuestro servicio por lo cual cada que se nos asigna una operación la llevamos a cabo con un riguroso control para optimizar los recursos a utilizar.
              </p>
            </div>

            <ScrollAnimation animateIn='bounceInRight'>

              <button type="button" onClick={() => handlerSeeMore('MISION')} className="relative w-full border-[2px] md:min-w-[300px] md:max-w-[300px] text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center inline-flex items-center mt-[20px] lg:mt-2 my-2">
                MISIÓN y VISIÓN saber {seeMore === 'MISION' ? 'menos' : 'mas'}...
                <span className={seeMore === 'MISION' ? 'absolute right-5 rotate-[270deg]' : 'absolute right-5 rotate-90'}>{'>'}</span>

              </button>

            </ScrollAnimation>


          </div>

          <div className={`col-span-2 text-center transition-all md:grid grid-cols-2 ${seeMore === 'MISION' ? 'h-auto py-5' : 'h-0'} text-[14px] overflow-hidden text-white`}>



            <div className='md:px-[20px] text-[16px]'>
              <h4 className='text-[26px] text-center font-bold text-[#F7BE38]  py-5'>MISION</h4>
              Nuestra misión es integrarnos en la cadena de suministro de nuestros clientes como un aliado estratégico, optimizando y cuidando cada proceso para garantizar la máxima eficiencia. Nos comprometemos a simplificar la logística de tal manera que nuestros clientes puedan enfocarse en su negocio principal, asegurando al mismo tiempo una reducción significativa de costos. En Logistics Gear, no solo transportamos mercancías; facilitamos soluciones logísticas integrales que aceleran el éxito de nuestros clientes.


            </div>
            <div className='md:px-[20px]  text-[16px]'>
              <h4 className='text-[26px] text-center font-bold text-[#F7BE38] py-5'>VISION</h4>
              Nuestra visión es consolidarnos como el referente indiscutible en el sector logístico, ganándonos la confianza plena de nuestros clientes a través de la excelencia, innovación y un servicio impecable. Aspiramos a ser reconocidos por nuestra capacidad de superar expectativas, adaptarnos a los cambios del mercado con agilidad y liderar el camino hacia un futuro donde la eficiencia logística y la sostenibilidad van de la mano. En Logistics Gear, nos comprometemos a ser sinónimo de confiabilidad y calidad, estableciendo nuevos estándares en la industria y expandiendo nuestra presencia global para conectar aún más el mundo con nuestros servicios.
            </div>
          </div>
          <div className={`col-span-2 text-center transition-all w-[50%] ${seeMore === 'PORQUE' ? 'h-auto py-5' : 'h-0'} text-[14px] overflow-hidden text-white hidden lg:block `} id='PorQueElegirnos'>

            <h4 className='text-[26px] text-center font-bold text-[#F7BE38]  py-5' >¿POR QUE ELEGIRNOS?</h4>
            <p className='text-left '>
              •	Nuestro servicio está orientado a estándares de calidad, estamos comprometidos a darle una atención personalizada y crear soluciones logísticas inteligentes de acuerdo a cada negocio.
            </p>
            <p className='text-left '>
              •	Sabemos la responsabilidad que conlleva nuestro servicio por lo cual cada que se nos asigna una operación la llevamos a cabo con un riguroso control para optimizar los recursos a utilizar.
            </p>
          </div>



        </div>

      </section>



      {cliente['terrestre'] && <Section subtitle={cliente['terrestre'].titulo} description={cliente['terrestre'].content} video={cliente['terrestre'].url} degrade='#00000067' tarjetas={cliente['terrestre'].tarjetas} miniTarjetas={cliente['terrestre'].miniTarjetas} id={'terrestre'}></Section>}
      {cliente['maritimo'] && <Section subtitle={cliente['maritimo'].titulo} description={cliente['maritimo'].content} video={cliente['maritimo'].url} degrade='#00000067' tarjetas={cliente['maritimo'].tarjetas} miniTarjetas={cliente['maritimo'].miniTarjetas} id={'maritimo'}></Section>}
      {cliente['aereo'] && <Section subtitle={cliente['aereo'].titulo} description={cliente['aereo'].content} video={cliente['aereo'].url} degrade='#00000067' tarjetas={cliente['aereo'].tarjetas} miniTarjetas={cliente['aereo'].miniTarjetas} id={'aereo'}></Section>}
      {cliente['despachos'] && <Section subtitle={cliente['despachos'].titulo} description={cliente['despachos'].content} video={cliente['despachos'].url} degrade='#00000067' tarjetas={cliente['despachos'].tarjetas} miniTarjetas={cliente['despachos'].miniTarjetas} id={'despachos'}></Section>}
      {cliente['proyecto'] && <Section subtitle={cliente['proyecto'].titulo} description={cliente['proyecto'].content} video={cliente['proyecto'].url} degrade='#00000067' tarjetas={cliente['proyecto'].tarjetas} miniTarjetas={cliente['proyecto'].miniTarjetas} id={'proyecto'}></Section>}
      {cliente['exportaciones'] && <Section subtitle={cliente['exportaciones'].titulo} description={cliente['exportaciones'].content} video={cliente['exportaciones'].url} degrade='#00000067' tarjetas={cliente['exportaciones'].tarjetas} miniTarjetas={cliente['exportaciones'].miniTarjetas} id={'exportaciones'}></Section>}
      {cliente['farmaceutico'] && <Section subtitle={cliente['farmaceutico'].titulo} description={cliente['farmaceutico'].content} video={cliente['farmaceutico'].url} degrade='#00000067' tarjetas={cliente['farmaceutico'].tarjetas} miniTarjetas={cliente['farmaceutico'].miniTarjetas} id={'farmaceutico'}></Section>}
      {cliente['experiencia'] && <Section subtitle={cliente['experiencia'].titulo} description={cliente['experiencia'].content} video={cliente['experiencia'].url} degrade='#00000067' tarjetas={cliente['experiencia'].tarjetas} miniTarjetas={cliente['experiencia'].miniTarjetas} id={'experiencia'}></Section>}
      {cliente['solucionesIT'] && <Section subtitle={cliente['solucionesIT'].titulo} description={cliente['solucionesIT'].content} video={cliente['solucionesIT'].url} degrade='#00000067' tarjetas={cliente['solucionesIT'].tarjetas} miniTarjetas={cliente['solucionesIT'].miniTarjetas} id={'solucionesIT'}></Section>}

      <Footer></Footer>




    </main>

  )
}




