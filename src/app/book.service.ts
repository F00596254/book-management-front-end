import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from './book';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BookService {
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
  
  refreshBooks() {
    window.location.reload();
  }
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books`);
  }

  // getPlayer(id: string): Observable<Book> {
  //   const url = `${this.baseUrl}/${id}`;
  //   return this.http.get<Book>(url);
  // }

  // performQuery(query: string): Observable<Book[]> {
  //   return this.http.get<Book[]>(`${this.baseUrl}/performQuery/${query}`);
  // }

  addBook(book: Book): Observable<Book> {
    console.log(book);
    return this.http.post<Book>(`${this.baseUrl}/addBook`, book);
  }

  // editPlayer(player: Book): Observable<Book> {
  //   const url = `${this.baseUrl}/${player._id}`;
  //   return this.http.put<Book>(url, player);
  // }

  // updatePlayer(player: Book): Observable<Book> {
  //   if (!player || !player._id) {
  //     throw new Error('Player object or player._id is undefined');
  //   }
  //   const url = `${this.baseUrl}/${player._id}`;
  //   return this.http.put<Book>(url, player, httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  deleteBook(title: string): Observable<Book> {
    const url = `${this.baseUrl}/deleteBook${title}`;
    return this.http.delete<Book>(url);
  }
}
