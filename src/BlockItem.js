import './scss/BlockItem.scss';

export function BlockItem({background, bar, text}) {
    function getStyle() {
        return {
            backgroundImage: 'url(' + background + ')'
        }
    }

    return (<div className='block-item'>
        {bar}
        <div className="block-item__image" style={getStyle()}/>
        <div className='block-item__text'>{text}</div>
    </div>)
}