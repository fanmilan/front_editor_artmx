import {Editor, Bar, BarBtn} from './Editor';
import {useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";

export default function SliderEditor(props) {

    const defaultBlockItem = {
        id: 1,
        background : false,
        backgroundCropped :  false,
        sort_id:0,
        text: '<span class="ql-size-huge">{{ТЕКСТ}}</span>',
        aspectRatio : 1920 / 360
    }


    const editId = 1;
    const ExtraBlockBtns = <>
        <BarBtn>
            <FontAwesomeIcon icon={faArrowUp}/>
        </BarBtn>
        <BarBtn>
            <FontAwesomeIcon icon={faArrowDown}/>
        </BarBtn>
    </>;


    return (
        <Editor title='Редактор Слайдера' ExtraBlockBtns={ExtraBlockBtns} editId={editId} defaultBlockItem={defaultBlockItem}>
            {
                params => <div className='slider-editor'>
                    <MainBlock
                        slides={params.blocks}
                        BlockItem={params.BlockItem}
                    />
                </div>
            }

        </Editor>
    )
}


function MainBlock(props) {
    //<Slide key={value.id} item={value} {...props}/>
    function renderSlides() {
        return props.slides.sort((a,b) => (a.sort_id > b.sort_id) ? 1 : ((a.sort_id < b.sort_id) ? -1 : 0)).map(value => {
            return props.BlockItem(value)
        });
    }

    return (
        <div className='slides block-items_slider'>
            {renderSlides()}
        </div>
    );
}


/*

function SliderEditor() {
    const [currentSlide, setCurrentSlide] = useState(false);
    const [imageEditorIsOpen, setOpenImageEditor] = useState(false);


    const inputFileRef = useRef(null);



    function getNextParamOfSlide($param) {
        return Math.max.apply(null, slides.map(v=>v[$param])) + 1;
    }

    function closeImageEditor() {
        setCurrentSlide(false);
        setOpenImageEditor(false);
    }

    function openImageEditor(value) {
        setCurrentSlide(value);
        if (!value.background) {
            inputFileRef.current.click();
        } else {
            setOpenImageEditor(true);
        }


    }

    function uploadFile(e)  {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }


        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                changeSlide(currentSlide.id, reader.result, true);
            };
            reader.readAsDataURL(files[0]);
        }
    }


    function addSlide() {
        const newSlide = {
            id : getNextParamOfSlide('id'),
            background : false,
            backgroundCropped : false,
            sort_id : getNextParamOfSlide('sort_id')
        }
        setSlides([...slides, newSlide]);
    }

    function deleteSlide(slide_id) {
        let slidesCopy = [...slides];
        const slideIndex = slidesCopy.findIndex(v => {
            return parseInt(v.id) === parseInt(slide_id)
        });
        slidesCopy.splice(slideIndex, 1);
        setSlides(slidesCopy);
    }

    function changeSlide(slide_id, newBackground, upload = false) {
        let slidesCopy = [...slides];
        const slideIndex = slidesCopy.findIndex(v => {
            return parseInt(v.id) === parseInt(slide_id)
        });
        slidesCopy[slideIndex] = (upload) ? {
            ...slidesCopy[slideIndex],
            backgroundCropped : newBackground,
            background: newBackground
        } : {
            ...slidesCopy[slideIndex],
            backgroundCropped : newBackground
        };
        setSlides(slidesCopy);
        if (upload) {
            setCurrentSlide(slidesCopy[slideIndex]);
            setOpenImageEditor(true);
        }
    }


    return (
        <div className="App">
            <h1>Редактор слайдера</h1>
            <input
                className='input-file'
                type="file"
                onChange={uploadFile}
                ref={inputFileRef}
            />
            <MainBlock
                openImageEditor={openImageEditor}
                slides={slides}
                uploadFile={uploadFile}
                inputFileRef={inputFileRef}
                deleteSlide={deleteSlide}
            />
            <Bar type='main'>
                <BarBtn name='save'>
                    <FontAwesomeIcon icon={faSave}/>
                </BarBtn>
                <BarBtn name='add' onClick={addSlide}>
                    <FontAwesomeIcon icon={faPlus}/>
                </BarBtn>
                {
                    imageEditorIsOpen && <ImageEditor closeImageEditor={closeImageEditor} changeSlide={changeSlide} slide={currentSlide}/>
                }
            </Bar>
        </div>
    );
}*/