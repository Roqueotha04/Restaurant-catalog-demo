import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Catalog } from './pages/catalog/catalog';

@Component({
  selector: 'app-root',
  imports: [Catalog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('catalogo-demo');
}
