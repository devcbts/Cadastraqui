import ReactDOM from 'react-dom'
export default function Portal({ id, children }) {
    let container = document.getElementById(id);
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', id);
        document.body.appendChild(container);
    }
    return ReactDOM.createPortal(children, container);
}