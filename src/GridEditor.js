import {Editor, BarBtn} from './Editor';
import {useState, useEffect, createRef, useRef} from "react";
import 'gridstack/dist/gridstack.css';
import 'gridstack/dist/gridstack-extra.css';
import {GridStack} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAlt} from "@fortawesome/free-solid-svg-icons";
import {useParams} from "react-router-dom";
import {GridItems} from "./GridItems";


export default function GridEditor(props) {


    const defaultBlockItem = {
        id: 1,
        grid: {
            w : 1,
            h : 1
        },
        background : false,
        backgroundCropped :  false,
        text: '<span class="ql-size-huge">{{ТЕКСТ}}</span>',
        aspectRatio : 1
    }

    let {editId} = (useParams());
    const [gridId, setGridId] = useState(false);
    useEffect(() => {
        (editId) ? setGridId(editId) : setGridId(false);
    },[editId]);



    return (
        <Editor title='Создания блока типа Сетка' editId={editId} defaultBlockItem={defaultBlockItem}>{
            params => <div className='grid-editor-wrap'>
                <div className='grid-editor'>
                    <GridStackBlock blocks={params.blocks} renderBlockItem={params.renderBlockItem} changeBlock={params.changeBlock}/>
                </div>
            </div>
        }
        </Editor>
    )
}

function GridStackBlock(props) {

    const gridRef = useRef();
    const refs = useRef({});

    const ExtraBlockBtns = () => <>
        <BarBtn name='drag'>
            <FontAwesomeIcon icon={faArrowsAlt}/>
        </BarBtn>
    </>;

    if (Object.keys(refs.current).length !== props.blocks.length) {
        props.blocks.forEach(({id}) => {
            refs.current[id] = refs.current[id] || createRef()
        })
    }

    useEffect(() => {
        gridRef.current = gridRef.current ||
            GridStack.init({
                disableOneColumnMode: true,
                float: true,
                margin: 0,
                cellHeight: 'auto',
                column: 3,
                animate: true,
                handleClass: 'bar__btn_drag'
            });

        const grid = gridRef.current;
        grid.on('resizestop', function(e, el) {
            setTimeout(function(){
                let GridStackNode = el.gridstackNode;
                let {w, h, x, y} = GridStackNode;
                props.changeBlock(el.dataset.id, {aspectRatio : GridStackNode.w / GridStackNode.h, grid : {w, h, x, y}});
            }, 0);
        });
        grid.batchUpdate();
        grid.removeAll(true);
        props.blocks.forEach(({id}) => {
            grid.makeWidget(refs.current[id].current)
        });

        grid.commit();





        return () => {
            console.log('end');
        }

    }, [props.blocks]);
/*
*
*  {
                        gs-x={item.grid.x}
                        } gs-y={item.grid.y}*/

    return (
        <GridItems blocks={props.blocks} renderBlockItem={(item) => props.renderBlockItem(item, ExtraBlockBtns)} refs={refs} />

        /*
        <div className={`grid-stack grid-stack-3`}>
            {props.blocks.map((item, i) => {
                return (
                    <div ref={refs.current[item.id]}
                         gs-w={item.grid.w} gs-h={item.grid.h}
                         data-id={item.id} key={item.id} className={'grid-stack-item'}>
                        <div className="grid-stack-item-content">
                            {props.renderBlockItem(item, ExtraBlockBtns)}
                        </div>
                    </div>
                )
            })}
        </div>*/
    );
}