import {useEffect, useState} from "react";
// Import Swiper React components

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {getFrontBlocksApi, updateFrontBlocksApi} from "./api/frontAPI";
import {BarBtn, Bar} from "./common/Editor";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {Page} from "./common/Page";
import {trackPromise} from "react-promise-tracker";


export default function HomeEdit() {

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        trackPromise(
            getFrontBlocksApi()
                .then(result => {
                    if (result.success) {
                        setBlocks(result.data);
                    }
                })
        );

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
        updateFrontBlocksApi('front', {blocks: blocks})
            .then(result => {
                if (result.success) {
                    alert('Сохранено');
                }
            })
            .catch(error => {
                alert('Произошла ошибка');
                console.log(error);

            });
    }


    return (
        <Page title='Редактор главной страницы'>
            <div className='home-page-editor'>
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
        </Page>
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
            <BarBtn onClick={changeBlock.bind(null, item.id, {'disabled': !item.disabled})}>
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


    function onSortEnd({oldIndex, newIndex}) {
        props.setBlocks(arrayMove([...props.blocks], oldIndex, newIndex));
    }

    return <SortableList distance={1} items={props.blocks} onSortEnd={onSortEnd} lockAxis={'y'}
                         lockToContainerEdges={true} changeBlock={props.changeBlock}/>;
}




