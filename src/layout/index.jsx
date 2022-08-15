import Button from "../components/button";
import Search from "../components/search";

import "./_header.scss";
import "./_main.scss";

const Layout = (props) => {
    const {
        children, 
        searchText, 
        handleChangeSearchText, 
        handleLoadButtonClick, 
        handleSaveButtonClick
    } = props;
    return <div className="wrapper">
        <header className="header">
            <div className="header__container">
                <div className="header__logo">
                    <h1 className="header__title">Cargo Planner</h1>
                </div>
                <div className="header__controls">
                    <div className="header__search">
                        <Search searchText={searchText} handleChangeSearchText={handleChangeSearchText}/>
                    </div>
                    <div className="header__buttons">
                        <Button onClick={handleLoadButtonClick} className="header__button button">Load</Button>
                        <Button onClick={handleSaveButtonClick} className="header__button button">Save</Button>
                    </div>
                </div>
            </div>
        </header>
        <main className="main">
            {children}
        </main>
    </div>
}

export default Layout;