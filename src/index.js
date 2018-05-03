import React from 'react';
import { render } from 'react-dom';
import Tree from './components/tree';
import './styles.css';

const appHTMLContainer = document.getElementById('app');

render(
    <Tree />,
    appHTMLContainer
);
