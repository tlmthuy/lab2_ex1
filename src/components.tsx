// src/components.tsx

/** @jsx createElement */
import { createElement, VNode, ComponentProps } from './jsx-runtime';

interface CardProps extends ComponentProps {
    title?: string;
    className?: string;
    onClick?: (event: MouseEvent) => void;
    children?: any;
}

const Card = ({ title, children, className, onClick }: CardProps) => {
    return (
        <div className={`card ${className ?? ''}`} onClick={onClick} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '5px', 
            boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' 
        }}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
};

// Tiếp tục trong src/components.tsx

interface FormProps extends ComponentProps {
    onSubmit: (event: Event) => void;
    className?: string;
    children?: any;
}

// Tiếp tục trong src/components.tsx

interface FormProps extends ComponentProps {
    onSubmit: (event: Event) => void;
    className?: string;
    children?: any;
}

const Form = ({ onSubmit, children, className }: FormProps) => {
    const handleSubmit = (e: Event) => {
        e.preventDefault(); // Handle form submission and prevent default [cite: 354]
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            {children}
        </form>
    );
};

// Tiếp tục trong src/components.tsx

interface InputProps extends ComponentProps {
    type?: string;
    value: string;
    onChange: (e: Event) => void;
    placeholder?: string;
    className?: string;
}

const Input = (props: InputProps) => {
    return (
        <input 
            type={props.type ?? 'text'}
            value={props.value}
            onInput={props.onChange} // Sử dụng onInput để bắt sự kiện thay đổi [cite: 362]
            placeholder={props.placeholder}
            className={props.className}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
        />
    );
};

// TODO: Export tất cả các components đã tạo [cite: 364]
export { Card, Form, Input };