'use client'
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.compat.css"
import 'react-awesome-slider/dist/styles.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';


export default function Item({ e1, e2 }) {
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