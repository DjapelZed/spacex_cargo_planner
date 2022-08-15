import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./_popup.scss";

const Popup = ({children, title, active, timeoutClose=0, className}) => {
    const popupRef = useRef();
    const [activePopup, setActivePopup] = useState(false);
    const [timer, setTimer] = useState();

    useEffect(() => {
        return () => clearTimeout(timer);
    }, []);

    const closeByTimer = (timeout) => {
        const timer = setTimeout(() => {
            setActivePopup(false)
        }, timeout);
        setTimer(timer);
    };

    useEffect(() => {
        setActivePopup(active);
        if (active && timeoutClose) {
            closeByTimer(timeoutClose*1000);
        }
    }, [active]);

    const closeByClickAround = event => {
        if (event.target === popupRef.current) {
            setActivePopup(false);
        }
    ;}
    
    const handleClick = event => {
        closeByClickAround(event);
    };

    const activeClass = activePopup ? "popup_active" : "";
    const classNames = ["popup", activeClass, className].join(" ");
    return <div ref={popupRef} onClick={handleClick} className={classNames}>
        <div className="popup__container">
            <h2 className="popup__title">{title}</h2>
            {children}
        </div>
    </div>;
}

export default Popup;