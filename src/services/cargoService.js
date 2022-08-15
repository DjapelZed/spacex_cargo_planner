class CargoService {
    _url = "https://bitbucket.org/artur_cation/spacex-cargo-planner/raw/1a9e1c0ff090a114999c47b7e9388fbc88bd083b/shipments.json";
    _storage = "shipments"; // local storage key
    
    getSlug(name) {
        return name.toLowerCase().replaceAll(" ", "-");
    }
    
    async loadShipmentsToLocalStorage() {
        const shipments = await this.getShipmentsOverNetwork();
        localStorage.setItem(this._storage, JSON.stringify(shipments))
        return true;
    }

    saveShipmentsToLocalStorage(shipments) {
        localStorage.setItem(this._storage, JSON.stringify(shipments));
    }
    
    getShipmentsFromLocalStorage() {
        const shipments = JSON.parse(localStorage.getItem(this._storage));
        return shipments;
    }
    
    getShipmentsNamesFromLocalStorage() {
        if (this.isShipmentsInLocalStorage()) {
            const data = this.getShipmentsFromLocalStorage();
            const shipmentsNames = data.map(shipment => shipment.name);
            return shipmentsNames;
        }
    }

    isShipmentsInLocalStorage() {
        if (localStorage.hasOwnProperty(this._storage)) 
            return true;
        return false;
    }
    
    async getShipmentsOverNetwork() {
        const response = await fetch(this._url)
                                .then(res => {
                                    if (res.ok) return res;
                                    console.error(`Fetch Status: ${res.status}`);
                                    return res;                                    
                                })
                                .catch(error => {
                                    console.error(error);
                                });
        const data = await response.json();
        return data;
    }
}

export default CargoService;