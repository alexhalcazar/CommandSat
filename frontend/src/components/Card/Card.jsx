import '@components/Card/Card.css';

export const Card = ({ children, className = 'card', ...props }) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};
