import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Layout from "../../layout"; // base template
import Button from "../../components/button";
import Popup from "../../components/popup";
import ShipmentsList from "./components/shipments-list";

import CargoService from "../../services/cargoService";

const MainPage = () => {
    const [allShipments, setAllShipments] = useState(null); // contains all shipments info
    const [searchText, setSearchText] = useState(""); // keywords to filter ShipmentsList items
    const [isShipmentsHasLoaded, setIsShipmentsHasLoaded] = useState(false); // ready state, used by ShipmentsList
    const [save, setSave] = useState(false);

    const [activePopupSuccess, setActivePopupSuccess] = useState(false); // control popupSuccess
    const [activePopupSaved, setActivePopupSaved] = useState(false); // control popupSaved
    const [activePopupLoad, setActivePopupLoad] = useState(false); // control popupLoad
    const [currentShipment, setCurrentShipment] = useState({}); // current changes
    
    const cargoService = new CargoService(); // service to work with API
    
    // load shipments from localStorage to state
    const loadShipments = () => {
        const shipments = cargoService.getShipmentsFromLocalStorage();
        setAllShipments(shipments);
    };

    // save shipments from state to localStorage
    const saveShipments = () => {
        setSave(true);
    };

    useEffect(() => {
        if (save) {
            updateAllShipments();
            setActivePopupSaved(true);
        }
    }, [save]);

    useEffect(() => {
        if (allShipments) {
            console.log(allShipments)
            cargoService.saveShipmentsToLocalStorage(allShipments);
        }
    }, [allShipments]);
    
    useEffect(() => {
        setSave(false);
    }, [currentShipment]);
    
    // push shipment changes from ShipmentInfo component to allShipments
    const updateAllShipments = () => {
        const updateStatement = currentShipment.name ? true : false;
        if (updateStatement) {
            const filteredShipments = allShipments.filter(s => {
                return currentShipment.id !== s.id;
            })
            filteredShipments.push(currentShipment);
            setAllShipments(filteredShipments);
        }
        setActivePopupSaved(false);
    };

    // returns shipment info to ShipmentInfo component
    const getShipmentInfo = (slug) => {
        try {
            const shipmentInfo = allShipments.filter(shipment => {
                return cargoService.getSlug(shipment.name) === slug;
            })[0];
            return shipmentInfo;
            
        } catch (error) {
            console.log(error);
        }
    }

    // check is shipments has loaded in local storage
    useEffect(() => {
        const hasLoaded = cargoService.isShipmentsInLocalStorage();
        if (hasLoaded) {
            loadShipments();
            setActivePopupLoad(false);
        } else {
            setActivePopupLoad(true);
        }
        setIsShipmentsHasLoaded(hasLoaded);
    }, []);

    // update a searchText on input 
    const handleChangeSearchText = event => {
        setSearchText(event.target.value);
    };

    // load shipments to local storage by click on load button
    const handleLoadButtonClick = async () => {
        setActivePopupSuccess(false);
        await cargoService.loadShipmentsToLocalStorage();
        const hasLoaded = cargoService.isShipmentsInLocalStorage();
        if (hasLoaded) {
            loadShipments();
            setIsShipmentsHasLoaded(hasLoaded);
            setActivePopupSuccess(true);
        }
    };

    // close ask load popup
    useEffect(() => {
        if (isShipmentsHasLoaded) {
            setActivePopupLoad(false);
        }
    }, [isShipmentsHasLoaded]);
    
    // PopUp windows layout
    const popupAskToLoad = <Popup  
                                title="Load Shipments?" 
                                active={activePopupLoad}>
                                <Button onClick={handleLoadButtonClick} className="button">Load</Button>
                            </Popup>;
    const popupSuccess = <Popup
                            timeoutClose={1} 
                            className="popup_success" 
                            title="Successfully loaded!" 
                            active={activePopupSuccess}/>;
    const popupSaved = <Popup
                            timeoutClose={1} 
                            className="popup_success" 
                            title="Successfully saved!" 
                            active={activePopupSaved}/>;
    
    // MainPage layout
    return (
    <Layout 
        searchText={searchText}
        handleLoadButtonClick={handleLoadButtonClick}
        handleSaveButtonClick={saveShipments}
        handleChangeSearchText={handleChangeSearchText}>
            <ShipmentsList 
                isShipmentsHasLoaded={isShipmentsHasLoaded} 
                filterWords={searchText}/>
            {popupAskToLoad}
            {popupSuccess}
            {popupSaved}
            <Outlet 
                context={[
                    currentShipment, 
                    setCurrentShipment,
                    isShipmentsHasLoaded, 
                    getShipmentInfo, 
                    updateAllShipments]}/> {/* shipment info component */}
    </Layout> 
    );
}

export default MainPage;