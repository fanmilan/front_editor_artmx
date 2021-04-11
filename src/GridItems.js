export function GridItems({blocks, renderBlockItem, refs}) {
    function renderItems() {
        return blocks.map((item) => {
            return (
                <div
                    ref={refs?.current[item.id]}
                    gs-w={item.grid.w} gs-h={item.grid.h}
                    gs-x={item.grid.x} gs-y={item.grid.y}

                    data-id={item.id} key={item.id} className={'grid-stack-item'}>
                    <div className="grid-stack-item-content">
                        {renderBlockItem(item)}
                    </div>
                </div>
            );
        });
    }

    return (<div className="grid-stack grid-stack-3">
        {renderItems()}
    </div>);
}

