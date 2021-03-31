import {useRef, useState} from "react";
// Import Swiper React components

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';


export default function HomeEdit() {

    const listBlocks = [{'title' : 'Слайдер'}, {'title': 'Розыгрыш'}];

    return (
        <div className='home-page-editor'>
            <h1>Редактор главной страницы</h1>
            <div className='home-page-editor__add-block'>
                <a className='home-page-editor__add-link'>Добавить новый блок</a>
            </div>
            <div className='home-page-editor__list-wrap'>
                <ListItems />
            </div>
            <div className="home-page-editor__save-btn-wrap">
                <div className='home-page-editor__save-btn'>Сохранить</div>
            </div>
        </div>
    )
}



const SortableItem = SortableElement(({value}) => <li className='list-pages__item'>{value}</li>);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul className='list-pages'>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value.title}`}
                    index={index}
                    value={value.title}
                    className={''}
                />
            ))}
        </ul>
    );
});

function ListItems(props) {

    const [items, setItems] = useState([{'title' : 'Слайдер'}, {'title': 'Розыгрыш'}]);

    function onSortEnd ({oldIndex, newIndex}) {
        setItems(arrayMove([...items], oldIndex, newIndex));
    }

    return <SortableList items={items} onSortEnd={onSortEnd} lockAxis={'y'} lockToContainerEdges={true}/>;
}

