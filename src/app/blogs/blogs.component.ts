import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from '../main.service';
import { Blog } from '../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    EditorModule,
    InputTextareaModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
  ],
  templateUrl: './blogs.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './blogs.component.scss',
})
export class BlogsComponent {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  activeBlog: Blog | boolean = false;
  newBlog: Blog | boolean = false;
  searchName: string = '';
  constructor(
    private mainService: MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async getAllBlogs() {
    const response = await this.mainService.getAllBlogs();
    const blogs = response.data;
    this.blogs = blogs;
    this.filteredBlogs = blogs;
  }

  startCreatingBlog() {
    this.newBlog = {
      title: '',
      content: '',
      shortDescription: '',
      metaTitle: '',
      metaDescription: '',
      category: '',
    };
  }

  async startEditingBlog(blog: Blog) {
    if (blog.id) {
      const response = await this.mainService.getBlogById(blog.id);
      this.activeBlog = response.data;
    }
  }

  filterBlogs() {
    if (this.searchName !== '') {
      this.filteredBlogs = this.blogs.filter((blog) => {
        return blog.title.toLowerCase().includes(this.searchName.toLowerCase());
      });
    } else {
      this.filteredBlogs = this.blogs;
    }
  }

  async confirmCreateBlog(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to create this blog?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await this.mainService.createBlog(this.newBlog);
          if (response.status === 200) {
            this.getAllBlogs();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `The blog has been succesfully created`, life: 3000 });
            this.newBlog = false;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error ocurred while creating blog article', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error ocurred while creating blog article, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmUpdateBlog(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to edit this blog?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await this.mainService.updateBlog(this.activeBlog);
          if (response.status === 200) {
            this.getAllBlogs();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `The blog has been succesfully updated`, life: 3000 });
            this.activeBlog = false;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error ocurred while updating blog article', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error ocurred while updating blog article, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  async confirmDeleteBlog(event: Event, blog: Blog) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this blog?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await this.mainService.deleteBlog(blog);
          if (response.status === 200) {
            this.getAllBlogs();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `The blog has been succesfully deleted`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error ocurred while deleting blog article', life: 3000 });
          }
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error ocurred while deleting blog article, ERROR: ${error}`, life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  seletecBlogToShow(blog: Blog) {
    this.router.navigate([`/admin/blogs/view/${blog.id}`]);
  }

  cancelCreateOrEditblog() {
    this.newBlog = false;
    this.activeBlog = false;
  }

  async ngOnInit(): Promise<void> {
    await this.getAllBlogs();
  }
}
