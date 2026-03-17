import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnChanges {
  @Input({ required: true }) categories: string[] = [];
  @Input() activeCategory: string = '';
  @Input() cartCount: number = 0; // Contador de items en el carrito

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeCategory'] && this.activeCategory) {
      this.centerActiveTab();
    }
  }

  scrollToCategory(category: string) {
    const element = document.getElementById(category);
    if (element) {
      const headerOffset = 110; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  toggleCart() {
    console.log('Abriendo el carrito...');
    // Aquí luego llamaremos a una función para abrir el modal o sidebar
  }

  private centerActiveTab() {
    const activeBtn = document.querySelector('.nav-link.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
}