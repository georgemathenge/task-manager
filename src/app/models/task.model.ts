// src/app/models/task.model.ts

export interface User {
    id:number
    user_name: string;
    // Add more fields if needed (e.g., avatarUrl, id, email, etc.)
  }
  
  export interface Collaboration {
    id: number;
    user_id: number;
    task_id: number;
    remarks: string | null;
    created_at: string | null;
    users: User;
    
  }
  
  export interface Task {
    id: number;
    title: string;
    description: string | null;
    scheduled_time: string | null;
    status: string | null;
    tags: string | null;
    date_created: string;
    remarks: string | null;
    time_spent: string | null;
    user_id: number | null;
    users: User; // You can replace with a proper User interface if needed
    collaborations: Collaboration[];

    showDropdown?: boolean;

  }
  