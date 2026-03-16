import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-menu-container',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './menu-container.html',
  styleUrl: './menu-container.css',
})
export class MenuContainer implements OnInit {
  private readonly menuService = inject(MenuService);
  
  productsByCategory: { [key: string]: Product[] } = {};
  categories: string[] = [];

  ngOnInit(): void {
    this.menuService.getProducts().subscribe({
      next: (data) => {
        this.groupProductsByCategory(data);
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  private groupProductsByCategory(products: Product[]): void {
    this.categories = [...new Set(products.map(p => p.category))];
    this.categories.forEach(cat => {
      this.productsByCategory[cat] = products.filter(p => p.category === cat);
    });
  }
}