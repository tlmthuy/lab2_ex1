// src/dashboard.tsx
/** @jsx createElement */
import {  useState } from './jsx-runtime';
import { DataService } from './data-service';
import { Chart } from './chart'; 

const Dashboard = () => {
    // Lấy dữ liệu ban đầu
    const [getData, setData] = useState(DataService.getData()); 
    const data = getData();
    
    // Xử lý cập nhật dữ liệu (Mô phỏng real-time)
    const handleUpdate = () => {
        const newData = DataService.simulateUpdate(data);
        setData(newData);
    };

    // Gọi hàm update dữ liệu sau mỗi 2 giây (Chỉ hoạt động khi app re-render)
    // 💡 Lưu ý: Cần logic re-render hoàn chỉnh trong useState để việc này hiệu quả.
    setTimeout(handleUpdate, 2000); 

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Dashboard Application</h2>
            
            <button onClick={handleUpdate} style={{ padding: '10px', marginBottom: '20px' }}>
                Force Update Data
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Chart data={data} type="bar" />
                <Chart data={data} type="bar" />
            </div>
            
            <pre style={{ marginTop: '20px', backgroundColor: '#f4f4f4', padding: '10px' }}>
                Data State: {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

export { Dashboard };