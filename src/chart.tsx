// src/chart.tsx
/** @jsx createElement */
import {  VNode } from './jsx-runtime';
import { DataService } from './data-service'; 

// Khai báo kiểu cho component
interface ChartProps {
    data: { category: string, value: number }[];
    type: 'bar' | 'line';
    width?: number;
    height?: number;
}

const Chart = ({ data, type, width = 300, height = 200 }: ChartProps) => {
    // 💡 Sử dụng ref để truy cập Canvas DOM element
    const canvasRef = (element: HTMLElement) => {
        if (element instanceof HTMLCanvasElement) {
            const ctx = element.getContext('2d');
            if (ctx) {
                // Xóa Canvas
                ctx.clearRect(0, 0, width, height); 
                
                // Logic vẽ biểu đồ (RẤT TỐI GIẢN)
                const maxValue = Math.max(...data.map(d => d.value));
                
                data.forEach((dp, index) => {
                    const barHeight = (dp.value / maxValue) * height;
                    const barWidth = width / data.length;
                    
                    ctx.fillStyle = type === 'bar' ? '#4A90E2' : '#7ED321';
                    
                    if (type === 'bar') {
                        // Vẽ Bar Chart
                        ctx.fillRect(index * barWidth, height - barHeight, barWidth - 5, barHeight);
                        ctx.fillStyle = '#333';
                        ctx.fillText(dp.category, index * barWidth + 5, height - 5);
                    } 
                    // Bỏ qua Line Chart để giữ code ngắn gọn
                });
            }
        }
    };

    return (
        <canvas 
            width={width} 
            height={height} 
            ref={canvasRef} // Gắn ref function vào element
            style={{ border: '1px solid #ddd', display: 'block' }} 
        />
    );
};

export { Chart };