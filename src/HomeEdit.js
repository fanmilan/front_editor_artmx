import {useEffect, useRef, useState} from "react";
// Import Swiper React components

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {getFrontBlocksApi, updateFrontBlocksApi} from "./api/frontAPI";
import {BarBtn, Bar} from "./Editor";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import SliderEditor from "./SliderEditor";
import GridEditor from "./GridEditor";
import Home from "./Home";

export default function HomeEdit() {

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getFrontBlocksApi()
            .then(result => {
                if (result.success) {
                    setBlocks(result.data);
                }
            });
    }, []);

    function changeBlock(block_id, newParams) {
        let newBlocks = [...blocks];
        const blockIndex = newBlocks.findIndex(v => parseInt(v.id) === parseInt(block_id));
        newBlocks[blockIndex] = {
            ...newBlocks[blockIndex],
            ...newParams
        };
        setBlocks(newBlocks);
    }

    function handleSave() {
        updateFrontBlocksApi('front', {blocks : blocks})
            .then(result => {
                if (result.success) {
                    alert('Сохранено');
                }
            })
            .catch(error => {

            });
    }




    return (
        <div className='home-page-editor'>
            <h1>Редактор главной страницы</h1>
            <div className='home-page-editor__add-block'>
                <Link to="/front-edit/new">Добавить новый блок</Link>
            </div>
            <div className='home-page-editor__list-wrap'>
                <ListItems
                    blocks={blocks} setBlocks={setBlocks} changeBlock={changeBlock}
                />
            </div>
            <div className="home-page-editor__save-btn-wrap">
                <div className='home-page-editor__save-btn' onClick={handleSave}>Сохранить</div>
            </div>
        </div>
    )
}


const SortableItem = SortableElement(({item, btns, changeBlock}) => {
    const disabledClass = (item.disabled) ? 'list-pages__item_disabled' : '';

    return (<div className={'list-pages__item ' + disabledClass}>
        <span>{item.name}</span>
        <Bar className={'bar bar_home-edit'}>
            {btns}
            <BarBtn>
                <Link to={"/front-edit/edit/" + item.id}>
                    <FontAwesomeIcon icon={faPencilAlt}/>
                </Link>
            </BarBtn>
            <BarBtn onClick={changeBlock.bind(null, item.id, {'disabled' : !item.disabled})}>
                <FontAwesomeIcon icon={faPowerOff}/>
            </BarBtn>
        </Bar>
    </div>);
});

const SortableList = SortableContainer(({items, changeBlock}) => {
    return (
        <div className='list-pages'>
            {items.map((item, index) => (
                <SortableItem
                    disabled={item.disabled}
                    key={`item-${item.id}`}
                    index={index}
                    item={item}
                    btns={''}
                    changeBlock={changeBlock}
                    className={'list_pages__item'}
                />
            ))}
        </div>
    );
});

function ListItems(props) {

//const [items, setItems] = useState([{'title' : 'Слайдер'}, {'title': 'Розыгрыш'}]);

    function onSortEnd({oldIndex, newIndex}) {
        console.log(oldIndex);
        console.log(newIndex);
        props.setBlocks(arrayMove([...props.blocks], oldIndex, newIndex));
    }

    return <SortableList distance={1} items={props.blocks} onSortEnd={onSortEnd} lockAxis={'y'} lockToContainerEdges={true} changeBlock={props.changeBlock} />;
}




