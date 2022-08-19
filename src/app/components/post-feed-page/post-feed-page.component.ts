import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import Bookmark from 'src/app/models/Bookmark';
import Post from 'src/app/models/Post';
import User from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { PostService } from 'src/app/services/post.service';



@Component({
  selector: 'app-post-feed-page',
  templateUrl: './post-feed-page.component.html',
  styleUrls: ['./post-feed-page.component.css']
})

export class PostFeedPageComponent implements OnInit {

  
  
  postForm = new FormGroup({
    text: new FormControl(''),
    imageUrl: new FormControl('')
    //we should be able to create a custome validator here when we get to the optional functon "profanity filter"
  })

  posts: Post[] = [];
  createPost:boolean = false;
  showBookmarks:boolean=false;
  bookmarkedPosts: Post[] = [];
  allBookmarks:Bookmark[]=[];

  submitForm:FormGroup;
  constructor(private postService: PostService, private authService: AuthService, private bookmarkService: BookmarkService, private fb:FormBuilder) { }
  ngOnInit(): void {

    this.getBookmarks()  

    this.postService.getAllPosts().subscribe(
      (response) => {
        this.posts = response
      }
    )
    
      this.submitForm = this.fb.group({
      search_field: [''],
  })
  }

  toggleCreatePost = () => {
    this.createPost = !this.createPost
  }

  submitPost = (e: any) => {
    e.preventDefault();
    this.postService.upsertPost(new Post(0, this.postForm.value.text || "", this.postForm.value.imageUrl || "", this.authService.currentUser, []))
      .subscribe(
        (response) => {
          this.posts = [response, ...this.posts]
          this.toggleCreatePost()
        }
      )
  }

  toggleFeed =()=>{
    this.showBookmarks=!this.showBookmarks;
    this.getBookmarks()
  }

  getValue(val:string){
    console.log(val)
  }
  
  onSearch= (someInput:string) => {
          this.authService.search(someInput).subscribe((res:any)=>{
      console.log(res);
    })
    alert("Work in progress")
  }

  getBookmarks(){
    this.bookmarkService.getAllSavedPosts(this.authService.currentUser).subscribe(
    (response) => {
      this.bookmarkedPosts.length=0
      this.allBookmarks = response
      for (const element of this.allBookmarks){
        this.bookmarkedPosts.push(element.post);
      }
    }
  )}
}

  