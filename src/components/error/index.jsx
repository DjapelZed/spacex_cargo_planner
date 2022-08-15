import "./_error.scss";

const Error = ({children}) => {
    return <div className="error">
        <p className="error__text">Error: {children}</p>
    </div>;
};

export default Error;