export const Button = ({
    onClick,
    children,
    type = 'button',
    className = '',
    ...props
}) => {
    return (
        <button onClick={onClick} type={type} className={className} {...props}>
            {children}
        </button>
    );
};
