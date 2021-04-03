import './App.scss';
import Home from'./Home';
import HomeEdit from'./HomeEdit';
import GridEditor from'./GridEditor';
import SliderEditor from'./SliderEditor';



import 'react-quill/dist/quill.bubble.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

import "cropperjs/dist/cropper.css";



function App() {
    return (
        <Router>
            <div>
                <ul className='menu'>
                    <li className='menu__item'>
                        <Link className='menu__link' to="/">Главная</Link>
                    </li>
                    <li className='menu__item'>
                        <Link className='menu__link' to="/front-edit">Редактор главной</Link>
                    </li>
                    <li className='menu__item'>
                        <Link className='menu__link' to="/front-edit/edit/1">Редактор слайдера</Link>
                    </li>
                    <li className='menu__item'>
                        <Link className='menu__link' to="/front-edit/edit/2">Редактор блока</Link>
                    </li>
                    <li className='menu__item'>
                        <Link className='menu__link' to="/front-edit/new">Создание блока</Link>
                    </li>
                </ul>
                <Switch>
                    <Route path="/front-edit/edit/1">
                        <SliderEditor />
                    </Route>
                    <Route path={['/front-edit/edit/:editId', '/front-edit/new']}>
                        <GridEditor />
                    </Route>
                    <Route path="/front-edit">
                        <HomeEdit />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>

            </div>
        </Router>

    )
}

export default App;
