'use client'
import { useUser } from '@/context/Context'
import { onAuth, signInWithEmail, writeUserData, removeData } from '@/firebase/utils'
import { useEffect, useState, useRef } from 'react'
import Subtitle from '@/components/Subtitle'
import { useRouter } from 'next/navigation';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.compat.css"
import priceFTL from '@/db/priceFTL.json'
import 'react-awesome-slider/dist/styles.css';
import Footer from '@/components/Footer'
import { useSearchParams } from 'next/navigation'



function Componente({ route, db, id, title, image, paragraph }) {
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
function Item({ e1, e2 }) {
  return <ScrollAnimation animateIn='flipInX'
    afterAnimatedIn={function afterAnimatedIn(v) {
      var t = "Animate In finished.\n";
      t += 'v.onScreen: ' + v.onScreen + '\n';
      t += 'v.inViewport: ' + v.inViewport;

    }}
    initiallyVisible={true}>
    <div className='flex flex-col justify-center items-center'>
      <span className='text-[20px] md:text-[23px] font-medium'>{e1}</span>
      <span className='text-center'>{e2}</span>
    </div>
  </ScrollAnimation>
}

function Section({ subtitle, description, video, tarjetas, id, }) {

  const { cliente, } = useUser()



  return <section className='relative w-full  bg-gradient-to-tr from-[#00195c] via-[#274492] to-[#00195c] overflow-x-hidden overflow-hidden' id={id}>
    <div className='relative px-5 py-12 w-full lg:px-[100px]  z-30  from-[#00195cdc] via-[#00195cb6] to-[#00195cdc] '>
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

      <div className={`relative w-full text-[white] gap-5 py-12 ${cliente && cliente[id] && cliente[id].miniTarjetas && Object.values(cliente[id].miniTarjetas).length > 4 ? 'grid grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-2'}`}>
        {cliente && cliente[id] && cliente[id].miniTarjetas && Object.values(cliente[id].miniTarjetas).map((i, index) => <Item e1={i[`ip`]} e2={i[`ic`]} />)}
      </div>
      <div className='flex w-full justify-start '>
        {/* <button type="button" className="w-full border-[2px] md:max-w-[300px] text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center inline-flex items-center " onClick={() => redirectHandlerWindow(`https://api.whatsapp.com/send?phone=${cliente.contactos.celular}&text=hola%20Logistics%20Gear,%20quiero%20ordenar%20un%20servicio%20${subtitle}%20`)}>
          Solicitar Cotización
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </button> */}
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
            <Componente route={i[0]} id={id} db={i[1]} title={i[1].title} image={i[1].url} paragraph={i[1].paragraph} />
          </div>
        })}
      </div>


    </div>

  </section>

}

export default function Home() {
  const { user, introVideo, userDB, setUserProfile, setUserSuccess, cliente, nav, navItem, setCliente, focus, setFocus, seeMore, setSeeMore } = useUser()

  const [element, setElement] = useState('TRACKING')
  const [calcValue, setCalcValue] = useState('NO DATA')
  const [selectValue, setSelectValue] = useState({})
  const [query, setQuery] = useState('')

  const router = useRouter()
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  const inputRef = useRef('')
  const inputRef2 = useRef('')
  const searchParams = useSearchParams().get('item')

  const signInHandler = (e) => {
    e.preventDefault()
    let email = e.target[0].value
    let password = e.target[1].value
    email.length !== 0 && password.length !== 0 ? signInWithEmail(email, password, setUserSuccess) : setUserSuccess('Complete')
  }

  const redirectHandlerWindow = (ref) => {
    window.open(ref, '_blank')
  }


  async function HandlerCheckOut(e) {

    //  const data =  Object.entries(calcValue).map((i, index) => `${i[0]}: ${i[1]}`)


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

  function stopPropagation(e) {
    e.stopPropagation();

  }
  useEffect(() => {
    if (window && typeof window !== "undefined") {
      setQuery((window.location.href.split('=')[1]).replaceAll('#', ''))
    }
  }, [cliente, searchParams])




  function reset() {
    setFocus('')
  }
  return (
    <main className={`relative h-screen w-screen `} onClick={reset}>
      {cliente[query] && <Section subtitle={cliente[query].titulo} description={cliente[query].content} video={cliente[query].url} degrade='#00000067' tarjetas={cliente[query].tarjetas} miniTarjetas={cliente[query].miniTarjetas} id={query}></Section>}
      <Footer></Footer>
    </main>

  )
}




