
/** @jsx createElement */
import {  mount } from './jsx-runtime';
import { Counter } from './counter'; // Import Counter component của bạn [cite: 468]

// 1. Tìm container DOM
const container = document.getElementById('app-root');

if (container) {
    // 2. Tạo VNode gốc
    const appVNode = (
        <div className="main-app">
            <h1>Custom JSX Counter App</h1>
            <Counter initialCount={10} />
            <Counter />
        </div>
    );
    
    // 3. Mount VNode vào DOM container [cite: 469]
    mount(appVNode, container);
} else {
    console.error("Root element #app-root not found.");
}