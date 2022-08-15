import loaderGif from "../../resources/img/loader.gif";

const Loader = () => {
    return <div className="loader">
        <img src={loaderGif} alt="Loading..." />
    </div>;
}

export default Loader;