import ClipLoader from 'react-spinners/MoonLoader';
import '../scss/Loader.scss';


export function Loader() {
    return <div className='loader'>
        <ClipLoader color={'#1C94C4'} loading={true} size={70} />
    </div>;
}