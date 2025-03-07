import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select',
  imports: [MatSelectModule, MatInputModule, MatFormFieldModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  options = input<{ value: string, code?: string }[]>([]);
  styleSelected = output<string>();

  onMapStyleChange($event: MatSelectChange<any>) {
    console.log($event.value);
    this.styleSelected.emit($event.value);
  }
}
