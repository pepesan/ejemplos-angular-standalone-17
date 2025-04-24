import {Component, OnDestroy} from '@angular/core';
import {PostData} from "../../classes/post-data";
import {PeticionPostService} from "../../services/peticion-post.service";
import {FormsModule} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {PostDataResponse} from "../../classes/post-data-response";
import {Subscription} from "rxjs";


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
export class PeticionPostComponent implements OnDestroy{

  postData: PostData = {
    title: '',
    body: '',
    userId: 1,
  };

  response: PostDataResponse | null = null;
  error: string | null = null;

  public datoObservableSubscription: Subscription | null = null;

  constructor(private postService: PeticionPostService) {

  }

  submitPost() {
    this.error = null;
    try {
      this.datoObservableSubscription=this.postService.sendPost(this.postData).subscribe(data => {
        this.response = data;
        console.log('Respuesta del servidor:', data);
      });
    } catch (err: any) {
      this.error = err.message || 'Error desconocido al enviar el post';
    }
  }

  ngOnDestroy(): void {
    if (this.datoObservableSubscription) {
      this.datoObservableSubscription.unsubscribe();
    }
  }

}
