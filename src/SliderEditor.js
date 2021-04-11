import {Editor, BarBtn} from './common/Editor';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import arrayMove from 'array-move';

export default function SliderEditor() {

    const defaultBlockItem = {
        id: 1,
        background : false,
        backgroundCropped :  false,
        text: '<span class="ql-size-huge">{{ТЕКСТ}}</span>',
        aspectRatio : 1920 / 360
    }

    const editId = 1;





    return (
        <Editor title='Редактор Слайдера' editId={editId} defaultBlockItem={defaultBlockItem}>
            {
                params => <div className='slider-editor'>
                    <Slides
                        slides={params.blocks}
                        renderBlockItem={params.renderBlockItem}
                        setBlocks={params.setBlocks}
                    />
                </div>
            }

        </Editor>
    )
}


function Slides(props) {

    function handleSort(item, up) {
        const down = !up;
        const lengthSlides = props.slides.length;
        if (lengthSlides > 0) {
            const slideIndex = props.slides.findIndex(v => parseInt(v.id) === parseInt(item.id));
            if  (!((up && slideIndex === 0) || (down && slideIndex === lengthSlides - 1))) {
                let newSlideIndex = (up) ? slideIndex-1 : slideIndex+1;
                props.setBlocks(arrayMove([...props.slides], slideIndex, newSlideIndex));

            }
        }
    }

    const ExtraBlockBtns = (item) => <>
        <BarBtn onClick={handleSort.bind(null, item, true)}>
            <FontAwesomeIcon icon={faArrowUp}/>
        </BarBtn>
        <BarBtn onClick={handleSort.bind(null, item, false)}>
            <FontAwesomeIcon icon={faArrowDown}/>
        </BarBtn>
    </>;

    const renderSlides = props.slides.map(value => {
        return props.renderBlockItem(value, ExtraBlockBtns.bind(null, value))
    });

    return (
        <div className='slides block-items_slider block-items_slider-editor'>
            {renderSlides}
        </div>
    );
}
