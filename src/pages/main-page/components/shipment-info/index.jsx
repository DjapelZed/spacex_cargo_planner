import { useState } from "react";
import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import Error from "../../../../components/error";
import CalculatorService from "../../../../services/calculatorService";

import "./_shipment-info.scss";

const ShipmentInfo = () => {
    let slug = useParams().name; // company name in lower register with replaced spaces
    const [
        setErrorOnInput,
        currentShipment, 
        setCurrentShipment, 
        isShipmentsHasLoaded, 
        getShipmentInfo, 
        updateAllShipments
    ] = useOutletContext();
    
    const [errorInput, setErrorInput] = useState(false);
    const [errorMaxUnitPower, setErrorMaxUnitPower] = useState(false);
    
    const [boxes, setBoxes] = useState("")
    const [baysCount, setBaysCount] = useState(0);
    
    const calculator = new CalculatorService(); // calculate count of needed cargo bays
    const maxUnitPower = calculator.MAX_UNIT_POWER; // by default it's 10

    // deny saving data on errors
    useEffect(() => {
        setErrorOnInput(errorInput || errorMaxUnitPower); // set errorOnInput state (main-page)
    }, [errorInput, errorMaxUnitPower])

    // update current shipment state (main-page)
    useEffect(() => {
        setCurrentShipment({...currentShipment, boxes: boxes, bays: baysCount});
    }, [boxes, baysCount]);
    
    // load info about shipment in states, 
    // update shipments state (main-page) on leaving current shipment info page
    // this allows to push changed info about shipment in large array only once
    // not on every change of current shipment state 
    useEffect(() => {
        if (slug) {
            try {
                updateAllShipments() // push shipment changes to main shipments state (main-page)
                const shipment = getShipmentInfo(slug); // get info by slug
                if (shipment?.name){
                    setCurrentShipment(shipment);
                    setBoxes(shipment.boxes); 
                    setBaysCount(shipment.bays);
                }
            } catch(e) {
                console.log(e);
            }
        }
    }, [slug, isShipmentsHasLoaded]);

    // calculate baysCount
    useEffect(() => {
        if (errorInput || errorMaxUnitPower) return;
        if (boxes) {
            const bays = calculator.getCargoBaysCountByBoxes(boxes);
            if (!isNaN(bays)) setBaysCount(bays);
        } else setBaysCount(0);
    }, [boxes]);
    
    const handleChangeBoxes = event => {
        // controlled input
        setBoxes(event.target.value);

        // reset error messages if input value is empty string
        if (event.target.value === "") {
            setErrorInput(false);
            return;
        }

        // check if input value write in pattern (only digits, commas and dots)
        if (event.target.validity.patternMismatch) {
            setErrorInput(true);
        } else {
            setErrorInput(false);
        }

        // check if all boxes in allowed range
        event.target.value.split(",").forEach(value => {
            if (parseFloat(value) > maxUnitPower) {
                setErrorMaxUnitPower(true);
                return
            }
            setErrorMaxUnitPower(false);
        })
    };

    // input background color on error occurred
    const style = (error) => {
        if (error) {
            return {
                backgroundColor: "rgba(180, 0, 10, 0.3)"
            };
        }
    };

    // Errors layout
    const errorInputMessage = errorInput ? <Error>Allowed only digits, commas and dots</Error> : null;
    const errorMaxUnitPowerMessage = errorMaxUnitPower ? <Error>
                                                            A box is too large. Max unit power is <i>{maxUnitPower}</i>
                                                        </Error> : null;
    
    // Info layout
    const selectMessage = !slug ? <p>Select Shipment</p> : null;
    const loadMessage = !isShipmentsHasLoaded ? <p>No shipments in local storage</p> : null;
    
    // ShipmentInfo layout
    const displayShipment = currentShipment && JSON.stringify(currentShipment) !== "{}" && slug && isShipmentsHasLoaded;
    const shipmentInfo =  displayShipment ? <>
    <div className="shipment-info__header">
            <h2 className="shipment-info__name">{currentShipment.name}</h2>
            <a 
                href={`mailto:${currentShipment.email}`}
                className="shipment-info__email">
                {currentShipment.email}
            </a>
        </div>
        <div className="shipment-info__cargo-bays">
            <p className="shipment-info__cargo-bays-message">
                Number of required cargo bays <b>{currentShipment.bays}</b>
            </p>
        </div>
        <div className="shipment-info__cargo-boxes">
            <label htmlFor="boxesInput">Cargo boxes</label>
            <input
                pattern="([0-9]*[.,]?)*"
                style={style(errorInput)}
                inputMode="decimal"
                value={boxes ? boxes : ""}
                onChange={handleChangeBoxes}
                type="text"
                id="boxesInput"
                name="boxesInput"
                placeholder="2.6,3,5"/>
                {errorInputMessage}
                {errorMaxUnitPowerMessage}
        </div>
    </> : null;
    return <div className="shipment-info">
        {shipmentInfo}
        {selectMessage}
        {loadMessage}
    </div>;
}

export default ShipmentInfo;