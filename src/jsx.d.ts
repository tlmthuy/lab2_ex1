// // src/jsx.d.ts

// // Định nghĩa các kiểu cơ bản cho TypeScript sử dụng JSX
// import { VNode } from './jsx-runtime'; 

// declare global {
//     namespace JSX {
//         // Kiểu trả về của JSX element
//         type Element = VNode;

//         // Định nghĩa các thuộc tính của thẻ HTML nội tại (div, button, etc.)
//         interface IntrinsicElements {
//             [elemName: string]: any; 
//         }

//         // Định nghĩa thuộc tính component chung
//         interface IntrinsicAttributes extends Record<string, any> {
//             children?: any;
//         }
//     }
// }

// export {}; // Bắt buộc export rỗng


// TypeScript JSX type definitions
import { VNode, ComponentProps } from "./jsx-runtime";

declare global {
  // Declare createElement and createFragment as global (injected by Vite)
  function createElement(
    type: string | ((props: ComponentProps) => VNode),
    props: Record<string, any> | null,
    ...children: any[]
  ): VNode;

  function createFragment(
    props: Record<string, any> | null,
    ...children: any[]
  ): VNode;

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export {};