import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { Navbar } from '../navbar/navbar';
import { ProductModalComponent } from '../product-modal.component/product-modal.component';
import { Cart } from '../cart/cart';

@Component({
  selector: 'app-menu-container',
  standalone: true,
  imports: [CommonModule, ProductCard, Navbar, ProductModalComponent, Cart],
  templateUrl: './menu-container.html',
  styleUrl: './menu-container.css'
})
export class MenuContainer implements OnInit, AfterViewInit {
  private readonly menuService = inject(MenuService);
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  @ViewChildren('categorySection') sectionElements!: QueryList<ElementRef>;
  
  productsByCategory: { [key: string]: Product[] } = {};
  categories: string[] = [];
  activeCategoryFromScroll = '';
  
  selectedProduct = signal<Product | null>(null);
  isCartOpen = signal(false);

  ngOnInit(): void {
    this.menuService.getProducts().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.groupProducts(data);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.sectionElements.changes.subscribe(() => {
      this.initIntersectionObserver();
    });
  }

  private groupProducts(products: Product[]): void {
    this.categories = [...new Set(products.map(p => p.category))];
    const grouped: { [key: string]: Product[] } = {};
    this.categories.forEach(cat => {
      grouped[cat] = products.filter(p => p.category === cat);
    });
    this.productsByCategory = grouped;
    this.activeCategoryFromScroll = this.categories[0];
    this.cdr.detectChanges();
  }

  private initIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-150px 0px -60% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeCategoryFromScroll = entry.target.id;
          this.cdr.detectChanges();
        }
      });
    }, options);

    this.sectionElements.forEach(section => observer.observe(section.nativeElement));
  }

  onAddToCart(event: { quantity: number, note: string }) {
    const product = this.selectedProduct();
    if (product) {
      this.cartService.addToCart(product, event.quantity, event.note);
    }
    this.selectedProduct.set(null);
  }
}