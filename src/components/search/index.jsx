import "./_search.scss"

const Search = ({searchText, handleChangeSearchText}) => {
    return <div className="search">
        <input 
            value={searchText} 
            onChange={handleChangeSearchText} 
            className="search__input" 
            name="search" 
            type="text" 
            placeholder="Search" />       
    </div>;
}

export default Search;