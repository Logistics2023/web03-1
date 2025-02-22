'use client';
import { useUser } from '@/context/Context'
import { onAuth, signUpWithEmail, writeUserData, removeData, getSpecificData } from '@/firebase/utils'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'
import "animate.css/animate.compat.css"
import { useRouter } from 'next/navigation';
import SectionEdit from '@/components/SectionEdit'
import MiniTarjetasEdit from '@/components/MiniTarjetasEdit'
import TarjetasEdit from '@/components/TarjetasEdit'
import TarjetasEdit2 from '@/components/TarjetasEdit2'
import Contactos from '@/components/Contactos'



function NavSection() {

    const { user, introVideo, userDB, option, setOption, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, item, cliente, setCliente, cart, setCart, modal, setModal } = useUser()
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (window && typeof window !== "undefined") {
            setQuery(window.location.href.split('=')[1])
        }
    }, [cliente])
    return (
        <div className='w-full'>
            <ul className="flex border-b border-[blue] ">
                <li className={`-mb-px mr-1 ${option === 'Seccion' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('Seccion')}>
                    <span className=" inline-block rounded-t py-2 px-2 text-blue-700 font-semibold" href="#">Seccion</span>
                </li>
                <li className={`-mb-px mr-1 ${option === 'MiniTarjetas' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('MiniTarjetas')}>
                    <span className=" inline-block rounded-t py-2 px-2 text-blue-500 font-semibold" href="#">MiniTarjetas</span>
                </li>
                {query !== 'inicio' && <li className={`-mb-px mr-1 ${option === 'Tarjetas' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('Tarjetas')}>
                    <span className=" inline-block rounded-t py-2 px-2 text-blue-500  font-semibold" href="#">Tarjetas</span>
                </li>}
            </ul>
        </div>
    )
}


function NavSection2() {

    const { user, introVideo, userDB, option, setOption, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, item, cliente, setCliente, cart, setCart, modal, setModal } = useUser()
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (window && typeof window !== "undefined") {
            setQuery(window.location.href.split('=')[1])
        }
    }, [cliente])
    return (
        <div className='w-full'>
            <ul className="flex border-b border-[blue] ">
                <li className={`-mb-px mr-1 ${option === 'Seccion' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('Seccion')}>
                    <span className=" inline-block rounded-t py-2 px-2 text-blue-700 font-semibold" href="#">Seccion</span>
                </li>
                <li className={`-mb-px mr-1 ${option === 'MiniTarjetas' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('MiniTarjetas')}>
                    <span className=" inline-block rounded-t py-2 px-2 text-blue-500 font-semibold" href="#">MiniTarjetas</span>
                </li>
                {query !== 'inicio' && <li className={`-mb-px mr-1 ${option === 'Tarjetas' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('Tarjetas')}>
                    <span className=" inline-block rounded-t py-2 px-2 text-blue-500  font-semibold" href="#">Tarjetas</span>
                </li>}
            </ul>
        </div>
    )
}






export default function Home() {

    const { user, introVideo, userDB, option, setOption, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, item, cliente, setCliente, cart, setCart, modal, setModal } = useUser()
    const router = useRouter()
    const [query, setQuery] = useState('')

    function close(e) {
        router.back()
    }

    useEffect(() => {
        if (window && typeof window !== "undefined") {
            setQuery(window.location.href.split('=')[1])
        }
    }, [cliente])

    return (
        <div className="min-h-full">
            <img src="/airplane-bg.jpg" className='fixed  w-screen h-screen  object-cover  ' alt="" />
            <div className="fixed  top-0 left-0 flex justify-center w-full h-auto bg-[#000000b4] p-0 z-40 " >
                <div className="relative w-[95%] pb-[200px]  h-screen overflow-y-scroll lg:w-[50%] bg-white border-b border-gray-900/10 pt-16  lg:pb-4 px-5">
                    <div className="absolute w-[50px] top-5 right-5 text-white p-1 rounded-tl-lg rounded-br-lg text-center bg-red-600" onClick={close}>
                        X
                    </div>
                    {query !== 'contactos' && query !== 'experiencia' && <>
                        <NavSection />
                        {option === 'Seccion' && <SectionEdit />}
                        {option === 'MiniTarjetas' && <MiniTarjetasEdit />}
                        {option === 'Tarjetas' && <TarjetasEdit />}
                    </>}

                    {query === 'experiencia' && <>
                        <NavSection2 />
                        {option === 'Seccion' && <SectionEdit />}
                        {option === 'MiniTarjetas' && <MiniTarjetasEdit />}
                        {option === 'Tarjetas' && <TarjetasEdit2 />}
                    </>}

                    {query === 'contactos' && <Contactos />}
                </div>
            </div>
            {success === 'Cargando' && <Loader>ghfhfhj</Loader>}
        </div>
    )
}






