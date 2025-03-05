import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { delay, filter, fromEvent, map } from 'rxjs';
import { Feature, SelectedSugestion } from '../../interfaces/suggestions.interface';

@Component({
  selector: 'app-autocomplete',
  imports: [MatInputModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent {
  inputQuery = viewChild.required<ElementRef>('query');
  searchValue = output<string>();
  suggestions = input<Feature[]>([]);
  selectedSuggestion = output<SelectedSugestion | null>({});
  

  ngAfterViewInit(): void {   
    fromEvent(this.inputQuery()?.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      filter((query) => query.length > 2),
      delay(1500)
    ).subscribe((query: string) => {
      this.searchValue.emit(query);
    });  
  }

  onSelectionChange(suggestionId: string) {
    const suggestion = this.suggestions().find(({ id }) => id === suggestionId);

    if (!suggestion) return;
    
    const { center, place_name } = suggestion;
    this.selectedSuggestion.emit({ center, place_name });
  }
}
