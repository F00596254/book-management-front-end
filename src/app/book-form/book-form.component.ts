import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Book } from '../book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  @Input() book: Book = { title: '', author: '', genre: '', year: 0};
  @Output() cancelForm = new EventEmitter<void>();

  buttonText = 'Add Book';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {}

  onSubmit(formData: any): void {
    console.log(formData);
    this.bookService.addBook({
      title: formData.title,
      genre: formData.genre,
      author: formData.author,
      year: formData.year,
    }).subscribe(() => {
      this.bookService.refreshBooks();
    });
  }
  resetForm() {
    throw new Error('Method not implemented.');
  }

  cancel(): void {
    this.book = { title: '', author: '', genre: '', year: 0};
    this.buttonText = 'Add Book';
    this.cancelForm.emit();
  }
}
