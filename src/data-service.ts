// src/data-service.ts

interface DataPoint {
    category: string;
    value: number;
}

export class DataService {
    private static generateMockData(count: number): DataPoint[] {
        const categories = ['A', 'B', 'C', 'D'];
        return Array.from({ length: count }, (_, i) => ({
            category: categories[i % categories.length] as string,
            value: Math.floor(Math.random() * 100) + 10
        }));
    }

    // Lấy dữ liệu ban đầu
    public static getData(count: number = 4): DataPoint[] {
        return DataService.generateMockData(count);
    }

    // Mô phỏng cập nhật real-time
    public static simulateUpdate(data: DataPoint[]): DataPoint[] {
        return data.map(dp => ({
            ...dp,
            // Thay đổi giá trị ngẫu nhiên
            value: Math.max(0, dp.value + (Math.random() > 0.5 ? 5 : -5))
        }));
    }
}