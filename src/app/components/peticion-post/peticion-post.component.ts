import { Component } from '@angular/core';
import {PostData} from "../../classes/post-data";
import {PeticionPostService} from "../../services/peticion-post.service";
import {FormsModule} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {PostDataResponse} from "../../classes/post-data-response";
import {firstValueFrom} from "rxjs";


@Component({
  selector: 'app-peticion-post',
  imports: [
    FormsModule,
    JsonPipe,
    NgIf
  ],
  templateUrl: './peticion-post.component.html',
  styleUrl: './peticion-post.component.css'
})
export class PeticionPostComponent {

  postData: PostData = {
    title: '',
    body: '',
    userId: 1,
  };

  response: PostDataResponse | null = null;
  error: string | null = null;
  constructor(private postService: PeticionPostService) {
  }

  async submitPost() {
    this.error = null;
    try {
      this.response = await firstValueFrom(this.postService.sendPost(this.postData));
    } catch (err: any) {
      this.error = err.message || 'Error desconocido al enviar el post';
    }
  }

}
