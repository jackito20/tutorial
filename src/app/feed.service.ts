import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Feed } from './feed';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private subject: Subject<Feed> = new Subject<Feed>();

  private pusherClient: Pusher;

  constructor() { 
    this.pusherClient = new Pusher('623ee1ada8c755a67b16', { 
        /*auth: {
          params: {
            CSRFToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRlMzY3MjBmMGMyMTEyN2RhNTA1MjkxNGIzNzFmMGQ3N2VjYTlmY2EyYzM2NjYxZjVhZDViODkwNWY2Y2Y4ODhjYjlkM'
          }
        },*/
        forceTLS: true,
        authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
        /*encrypted: true,
        auth: {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRlMzY3MjBmMGMyMTEyN2RhNTA1MjkxNGIzNzFmMGQ3N2VjYTlmY2EyYzM2NjYxZjVhZDViODkwNWY2Y2Y4ODhjYjlkMDBkZmMxNDQzYzZiIn0.eyJhdWQiOiIxIiwianRpIjoiNGUzNjcyMGYwYzIxMTI3ZGE1MDUyOTE0YjM3MWYwZDc3ZWNhOWZjYTJjMzY2NjFmNWFkNWI4OTA1ZjZjZjg4OGNiOWQwMGRmYzE0NDNjNmIiLCJpYXQiOjE1Njc3MTU0NDUsIm5iZiI6MTU2NzcxNTQ0NSwiZXhwIjoxNTk5MzM3ODQ1LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.nBFvkUgryyJ6abekIMmFfnQUd9WrjJfMRWwvpaIPgMGzEMuNx-YYSYhiv96LnMWnh_cVXZkgnAvOZ6K8F2NukMareLikwSUYWC4XvmsWb-YuQ-mJ991O84fssCQoCwxi4IGxK1iI2LgJzV76GPzYWxXnoR6i7roWfBqUi-Wwnx5A1nt97ZiAZQb76nHoL8-eS-DgVbyBZe1XnWgbYt3vR-aoEHn3K7vIFEn7wcTo2H8y3rF0xGCBU-svsLdaj_Ze_MMrrb5op-1axmNOn_HCOp9TRqiFRhc1kcS9NBOjukPXXukJXmSZaF9ynSoAAKFaCvnIgKJeXV3vAyvu0yeXacBhj3vH5xZtDdwF6689Oq2LtD7VagjXw6HSO2LDYX3EbLyE6bmFFZXDpLm4rQkujmji2v4n6r9voA5YpyWelrKx0aUHyo5Z1dU9M9soAzE-uasJbUXNTb6ELoSKXxf4GI7IDAv4IUqG72nZxwBV63mpICOUE0O9PoRXxt73_9P6R-zF8ZRmJPMpu6ivkV6yMM0nB5l1x5C0NXKncowl3MX4Lhqeqr4xEzg8Ksp9wgTxPphq-1lCc0j2nfIQ1oKKoDRUQm7Y1VVfdpQbfXolZKPnqGIGP7DdyHW7xfaDNq-x6bBzPeTZaP0TynPFfBijxoqCG2t7up0GNdL881us2ZM'
          }
        },*/
        cluster: 'us2' 
      });

    const channel = this.pusherClient.subscribe('private-sectionsCreate12');
    //const channel = this.pusherClient.subscribe('sectionsCreate12');

    /*channel.bind(
      'posts',
      (data: { title: string; body: string; time: string }) => {
        this.subject.next(new Feed(data.title, data.body, new Date(data.time)));
      }
    );*/
    channel.bind(
      'my-event',
      (data) => {
        console.log(data);
        this.subject.next(new Feed(data));
      }
    );
  }

  getFeedItems(): Observable<Feed> {
    return this.subject.asObservable();
  }
}
