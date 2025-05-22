import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { HttpService } from '../services/http.service';
import { APIEndPoints } from '../constants/ApiEndPoints';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { LimitWordsPipe } from '../utils/limit-words.pipe';
import { Task } from '../models/task.model';
import { ButtonModule } from 'primeng/button';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TabViewModule } from 'primeng/tabview';
import { Timeline, TimelineModule } from 'primeng/timeline';
import { FieldsetModule } from 'primeng/fieldset';



@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LimitWordsPipe,
    MenuModule,
    ButtonModule,
    MessageModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    RippleModule,
    MultiSelectModule,
    MenubarModule,
    ToolbarModule,
    SplitButtonModule,
    IconFieldModule,
    InputIconModule,
    TabViewModule,
    TimelineModule,
    FieldsetModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageComponent implements OnInit {
  isLoading: boolean = false;
  menuItems: MenuItem[] = [];
  menuBarItems: MenuItem[] = [];
  visible: boolean = false;
  addFormvisible: boolean = false;
  selectedTask: any = {};
  events: any =[];
  taskComments: any =[];

  showDialog(task: any) {
    this.events = task.task_history;
    this.taskComments = task.task_comments;
    this.taskForm.patchValue({
      id: task.id,
      title: task.title,
      dueDate: task.scheduled_time,
      status: task.status,
      description: task.description,
      collaborations: this.collaborators.filter((c) =>
        task.collaborations.some((tc: any) => tc.id === c.id)
      ),
    });

    this.visible = true;
  }
  ngOnInit(): void {
    this.fetchTasks();
    this.loadMenus();
    this.loadMenuBarItems();

  //   this.events = [
  //     { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
  //     { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  //     { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
  //     { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
  // ];
  }
  title = 'Welcome';
  foodShops: any;
  msg: string = '';
  taskForm: FormGroup;
  task = {
    title: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Not Started',
    assignee: '',
    tags: '',
    description: '',
    attachments: [],
    scheduled_time: '',
  };
  collaborators = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Carol' },
  ];

  constructor(
    private httpService: HttpService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.taskForm = this.fb.group({
      id: [null],
      title: [''],
      dueDate: [null],
      status: [''],
      description: [''],
      collaborations: [[]],
    });

  }
  showForm = false;
  tasks: Task[] = [];

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
  ];

  users = ['John Doe', 'Jane Smith', 'Alice Johnson']; // Populate from DB/API

  // onFileChange(event: any) {
  //   const files = event.target.files;
  //   if (files.length > 0) {
  //     this.task.attachments = Array.from(files);
  //   }
  // }
  loadMenus() {
    this.menuItems = [
      {
        label: 'Mark as Done',
        icon: 'pi pi-check',
        command: () => this.changeStatus(this.activeTask, 'done'),
      },
      {
        label: 'Pending',
        icon: 'pi pi-clock',
        command: () => this.changeStatus(this.activeTask, 'pending'),
      },
      {
        label: 'In Progress',
        icon: 'pi pi-spin pi-spinner',
        command: () => this.changeStatus(this.activeTask, 'in-progress'),
      },
      { separator: true },
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => this.showDialog(this.activeTask),
      },
      // {
      //   label: 'View Details',
      //   icon: 'pi pi-eye',
      //   command: () => this.viewDetails(this.activeTask),
      // },
      { separator: true },

      {
        label: 'Delete Task',
        icon: 'pi pi-trash',
        styleClass: 'menu-danger',
        command: () => this.deleteTask(this.activeTask),
      },
    ];
  }

  loadMenuBarItems() {
    this.menuBarItems = [
      {
        label: 'Add Task',
        icon: 'pi pi-pi pi-plus',
        command: () => this.toggleForm(),
      },
    
    ];
  }
  activeTask: any;
  viewDetails(task: any) {
    this.router.navigate(['/task-details', task.id]);
  }

  deleteTask(task: any) {}

  toggleMenu(task: any, menu: any, event: Event) {
    this.loadMenus();
    this.activeTask = task;
    menu.toggle(event); // Now event is defined
  }

  toggleForm() {
    this.addFormvisible = true;  }
  toggleDropdown(action: any) {
    // Close others
    this.tasks.forEach((t) => {
      if (t !== action) t.showDropdown = false;
    });
    action.showDropdown = !action.showDropdown;
  }

  changeStatus(task: any, status: string) {
    console.log(task);
    task.status = status;
    task.showDropdown = false;
    const payload = {
      id: task.id,
      status: status,
    };

    this.updateTask(payload);
  }

  submitTask() {
    // You can replace this with actual logic (e.g., API call)

    // Reset form
    // this.task = {
    //   title: '',
    //   description: '',
    //   dueDate: '',
    //   priority: 'Medium',
    //   status: 'Not Started',
    //   assignee: '',
    //   tags: '',
    //   attachments: [],
    // };
    this.showForm = false;
  }

  fetchTasks(): void {
    this.isLoading = true;
    this.httpService
      .get<{ data: Task[] }>(environment.BASE_URL + APIEndPoints.GET_FOOD_SHOPS)
      .subscribe({
        next: (res) => {
          this.tasks = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
          this.isLoading = false;
        },
      });
  }
  updateTask(task: any): void {
    this.isLoading = true;
    this.httpService
      .post(environment.BASE_URL + APIEndPoints.UPDATE_TASK + task.id, task)
      .subscribe({
        next: (res) => {
          this.fetchTasks();
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
          this.isLoading = false;
        },
      });
  }

  saveTaskEdits(): void {
    this.isLoading = true;
    this.httpService
      .get(environment.BASE_URL + APIEndPoints.UPDATE_TASK)
      .subscribe({
        next: (res) => {
          this.fetchTasks();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
          this.isLoading = false;
        },
      });
  }

  editTask(form: FormGroup): void {
    this.visible = false;
    this.isLoading = true;
    const taskId = form.value.id;
    this.httpService
      .post(
        environment.BASE_URL + APIEndPoints.UPDATE_TASK + taskId,
        form.value
      )
      .subscribe({
        next: (res) => {
          if (res.status == 230) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: form.value.title + '  ' + res.message,
            });
          }

          this.fetchTasks();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
          this.isLoading = false;
        },
      });
  }
}
