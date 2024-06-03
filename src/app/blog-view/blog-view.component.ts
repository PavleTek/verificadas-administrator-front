import { Component } from '@angular/core';
import { MainService } from '../main.service';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Blog } from '../types';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-view',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './blog-view.component.html',
  styleUrl: './blog-view.component.scss',
})
export class BlogViewComponent {
  blog: Blog | undefined;
  constructor(
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  async ngOnInit() {
    try {
      window.scrollTo(0, 0);
      const params = await firstValueFrom(this.route.params);
      if (params) {
        let blogId = params['id'];
        blogId = parseInt(blogId);
        if (blogId) {
          const response = await this.mainService.getBlogById(blogId);
          this.blog = response.data;
          this.titleService.setTitle(`${this.blog?.metaTitle}`);
          this.metaService.updateTag({
            name: 'description',
            content: `${this.blog?.metaDescription}`,
          });
        } else {
        }
      }
    } catch (error) {
      console.error('Error with getting girl logic', error);
    }
  }
}
