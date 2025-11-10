// src/todo-app.tsx
/** @jsx createElement */
import {useState, VNode, ComponentProps } from './jsx-runtime';

// TODO: Define TypeScript interfaces [cite: 218]

// Interface cho một Todo Item [cite: 219]
interface Todo {
    id: number; // Hint: id, text, completed, createdAt? [cite: 222]
    text: string;
    completed: boolean;
}

// Interface cho props của một Todo Item Component [cite: 223]
interface TodoItemProps {
    key: any;
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

// Interface cho props của Form thêm mới
interface AddTodoFormProps {
    onAdd: (text: string) => void;
}

// Tiếp tục trong src/todo-app.tsx

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
    const style = {
        padding: '8px',
        margin: '5px 0',
        borderBottom: '1px dotted #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textDecoration: todo.completed ? 'line-through' : 'none',
        color: todo.completed ? '#888' : '#333',
    };

    return (
        <div style={style}>
            <span onClick={() => onToggle(todo.id)} style={{ cursor: 'pointer', flexGrow: 1 }}>
                {todo.text}
            </span>
            <button onClick={() => onDelete(todo.id)} style={{ marginLeft: '10px', fontSize: '12px' }}>
                Delete
            </button>
        </div>
    );
};

// Tiếp tục trong src/todo-app.tsx

const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
    const [getInput, setInput] = useState(''); 
    const inputValue = getInput();

    // Handle form submission [cite: 243]
// Trong src/todo-app.tsx (Component AddTodoForm)

const handleSubmit = (e: Event) => {
    e.preventDefault();// Ngăn chặn default submit (reload trang) [cite: 275]
    
    // Kiểm tra tính hợp lệ của input
    const textToAdd = getInput();
    console.log(textToAdd);
    
    if (textToAdd) {
        // 🛑 THAY ĐỔI: Thay vì gọi onAdd, in ra console nội dung đang được "thêm"
        console.log(`[Todo Debug] Đã nhận được nội dung: "${textToAdd}". Sẵn sàng thêm.`);
        
        // 🛑 THAY ĐỔI: KHÔNG gọi onAdd(textToAdd);
        // setInput(''); // Tùy chọn: bạn có thể reset input nếu muốn
    } else {
        console.log(`[Todo Debug] Không thêm: Input rỗng.`);
    }
};
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setInput(target.value);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
            <input
                type="text"
                value={inputValue} // Dùng giá trị đã được lấy từ getter
                onInput={handleChange}
                placeholder="Add new todo..."
                style={{ flexGrow: 1, padding: '8px' }}
            />
            <button type="submit">Add</button>
        </form>
    );
};

// Tiếp tục trong src/todo-app.tsx

const initialTodos: Todo[] = [
    { id: 1, text: 'Finish Lab Setup', completed: true },
    { id: 2, text: 'Implement Todo App', completed: false },
];

const TodoApp = () => {
    // STEP 1: State for todos array [cite: 249]
    const [getTodos, setTodos] = useState(initialTodos); 
    const todos = getTodos();
    
    // Tạo ID duy nhất [cite: 274]
    const nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1; 

    // STEP 2: Functions to add, toggle, delete todos [cite: 250]
    
    // Thêm todo mới [cite: 260]
    const handleAddTodo = (text: string) => {
        const newTodo: Todo = { id: nextId, text, completed: false };
        setTodos([...todos, newTodo]);
    };

    // Toggle trạng thái [cite: 265]
    const handleToggleTodo = (id: number) => {
        const newTodos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(newTodos);
    };

    // Xóa todo [cite: 266]
    const handleDeleteTodo = (id: number) => {
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
    };

    // Tính toán summary [cite: 267]
    const completedCount = todos.filter(t => t.completed).length;

    // STEP 3: Return JSX structure [cite: 251]
    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Todo App</h2>
            
            <AddTodoForm onAdd={handleAddTodo} /> {/* Add todo form [cite: 253] */}

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {/* Todo list [cite: 254] */}
                {todos.map(todo => ( // Use Array.map() [cite: 273]
                    <TodoItem
                        key={todo.id} // Thêm key để Rollup/Vite không báo lỗi (dù không dùng để diffing)
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                    />
                ))}
            </div>

            <p style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                Completed: {completedCount} / {todos.length} {/* Summary [cite: 267] */}
            </p> 
        </div>
    );
};

export { TodoApp };