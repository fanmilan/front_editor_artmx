import './App.scss';
import Home from'./Home';
import HomeEdit from'./HomeEdit';
import GridEditor from'./GridEditor';
import SliderEditor from'./SliderEditor';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faImage, faPlus, faSave, faTrashAlt, faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons'
import {useRef, useState} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";



function App() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Главная</Link>
                    </li>
                    <li>
                        <Link to="/front-edit">Редактор главной</Link>
                    </li>
                    <li>
                        <Link to="/front-edit/edit/1">Редактор слайдера</Link>
                    </li>
                    <li>
                        <Link to="/front-edit/edit/2">Редактор блока</Link>
                    </li>
                    <li>
                        <Link to="/front-edit/new">Создание блока</Link>
                    </li>
                </ul>
                <Switch>
                    <Route path="/front-edit/edit/1">
                        <SliderEditor />
                    </Route>
                    <Route path={['/front-edit/edit/:editId', '/front-edit/new']}>
                        <GridEditor />
                    </Route>
                    <Route path="/front-edit">
                        <HomeEdit />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>

            </div>
        </Router>

    )
}




function MainBlock(props) {

    function renderSlides() {
        return props.slides.sort((a,b) => (a.sort_id > b.sort_id) ? 1 : ((a.sort_id < b.sort_id) ? -1 : 0)).map(value => {
            return <Slide key={value.id} item={value} {...props}/>
        });
    }

    return (
        <div className='slides'>
            {renderSlides()}
        </div>
    );
}

function Slide(props) {
    const slideRef = useRef(null);
    const [value, setValue] = useState('');


    function getStyle() {
        return {
            backgroundImage : 'url('+props.item.backgroundCropped+')'
        }
    }


    return (<div className='slides__item' ref={slideRef}>
        <Bar type='slide'>
            <BarBtn>
                <FontAwesomeIcon icon={faArrowUp}/>
            </BarBtn>
            <BarBtn>
                <FontAwesomeIcon icon={faArrowDown}/>
            </BarBtn>
            <BarBtn onClick={props.openImageEditor.bind(null, props.item)}>
                <FontAwesomeIcon icon={faImage}/>
            </BarBtn>
            <BarBtn onClick={props.deleteSlide.bind(null, props.item.id)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
            </BarBtn>
        </Bar>
        <div className="slides__item-image" style={getStyle()}/>
        <div className='slides__item-text'>
            <ReactQuill theme="bubble"
                        value={value}
                        onChange={setValue}
                        modules={{
                            toolbar: [
                                [{'size': ['small', false, 'large', 'huge']}],
                                ['bold', 'italic', 'underline'],
                                [{'color': []}, {'background': []}],
                                [{'align': []}]
                            ],
                        }}

            />
        </div>
    </div>)
}

function Bar(props) {
    return (
        <div className={'bar bar_' + props.type}>
            {props.children}
        </div>
    )
}

function BarBtn(props) {
    return (
        <div className={'bar__btn bar__btn_' + props.name} onClick={props.onClick}>{props.children}</div>
    )
}

function ImageEditor(props) {

    console.log(props);
    const cropperRef = useRef(null);

    function onCrop() {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        props.changeSlide(props.slide.id, cropper.getCroppedCanvas().toDataURL('image/jpeg'));
        //console.log(cropper.getCroppedCanvas().toDataURL('image/jpeg'));
    }



    //https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg

    return (
        <div className='image-editor' key={props.slide.id}>
            <div className="image-editor__header">
                <div className="image-editor__close-btn" onClick={props.closeImageEditor}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            <div className="image-editor__body">
                <Cropper
                    src={props.slide.background}
                    // Cropper.js options
                    initialAspectRatio={5.5}
                    aspectRatio={5.5}
                    cropend={onCrop}
                    viewMode={1}
                    zoomable={false}
                    minCropBoxHeight={20}
                    minCropBoxWidth={20}
                    minContainerWidth={300}
                    minContainerHeight={300}
                    responsive={true}
                    ref={cropperRef}
                    onInitialized={(instance) => {
                        console.log(instance);
                    }}
                />
            </div>
        </div>
    );
}



export default App;
