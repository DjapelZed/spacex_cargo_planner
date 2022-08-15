import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; 
import Error from "../../../../components/error";
import Loader from "../../../../components/loader";
import CargoService from "../../../../services/cargoService";

import "./_shipments-list.scss";

// Left side shipment list component
const ShipmentsList = ({filterWords, isShipmentsHasLoaded}) => {
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [allShipmentsNames, setAllShipmentsNames] = useState([]); // all shipments names
    const [displayShipmentsNames, setDisplayShipmentsNames] = useState([]); // filtered shipments names
    
    const cargoService = new CargoService(); // service to work with API 
    
    // load shipments names from local storage to state
    const updateShipmentsList = () => {
        const shipmentsNames = cargoService.getShipmentsNamesFromLocalStorage();
        if (shipmentsNames) {
            setAllShipmentsNames(shipmentsNames);
        } else {
            setErrorMessage(true);
        }
    };

    // update on load
    useEffect(() => {
        updateShipmentsList();
        setLoading(!isShipmentsHasLoaded);
        setErrorMessage(false);
    }, [isShipmentsHasLoaded]);

    // Filtering shipments names by prop filterWords
    useEffect(() => { 
        if (filterWords) { // filtering shipment names
            const displayNames = allShipmentsNames
                                    .filter(shipmentName => {
                                        return shipmentName
                                                .toLowerCase()
                                                .search(filterWords.toLowerCase()) !== -1
                                    });
            setDisplayShipmentsNames(displayNames);
        } else { // set to display allShipmentsNames if no filterWords
            setDisplayShipmentsNames(allShipmentsNames);
        }
    }, [filterWords, allShipmentsNames]);

    // Shipments list items layout (links)
    const shipmentItems = displayShipmentsNames?.map((shipmentName, i) => {
        return <li key={i} className="shipments-list__item">
            <NavLink to={cargoService.getSlug(shipmentName)}>{shipmentName}</NavLink> 
        </li>;
    });

    // Error layout
    const error = errorMessage && !loading ? <Error>An error occured while getting the shipments list</Error> : null;
    
    // Info layout
    const notFoundStatement = !(error || loading || shipmentItems.length !== 0);
    const notFoundMessage = notFoundStatement ? 
                                <p className="error">
                                    There is no shipment called: <i>"{filterWords}"</i>
                                </p> : null;
    const loader = loading ? <Loader/> : null;
    // ShipmentsList layout
    return <div className="shipments-list">
        <div className="shipments-list__container">
            <ul className="shipments-list__list">
                {shipmentItems}
                {notFoundMessage}
                {error}
                {loader}
            </ul>
        </div>
    </div>;
}

export default ShipmentsList;