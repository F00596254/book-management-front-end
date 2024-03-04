import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BookService } from '../book.service';
import { Book } from '../book';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  displayedColumns: string[] = ['title', 'author', 'genre', 'year'];
  selectedOption: any = '';
  dropdownOptions: any[] = [
    { label: 'Most Touchdowns', value: 'mostTouchdowns' },
    { label: 'Most Rushing Yards', value: 'mostRushingYards' },
    { label: 'Least Rushing Yards', value: 'leastRushingYards' },
    { label: 'Fewest Field Goals', value: 'fewestFieldGoals' },
    { label: 'Most Number of Sacks', value: 'mostNumberOfSacks' },
  ];
  selectedOptionMap: any = {
    "mostTouchdowns" : "Most Touchdowns",
    "mostRushingYards" : "Most Rushing Yards",
    "leastRushingYards" : "Least Rushing Yards",
    "fewestFieldGoals" : "Fewest Field Goals",
    "mostNumberOfSacks" : "Most Number of Sacks",
  };
  queryResult: any = '';

  getSelectedOption() {
    return this.selectedOption;
  }

  dataSource!: MatTableDataSource<Book>;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.bookService.getBooks().subscribe((books: Book[]) => {
      this.dataSource = new MatTableDataSource<Book>(books);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addBook(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      data: { type: 'add' }
    });

    dialogRef.afterClosed().subscribe(book => {
      if (book) {
        this.bookService.addBook(book).subscribe(() => {
          this.bookService.getBooks().subscribe(books => {
            this.dataSource = new MatTableDataSource<Book>(books);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.snackBar.open('Book added successfully', 'OK', {
              duration: 3000
            });
          });
        });
      }
    });
  }

  // editPlayer(player: Book): void {
  //   const dialogRef = this.dialog.open(BookFormComponent, {
  //     width: '500px',
  //     data: { type: 'edit', player: Object.assign({}, player) }
  //   });

  //   dialogRef.afterClosed().subscribe(editedPlayer => {
  //     if (editedPlayer) {
  //       this.bookService.ed(editedPlayer).subscribe(() => {
  //         this.playerService.getPlayers().subscribe(players => {
  //           this.dataSource = new MatTableDataSource<Player>(players);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //           this.snackBar.open('Player updated successfully', 'OK', {
  //             duration: 3000
  //           });
  //         });
  //       });
  //     }
  //   });
  // }

  onOptionSelected(): void {
    console.log("Option Selected");
  }

  // onOptionSelected(): void {
  //   // Make a call to your service with the selected option
  //   this.playerService.performQuery(this.selectedOption).subscribe(response => {
  //     // Handle the response if needed
  //     let res = response && response[0];
  //     switch(this.selectedOption) {
  //       case 'mostTouchdowns':
  //         this.queryResult = {ans: res.touchdownsThrown, name: res.name}
  //         break;
  //       case 'mostRushingYards':
  //         this.queryResult = {ans: res.rushingYards, name: res.name}
  //         break;
  //       case 'leastRushingYards':
  //         this.queryResult = {ans: res.rushingYards, name: res.name}
  //         break;
  //       case 'fewestFieldGoals':
  //         this.queryResult = {ans: res.madeFieldGoals, name: res.name}
  //         // this.queryResult = {ans: res.rushingYards, name: res.name}
  //         break;
  //       case 'mostNumberOfSacks':
  //         this.queryResult = {ans: res.sacks, name: res.name}
  //         // this.queryResult = {ans: res.rushingYards, name: res.name}
  //         break;
  //     }
  //   });
  // }

  deleteBook(title: string) {

    if (window.confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(title).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (book) => book.title !== title
        );
      });
    }
  }
}
