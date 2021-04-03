import './scss/Page.scss';
import {Loader} from './Loader';
import {usePromiseTracker} from "react-promise-tracker";

export function Page({title, children}) {
    const {promiseInProgress} = usePromiseTracker();
    return (<div className="page">
        <h1 className='page__title'>{title}</h1>
        <div className='page__body'>
            {
                promiseInProgress ? <Loader/> : children
            }
        </div>
    </div>);
}

