import {useEffect, useRef, useState} from "react";
import './scss/Editor.scss';
import arrayMove from 'array-move';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faImage, faPlus, faSave, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import Cropper from "react-cropper";
import ReactQuill from "react-quill";
import {useHistory} from "react-router-dom";
import {getFrontBlocksApi, getBlockApi} from './api/frontAPI';

export function Editor(props) {
    const history = useHistory();
    const cropperRef = useRef(null);
    const inputFileRef = useRef(null);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        console.log(props);
        switch (props.editId) {
            case undefined:
                setBlocks([props.defaultBlockItem]);
                // addBlock();
                break;
            default:
                getBlockApi(props.editId)
                    .then(result => {
                        console.log(result);
                        if (result.success) {
                            setBlocks(result.data);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                break;

        }
        //setBlocks(defaultBlocks);
    }, [props.editId]);


    const [currentBlock, setCurrentBlock] = useState(false);
    const [imageEditorIsOpen, setOpenImageEditor] = useState(false);

    function uploadFile(e) {
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
                changeBlock(currentBlock.id, reader.result, true);
            };
            reader.readAsDataURL(files[0]);
        }
    }

    function getNextParamOfSlide($param) {
        return (blocks.length > 0) ? Math.max.apply(null, blocks.map(v => v[$param])) + 1 : 1;
    }

    function addBlock() {
        const newBlock = {
            ...props.defaultBlockItem,
            id: getNextParamOfSlide('id'),
            sort_id: getNextParamOfSlide('sort_id')
        }
        setBlocks([...blocks, newBlock]);
    }

    function changeBlock(slide_id, newBackground, upload = false) {
        let newBlocks = [...blocks];
        const slideIndex = newBlocks.findIndex(v => {
            return parseInt(v.id) === parseInt(slide_id)
        });


        newBlocks[slideIndex] = (upload) ? {
            ...newBlocks[slideIndex],
            backgroundCropped: newBackground,
            background: newBackground
        } : {
            ...newBlocks[slideIndex],
            backgroundCropped: newBackground
        };

        setBlocks(newBlocks);
        if (upload) {
            setCurrentBlock(newBlocks[slideIndex]);
            setOpenImageEditor(true);
        }
    }

    function changeBlock2(block_id, newParams) {
        let newBlocks = [...blocks];
        const blockIndex = newBlocks.findIndex(v => parseInt(v.id) === parseInt(block_id));


        //console.log(...newParams);

        newBlocks[blockIndex] = {
            ...newBlocks[blockIndex],
            ...newParams
        };
        setBlocks(newBlocks);
        if (newParams.aspectRatio) {
            if (cropperRef.current && imageEditorIsOpen) {
                cropperRef.current.cropper.setAspectRatio(newParams.aspectRatio)
            }
        }
        console.log(newBlocks);
    }

    function deleteBlock(slide_id) {
        let newBlocks = [...blocks];
        const blockIndex = newBlocks.findIndex(v => {
            return parseInt(v.id) === parseInt(slide_id)
        });
        newBlocks.splice(blockIndex, 1);
        setBlocks(newBlocks);
    }


    function openImageEditor(value) {
        setCurrentBlock(value);
        if (!value.background) {
            inputFileRef.current.click();
        } else {
            setOpenImageEditor(true);
        }
    }

    function closeImageEditor() {
        setCurrentBlock(false);
        setOpenImageEditor(false);
    }


    function getData(id) {

        /*fetch("http://localhost:8000/api/front_editor/"+id)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.success) {
                        setBlocks(result.data);
                    }
                },
                (error) => {

                }
            );*/
    }

    function handleSave() {
        //edit
        if (props.editId !== undefined) {
            fetch("http://localhost:8000/api/front_editor/" + props.editId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    params: blocks
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        alert('Сохранено');
                        if (result.success) {
                            //  setBlocks(result.data);
                        }
                    },
                    (error) => {

                    }
                );
        } else {
            //create
            fetch("http://localhost:8000/api/front_editor/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    params: blocks
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        alert('Сохранено');
                        if (result.success) {
                            history.push('/front-edit/edit/' + result.data.id);
                            //  setBlocks(result.data);
                        }
                    },
                    (error) => {
                    }
                );
        }


    }


    function changeText() {

    }


    const BlockItem = (item) => {
        function getStyle() {
            return {
                backgroundImage: 'url(' + item.backgroundCropped + ')'
            }
        }

        return (<div className='block-item'>
            <Bar type='slide'>
                {props.ExtraBlockBtns}
                <BarBtn onClick={openImageEditor.bind(null, item)}>
                    <FontAwesomeIcon icon={faImage}/>
                </BarBtn>
                <BarBtn onClick={deleteBlock.bind(null, item.id)}>
                    <FontAwesomeIcon icon={faTrashAlt}/>
                </BarBtn>
            </Bar>
            <div className="block-item__image" style={getStyle()}/>
            <div className='block-item__text'><ReactQuill theme="bubble"
                                                          value={item.text}
                                                          onChange={changeText}
                                                          modules={{
                                                              toolbar: [
                                                                  [{'size': ['small', false, 'large', 'huge']}],
                                                                  ['bold', 'italic', 'underline'],
                                                                  [{'color': []}, {'background': []}],
                                                                  [{'align': []}]
                                                              ],
                                                          }}/></div>
        </div>)
    }


    return (
        <div className="editor">
            <h1 className='editor__title'>{props.title}</h1>
            <input
                className='input-file'
                type="file"
                onChange={uploadFile}
                ref={inputFileRef}
            />
            {props.children({
                blocks,
                BlockItem,
                changeBlock2
            })}
            <Bar type='main'>
                <BarBtn name='save'>
                    <FontAwesomeIcon icon={faSave} onClick={handleSave}/>
                </BarBtn>
                <BarBtn name='add' onClick={addBlock}>
                    <FontAwesomeIcon icon={faPlus}/>
                </BarBtn>
            </Bar>
            {
                imageEditorIsOpen &&
                <ImageEditor closeImageEditor={closeImageEditor} changeBlock={changeBlock} block={currentBlock}
                             cropperRef={cropperRef}/>
            }
        </div>
    );
}


export function Bar(props) {
    return (
        <div className={'bar bar_' + props.type}>
            {props.children}
        </div>
    )
}


export function BarBtn(props) {
    return (
        <div className={'bar__btn bar__btn_' + props.name} onClick={props.onClick}>{props.children}</div>
    )
}


function ImageEditor(props) {

    const aspectRatio = props.block.aspectRatio || 1920 / 360;


    function onCrop() {
        const imageElement = props.cropperRef?.current;
        const cropper = imageElement?.cropper;
        props.changeBlock(props.block.id, cropper.getCroppedCanvas().toDataURL('image/jpeg'));
        //console.log(cropper.getCroppedCanvas().toDataURL('image/jpeg'));
    }


    //https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg

    return (
        <div className='image-editor' key={props.block.id}>
            <div className="image-editor__header">
                <div className="image-editor__close-btn" onClick={props.closeImageEditor}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            <div className="image-editor__body">
                <Cropper
                    src={props.block.background}
                    // Cropper.js options
                    initialAspectRatio={aspectRatio}
                    aspectRatio={aspectRatio}
                    cropend={onCrop}
                    viewMode={1}
                    zoomable={false}
                    minCropBoxHeight={20}
                    minCropBoxWidth={20}
                    minContainerWidth={300}
                    minContainerHeight={300}
                    responsive={true}
                    ref={props.cropperRef}
                    onInitialized={(instance) => {
                        console.log(instance);
                    }}
                />
            </div>
        </div>
    );
}

