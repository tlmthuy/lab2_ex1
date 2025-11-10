// src/jsx-runtime.ts

// ==========================
// VIRTUAL NODE DEFINITIONS
// ==========================
// ĐIỀU CHỈNH: VNode.children KHÔNG NÊN chứa null/undefined/boolean.
// Nó chỉ nên chứa các kiểu dữ liệu đã được làm sạch để render.
export interface VNode {
    type: string | ComponentFunction;
    props: Record<string, any>;
    children: (VNode | string | number)[]; 
}

export interface ComponentProps {
    // ĐIỀU CHỈNH: Cho phép các kiểu dữ liệu không hợp lệ ở ĐẦU VÀO component
    children?: (VNode | string | number | boolean | null | undefined)[] | VNode | string | number;
    [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode; 

// ==========================
// JSX RUNTIME CORE
// ==========================

export function createElement(
    type: string | ComponentFunction,
    props: Record<string, any> | null,
    // ĐIỀU CHỈNH: Cho phép các kiểu dữ liệu không hợp lệ ở ĐẦU VÀO createElement
    ...children: (VNode | string | number | boolean | null | undefined)[] 
): VNode {
    const normalizedProps = props ?? {};
    
    // ĐIỀU CHỈNH: LỌC BỎ null, undefined, VÀ BOOLEAN
    const normalizedChildren = children
        .flat(Infinity)
        .filter((c) => c !== null && c !== undefined && typeof c !== 'boolean') as (VNode | string | number)[];

    return {
        type,
        props: { ...normalizedProps, children: normalizedChildren }, // Thêm children vào props
        children: normalizedChildren,
    } as VNode; // Dùng as VNode vì children đã được làm sạch
}

export const createFragment = (
    props: Record<string, any> | null,
    ...children: (VNode | string | number | boolean | null | undefined)[] // ĐIỀU CHỈNH: Cho phép boolean/null/undefined ở đầu vào
): VNode => createElement("fragment", props, ...children);

// ==========================
// RENDERING SYSTEM
// ==========================
// Trong src/jsx-runtime.ts

export function renderToDOM(
    // Kiểu dữ liệu đầu vào đã được làm sạch
    vnode: VNode | string | number
): Node {
    // 1. Text nodes (strings and numbers)
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }

    // 2. Functional component
    if (typeof vnode.type === "function") {
        // Gọi component function để lấy VNode con
        const props = { ...vnode.props, children: vnode.children };
        return renderToDOM(vnode.type(props));
    }
    
    // 3. Fragment handling và Regular HTML elements
    const vnodeObj = vnode as VNode;
    const el: Node = vnodeObj.type === "fragment" 
        ? document.createDocumentFragment() 
        : document.createElement(vnodeObj.type as string);

    // Xử lý Props (Chỉ chạy cho HTML elements)
    if (vnodeObj.type !== "fragment") {
        for (const [key, value] of Object.entries(vnodeObj.props ?? {})) {
            if (key === "children") continue;

            const targetEl = el as HTMLElement;

            // 💡 Feature: Refs Support (đã hoàn thành)
            if (key === "ref" && typeof value === "function") {
                value(targetEl); 
            } 
            // Xử lý Events (onClick)
            else if (key.startsWith("on") && typeof value === "function") {
                const eventName = key.substring(2).toLowerCase();
                targetEl.addEventListener(eventName, value);
            }
            // Xử lý className
            else if (key === "className") {
                targetEl.className = value;
            } 
            // 💡 Feature: CSS-in-JS (đã hoàn thành)
            else if (key === "style") {
                if (typeof value === "string") {
                    targetEl.setAttribute("style", value);
                } else if (typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([k, v]) => {
                        const cssKey = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
                        targetEl.style.setProperty(cssKey, String(v));
                    });
                }
            } 
            // 💡 Feature: Xử lý Boolean (disabled, checked) - Đã sửa
            else if (typeof value === "boolean") {
                if (value) {
                    targetEl.setAttribute(key, "");
                } else {
                    targetEl.removeAttribute(key); // XÓA thuộc tính khi giá trị là false
                }
            } 
            // Xử lý các thuộc tính HTML tiêu chuẩn khác
            else if (value != null) {
                targetEl.setAttribute(key, String(value));
            }
        }
    }


    // Append children 
    vnodeObj.children.forEach((child) => {
        el.appendChild(renderToDOM(child as VNode | string | number));
    });

