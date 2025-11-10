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
export function renderToDOM(
    // Kiểu dữ liệu đầu vào đã được làm sạch (không cần boolean/null/undefined nếu được gọi từ VNode.children)
    vnode: VNode | string | number
): Node {
    // Text nodes
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }

    // Functional component
    if (typeof vnode.type === "function") {
        const props = { ...vnode.props, children: vnode.children };
        return renderToDOM(vnode.type(props));
    }

    // Fragment handling và Regular HTML elements
    const vnodeObj = vnode as VNode;
    const el: Node = vnodeObj.type === "fragment" 
        ? document.createDocumentFragment() 
        : document.createElement(vnodeObj.type as string);

    // Xử lý Props (Chỉ chạy cho HTML elements, Fragment bỏ qua)
    if (vnodeObj.type !== "fragment") {
        for (const [key, value] of Object.entries(vnodeObj.props ?? {})) {
            if (key === "children") continue;

            const targetEl = el as HTMLElement;

            if (key === "className") {
                targetEl.className = value;
            } else if (key === "style") {
                if (typeof value === "string") {
                    targetEl.setAttribute("style", value);
                } else if (typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([k, v]) => {
                        const cssKey = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
                        targetEl.style.setProperty(cssKey, String(v));
                    });
                }
            } else if (key.startsWith("on") && typeof value === "function") {
                targetEl.addEventListener(key.slice(2).toLowerCase(), value);
            } else if (key === "ref" && typeof value === "function") {
                value(targetEl);
            } else if (typeof value === "boolean") {
                if (value) targetEl.setAttribute(key, "");
            } else if (value != null) {
                targetEl.setAttribute(key, String(value));
            }
        }
    }


    // Append children (Children đã được làm sạch trong createElement)
    vnodeObj.children.forEach((child) => {
        // KHÔNG CẦN CÁC ĐIỀU KIỆN LỌC (child != null, etc.) ở đây nữa
        el.appendChild(renderToDOM(child as VNode | string | number));
    });

    return el;
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