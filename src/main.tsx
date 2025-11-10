
/** @jsx createElement */
import { Counter } from './counter';
import { Dashboard } from './dashboard';
import {  mount } from './jsx-runtime';
import { TodoApp } from './todo-app';
// 1. Tìm container DOM
const container = document.getElementById('app-root');

if (container) {
    // 2. Tạo VNode gốc
    const appVNode = (
        <div>
        {/* // Chỉ cần mount TodoApp là đủ */}
        <Counter/>
        <TodoApp /> 
        <Dashboard/>
        </div>
    );
    
    // 3. Mount VNode vào DOM container
    mount(appVNode, container);
} else {
    console.error("Root element #app-root not found.");
}