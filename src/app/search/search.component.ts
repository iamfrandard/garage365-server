import { Component, OnInit } from '@angular/core';
import { Search } from 'src/app/models/search.model';
import { SearchServiceComponent } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  tutorials?: Search[];
  workshops: Search[] = [];
  currentTutorial: Search = {};
  currentIndex = -1;

  constructor(private tutorialService: SearchServiceComponent) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.getWorkshops();
  }

  getWorkshops(): void {
    this.tutorialService.getAll().subscribe(
      (data: Search[]) => {
        this.workshops = data;
      },
      (error: any) => {
        console.error('Error al obtener los talleres', error);
      }
    );
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Search, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(Value: string): void {
    this.currentTutorial = {};
    this.currentIndex = -1;
    this.tutorialService.findByTitle(Value).subscribe({
      next: (data) => {
        this.tutorials = data;
        this.workshops = data;
      },
      error: (e) => console.error(e)
    });
  }
}
