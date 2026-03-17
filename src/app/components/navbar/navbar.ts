import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private cartService = inject(CartService);
  
  @Input({ required: true }) categories: string[] = [];
  @Input() activeCategory: string = '';
  
  @Output() openCart = new EventEmitter<void>();

  cartCount = this.cartService.totalItems;

  handleCartClick() {
    this.openCart.emit();
  }

  scrollToCategory(category: string) {
    const element = document.getElementById(category);
    if (element) {
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      window.scrollTo({
        top: elementPosition + window.pageYOffset - headerOffset,
        behavior: 'smooth'
      });
    }
  }
}