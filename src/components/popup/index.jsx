import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./_popup.scss";

const Popup = ({children, title, active, className}) => {
    const popupRef = useRef();
    const [activePopup, setActivePopup] = useState(false);
    
    useEffect(() => {
        setActivePopup(active)
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