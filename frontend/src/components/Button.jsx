export const Button = ({ onClick, children, className = '', ...props }) => {
    return (
        <button onClick={onClick} className={className} {...props}>
            {children}
        </button>
    );
};
