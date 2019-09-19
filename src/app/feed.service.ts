import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Feed } from './feed';
import Pusher from 'pusher-js';

import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private subject: Subject<Feed> = new Subject<Feed>();

  private pusherClient: Pusher;
  
  constructor() { 
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImE1NmZmMGRjZjczZjYyZTU0YTQzOTA3OWVjOTcxMjk2M2EzM2NiZmZkZTE4MDM2NzIwODFmOThiYTEyMTBmZDI1YjhjMGRkYzhmNDgyNzdkIn0.eyJhdWQiOiIxIiwianRpIjoiYTU2ZmYwZGNmNzNmNjJlNTRhNDM5MDc5ZWM5NzEyOTYzYTMzY2JmZmRlMTgwMzY3MjA4MWY5OGJhMTIxMGZkMjViOGMwZGRjOGY0ODI3N2QiLCJpYXQiOjE1Njg4Mzg1MDUsIm5iZiI6MTU2ODgzODUwNSwiZXhwIjoxNjAwNDYwOTA1LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.EBpPhAh41gRYJCD5pXm7vFUS-2K6FlvWXEeEIROV9orgW5_BV2QRZ8Ak_XI3GYUq_o1I4FzwZgVvKXXgFFkdloFMr5bMyBA9gCJU49Wob3fL5aVtfn8lNqmRS9TAj2tcEf73M8elaco2GfRP2sxDfwIanEycKyKOn7X1g9GGWh2fSd7tRdotnDTP6EiT-APAQLtla3ahAW6wjD3RmuAHULNtld_jccP2VwwSq7T3Q3NUYQdcWnavkSErK7QHC-guecVKH0V-bTTyHvqONX0yt8V6yFFiKLY0Ki97bVh68duusXOTlOaR1Zww4pTIEGTnJrhMOxQT1nA5UYcQJSSSt4E6VbedR1fM4ziyqSBgxJzH0mWdtBwsZOkr1Cly9GL-B1l346mMZlw8UAg4xTM7W3zXhc4ZG_sxgOKbIOpkxc-wspvJo6hJ0VjY6D3-VtkPVUuhGmXbn38QY4ulZ-3v_8BLbaCNg0ZxabW3rnkHyl8VNw9wMcv-OmyRmQ1bT3nC4XwXNulF_m91T2Kw1Uk2gY0hdUVOtrsemiVgjrtd2WQK-6cqzI3LZQXvTpRmKvpfmn0Yc6uj_o47ody0rphjSaMS5_8-Smo1DoQY-FDILppYw2qP6ERpr4M06zl4TzZgYq7qQcEzvDsQeNrJrl6g4oh84sUsMAqvRMGOq2Y9xtk'
    this.pusherClient = new Pusher('623ee1ada8c755a67b16', { 
        /*auth: {
          params: {
            CSRFToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRlMzY3MjBmMGMyMTEyN2RhNTA1MjkxNGIzNzFmMGQ3N2VjYTlmY2EyYzM2NjYxZjVhZDViODkwNWY2Y2Y4ODhjYjlkM'
          }
        },*/
        forceTLS: true,
        encrypted: true,
        auth: {
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer '+token
          }
        },
        authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
        cluster: 'us2' 
      });

    //this.pusherClient = new Pusher('623ee1ada8c755a67b16', {cluster: 'us2'});

    const channel = this.pusherClient.subscribe('private-sectionsCreate.1');
    
    channel.bind(
      'sections-create',
      (data) => {
        console.log(data);
        this.subject.next(new Feed(data));
      }
    );

    Pusher.log = function(msg) {
      if(window.console && window.console.log) {
        window.console.log("PUSHER LOG: "+msg);
      }  
    }

    console.log("FEED SERVICE");
    /*var echo = new Echo({
      broadcaster: 'pusher',
      key: '623ee1ada8c755a67b16',
      cluster: 'us2',
      forceTLS: true
    });
    echo.channel('sectionsCreate3')
      .listen('my-event', (e)=>{
        console.log("listening...")
        console.log(e)
        //this.subject.next(new Feed(data));
      });*/
  }

  /*subscribe(){
    var echo = new Echo({
      broadcaster: 'pusher',
      key: '623ee1ada8c755a67b16',
      cluster: 'us2'
    });
    echo.channel('sectionsCreate3')
      .listen('my-event', (data)=>{
        console.log(data);
        this.subject.next(new Feed(data));
         
      });
  }*/

  getFeedItems(): Observable<Feed> {
    return this.subject.asObservable();
  }
}