    return el;
}
let rootComponent: VNode | ComponentFunction | null = null;
let rootContainer: HTMLElement | null = null; // KHẮC PHỤC LỖI Cannot find name 'rootContainer'


// Hàm kích hoạt re-render toàn bộ ứng dụng
function scheduleRender() {
    if (rootComponent && rootContainer) {
        // Gọi lại mount để vẽ lại toàn bộ cây VNode
        mount(rootComponent, rootContainer);
    }
}
// ==========================
// MOUNT TO DOM
// ==========================
export function mount(
    // ĐIỀU CHỈNH: Chỉ chấp nhận VNode hoặc ComponentFunction
    vnode: VNode | ComponentFunction, 
    container: HTMLElement
): void {
    const resolvedVNode =
        typeof vnode === "function" ? (vnode as ComponentFunction)({}) : vnode;

    container.innerHTML = "";
    container.appendChild(renderToDOM(resolvedVNode as VNode));
}

// ==========================
// BASIC STATE HOOK
// ==========================
// ĐIỀU CHỈNH: Trả về [getter, setter] thay vì [value, setter]
export function useState<T>(initialValue: T): [() => T, (newValue: T) => void] {
    let value = initialValue;

    const getValue = () => value; // Getter function

    const setValue = (newValue: T) => {
        value = newValue;
        console.log("State updated:", value);
        // Real frameworks would trigger a re-render here
    };

    return [getValue, setValue];
}
// src/jsx-runtime.ts (Thêm vào đầu file)

// Map lưu trữ các hàm xử lý sự kiện: key = eventType, value = hàm xử lý
const eventHandlers = new Map(); 

// Hàm lắng nghe sự kiện toàn cục
function globalEventHandler(e: Event) {
    // 1. Tìm sự kiện (ví dụ: 'click', 'input')
    const eventType = e.type;
    
    // 2. Lặp lại cho đến root để tìm element có handler
    let target = e.target as HTMLElement | null;
    
    while (target && target !== rootContainer) {
        // 3. Kiểm tra xem element có thuộc tính lưu trữ handler không (ví dụ: data-onclick)
        const handler = target.getAttribute(`data-on-${eventType}`);
        
        if (handler) {
            // Nếu tìm thấy handler, gọi hàm tương ứng
            const handlerFn = eventHandlers.get(handler);
            if (typeof handlerFn === 'function') {
                handlerFn(e);
                return; // Xử lý xong, thoát
            }
        }
        target = target.parentElement;
    }
}

// 4. Gắn listener toàn cục (chỉ chạy một lần)
// Chạy lệnh này khi app mount lần đầu hoặc khi file được tải
if (typeof document !== 'undefined') {
    ['click', 'input', 'submit'].forEach(eventType => {
        document.addEventListener(eventType, globalEventHandler);
    });
}

// src/jsx-runtime.ts (Thêm vào cuối file)

// TODO: Create performance tests

export function runBenchmarks(rootContainer: HTMLElement, vnodeToTest: VNode, iterations: number = 1000) {
    const results = {
        createElement: 0,
        renderToDOM: 0
    };

    // 1. BENCHMARK: createElement Speed
    const startTimeCreate = performance.now();
    for (let i = 0; i < iterations; i++) {
        // Thực hiện lại việc tạo VNode từ một hàm component
        createElement(vnodeToTest.type as any, vnodeToTest.props, ...vnodeToTest.children); 
    }
    const endTimeCreate = performance.now();
    results.createElement = (endTimeCreate - startTimeCreate) / iterations; // Thời gian trung bình

    // 2. BENCHMARK: renderToDOM Speed
    const startTimeRender = performance.now();
    for (let i = 0; i < iterations; i++) {
        rootContainer.innerHTML = ''; // Reset container
        rootContainer.appendChild(renderToDOM(vnodeToTest));
    }
    const endTimeRender = performance.now();
    results.renderToDOM = (endTimeRender - startTimeRender) / iterations; // Thời gian trung bình

    console.log(`\n--- JSX Runtime Benchmark (${iterations} runs) ---`);
    console.log(`Average createElement time: ${results.createElement.toFixed(3)} ms`);
    console.log(`Average renderToDOM time: ${results.renderToDOM.toFixed(3)} ms`);
    console.log("-------------------------------------------------");
    
    return results;
}