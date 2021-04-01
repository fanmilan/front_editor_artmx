import {useEffect, useState} from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import './scss/Home.scss';
import 'swiper/swiper.scss';

import {BlockItem} from './BlockItem';
import {getBlockApi} from "./api/frontAPI";
import ReactQuill from "react-quill";


export default function Home() {

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getBlockApi('front')
            .then(result => {
                if (result.success) {
                    setBlocks(result.data);
                }
            })
            .catch(error => {

             });
    }, []);


    function renderSlides() {
        return blocks.map(item => {
            if (item.id == 1) {
                return <Slider items={item.items}/>
            } else {
                return null;
            }
        });
    }

    return (
        <div className='home-page'>
            <h1>Главная</h1>
            <div className='slider'>
                {renderSlides()}
            </div>
        </div>
    )
}

function Slider(props) {

    function renderSlider(items) {
        return items.map(item =>
        {
            const params = JSON.parse(item.params);
            //const text = <div className={'ql-editor'} dangerouslySetInnerHTML={{__html : params.text}}></div>

            const text = <ReactQuill
                value={params.text}
                readOnly={true}
                theme={"bubble"}
            />;
            return <SwiperSlide>
                <BlockItem background={params.backgroundCropped} text={text} />
            </SwiperSlide>
        })
    }

    return (
        <Swiper
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            {renderSlider(props.items)}
        </Swiper>
    )
}

