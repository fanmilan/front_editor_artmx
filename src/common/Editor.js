import {useEffect, useRef, useState} from "react";
import '../scss/Editor.scss';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faImage, faPlus, faSave, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import Cropper from "react-cropper";
import ReactQuill from "react-quill";
import {useHistory} from "react-router-dom";
import {getBlockApi, createFrontBlocksApi, updateFrontBlocksApi} from '../api/frontAPI';
import {BlockItem} from "../BlockItem";
import {Page} from "./Page";
import {trackPromise} from "react-promise-tracker";

export function Editor(props) {
    const history = useHistory();
    const cropperRef = useRef(null);
    const inputFileRef = useRef(null);
    const [blocks, setBlocks] = useState([]);
    const [blockName, setBlockName] = useState('');

    const editId = props.editId;
    const defaultBlockItem = props.defaultBlockItem;

    useEffect(() => {
        switch (editId) {
            case undefined:
                setBlocks([defaultBlockItem]);
                setBlockName('');
                break;
            default:
                trackPromise(
                    getBlockApi(editId)
                        .then(result => {
                            if (result.success) {
                                const data = result.data;
                                setBlockName(data.name);
                                setBlocks(data.items);
                            }
                        }).catch(error => {
                            console.log(error);
                    }));
                break;

        }
    }, [editId]);


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
                const img = reader.result;
                changeBlock(currentBlock.id, {background: img, backgroundCropped: img}, true);
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
            id: getNextParamOfSlide('id')
        }
        setBlocks([...blocks, newBlock]);
    }

    function changeBlock(block_id, newParams, upload = false) {
        let newBlocks = [...blocks];
        const blockIndex = newBlocks.findIndex(v => parseInt(v.id) === parseInt(block_id));


        newBlocks[blockIndex] = {
            ...newBlocks[blockIndex],
            ...newParams
        };

        setBlocks(newBlocks);


        if (newParams.aspectRatio) {
            /* set AspectRatio on Opened Cropper */
            if (cropperRef.current && imageEditorIsOpen) {
                cropperRef.current.cropper.setAspectRatio(newParams.aspectRatio)
            }
        }

        if (upload) {
            /* Open Cropper after upload */
            setCurrentBlock(newBlocks[blockIndex]);
            setOpenImageEditor(true);
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

    function handleSave() {
        if (props.editId === undefined) {
            createFrontBlocksApi({name: blockName, params: blocks})
                .then((result) => {
                    alert('Сохранено');
                    if (result.success) {
                        history.push('/front-edit/edit/' + result.data.id);
                        //  setBlocks(result.data);
                    }
                }).catch((error) => {
                    alert('Произошла ошибка');
                    console.log('error');
             });
        } else {
            updateFrontBlocksApi(props.editId, {name: blockName, params: blocks})
                .then(
                    (result) => {
                        if (result.success) {
                            alert('Сохранено');
                        }
                    });
        }
    }

    const renderBlockItem = (item, ExtraBlockBtns) => {
        const bar = <Bar className='bar bar_slide'>
            <ExtraBlockBtns/>
            <BarBtn onClick={openImageEditor.bind(null, item)}>
                <FontAwesomeIcon icon={faImage}/>
            </BarBtn>
            <BarBtn onClick={deleteBlock.bind(null, item.id)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
            </BarBtn>
        </Bar>;
        const text = <ReactQuill theme="bubble"
                                 value={item.text}
                                 onChange={(content) => changeBlock(item.id, {text: content})}
                                 modules={{
                                     toolbar: [
                                         [{'size': ['small', false, 'large', 'huge']}],
                                         ['bold', 'italic', 'underline'],
                                         [{'color': []}, {'background': []}],
                                         [{'align': []}]
                                     ],
                                 }}/>;

        return <BlockItem text={text} bar={bar} background={item.backgroundCropped}/>
    }

    return (
        <Page title={props.title}>
            <div className="editor">
                <input
                    className='input-file'
                    type="file"
                    onChange={uploadFile}
                    ref={inputFileRef}
                />
                {props.children({
                    blocks,
                    renderBlockItem,
                    changeBlock,
                    setBlocks
                })}
                <Bar className='bar bar_main'>
                    <BarSide value='left'>
                        <NameField blockName={blockName} setBlockName={setBlockName}/>
                    </BarSide>
                    <BarSide value='right'>
                        <BarBtn name='save'>
                            <FontAwesomeIcon icon={faSave} onClick={handleSave}/>
                        </BarBtn>
                        <BarBtn name='add' onClick={addBlock}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </BarBtn>
                    </BarSide>
                </Bar>
                {
                    imageEditorIsOpen &&
                    <ImageEditor closeImageEditor={closeImageEditor} changeBlock={changeBlock} block={currentBlock}
                                 cropperRef={cropperRef}/>
                }
            </div>
        </Page>
    );
}


export function Bar(props) {
    return (
        <div className={props.className}>
            {props.children}
        </div>
    )
}

function BarSide({value, children}) {
    return <div className={`bar__side bar__side_${value}`}>{children}</div>;
}

function NameField({blockName, setBlockName}) {
    return <div className='bar__name-field'>
        <input className='bar__input' type='text' value={blockName} onChange={(e) => setBlockName(e.target.value)}
               placeholder='Название...'/>
    </div>
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
        props.changeBlock(props.block.id, {backgroundCropped: cropper.getCroppedCanvas().toDataURL('image/jpeg')});
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
                    style={{'maxHeight': '300px'}}
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
                    ref={props.cropperRef}
                    onInitialized={(instance) => {
                        console.log(instance);
                    }}
                />
            </div>
        </div>
    );
}

