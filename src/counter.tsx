// src/counter.tsx
/** @jsx createElement */
import {useState, VNode } from './jsx-runtime';
import { ComponentProps } from './jsx-runtime'; //

// Interface cho Button
interface ButtonProps {
    onClick: (event: MouseEvent) => void;
    className?: string;
    children?: VNode | string | number | (VNode | string | number)[]; 
}

// Button Component
const Button = (props: ButtonProps) => { 
    const { onClick, className, children } = props;
    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    ); 
};

// Interface cho Counter
interface CounterProps {
    initialCount?: number; 
}

// Counter Component (Định nghĩa chính xác)
const Counter = ({ initialCount = 0 }: CounterProps) => { 
    // Khai báo useState: [getter, setter]
    const [getCount, setCount] = useState(initialCount); 

    // Logic điều khiển
    const increment = () => setCount(getCount() + 1); 
    const decrement = () => setCount(getCount() - 1);
    const reset = () => setCount(initialCount);

    const currentCount = getCount(); // Lấy giá trị hiện tại

    return ( 
        <div className="counter">
            <h2>Count: {currentCount}</h2> 
            <div className="buttons">
                <Button onClick={increment}>+</Button>
                <Button onClick={decrement}>-</Button>
                <Button onClick={reset}>Reset</Button>
            </div>
        </div>
    );
};

// EXPORT COMPONENT - KHẮC PHỤC LỖI ts(2305)
export { Counter };