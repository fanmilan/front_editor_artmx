import {useEffect, useState} from "react";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import './scss/Home.scss';
import 'swiper/swiper.scss';
import {trackPromise} from 'react-promise-tracker';


import {Page} from './common/Page';
import {BlockItem} from './BlockItem';
import {GridItems} from './GridItems';
import {getBlockApi} from "./api/frontAPI";
import ReactQuill from "react-quill";
import {GridStack} from "gridstack";
import 'gridstack/dist/gridstack.css';
import 'gridstack/dist/gridstack-extra.css';


export default function Home() {

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        trackPromise(
            getBlockApi('front')
                .then(result => {
                    if (result.success) {
                        console.log(result.data);
                        setBlocks(result.data);
                    }
                })
                .catch(error => {
                    alert('Произошла ошибка');
                    console.log(error);
                }));
    }, []);


    function renderSlides() {
        return blocks.map(item => {
            if (item.id === 1) {
                return <Slider items={item.items} renderBlockItem={renderBlockItem}/>
            } else {
                return <Grid name={item.name} items={item.items} renderBlockItem={renderBlockItem}/>;
            }
        });
    }

    function renderBlockItem(item) {
        const text = <ReactQuill
            value={item.text}
            readOnly={true}
            theme={"bubble"}
        />;
        return <BlockItem background={item.backgroundCropped} text={text}/>;
    }

    return (
        <Page title='Главная'>
            {renderSlides()}
        </Page>
    )
}

function Slider(props) {

    function renderSlider(items) {
        return items.map(item => {
            return <SwiperSlide>
                {props.renderBlockItem(item)}
            </SwiperSlide>
        })
    }

    return (
        <div className='slider block-items_slider'>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {renderSlider(props.items)}
            </Swiper>
        </div>
    )
}


function Grid(props) {
    useEffect(() => {
        GridStack.initAll({
            staticGrid: true,
            float: true,
            margin: 0,
            cellHeight: 'auto',
            column: 3
        });
    });


    return (
        <section className='grid-section'>
            <div className="grid-section__header">
                <h2 className="grid-section__title">{props.name}</h2>
            </div>
            <div className="grid-section__body">
                <GridItems blocks={props.items} renderBlockItem={props.renderBlockItem}/>
            </div>

        </section>)
}

