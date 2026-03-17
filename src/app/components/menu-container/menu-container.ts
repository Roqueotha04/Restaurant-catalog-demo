import { 
  Component, OnInit, inject, AfterViewInit, ViewChildren, 
  QueryList, ElementRef, ChangeDetectorRef, signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { Navbar } from '../navbar/navbar';
import { ProductModalComponent } from '../product-modal.component/product-modal.component';

@Component({
  selector: 'app-menu-container',
  standalone: true,
  imports: [CommonModule, ProductCard, Navbar, ProductModalComponent],
  templateUrl: './menu-container.html',
  styleUrl: './menu-container.css',
})
export class MenuContainer implements OnInit, AfterViewInit {
  private readonly menuService = inject(MenuService);
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  @ViewChildren('categorySection') sectionElements!: QueryList<ElementRef>;
  
  productsByCategory: { [key: string]: Product[] } = {};
  categories: string[] = [];
  activeCategoryFromScroll: string = '';

  selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.menuService.getProducts().subscribe({
      next: (data) => {
        this.groupProducts(data);
        if (this.categories.length > 0) {
          setTimeout(() => {
            this.activeCategoryFromScroll = this.categories[0];
            this.cdr.detectChanges();
          }, 0);
        }
      },
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  private initIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-120px 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeCategoryFromScroll = entry.target.id;
          this.cdr.detectChanges();
        }
      });
    }, options);

    this.sectionElements.changes.subscribe((sections: QueryList<ElementRef>) => {
      sections.forEach(section => observer.observe(section.nativeElement));
    });
  }

  private groupProducts(products: Product[]): void {
    this.categories = [...new Set(products.map(p => p.category))];
    this.categories.forEach(cat => {
      this.productsByCategory[cat] = products.filter(p => p.category === cat);
    });
  }

  // Métodos para el modal
  openModal(product: Product) {
    this.selectedProduct.set(product);
  }

  closeModal() {
    this.selectedProduct.set(null);
  }

  onAddToCart(event: { quantity: number, note: string }) {
    const product = this.selectedProduct();
    if (product) {
      this.cartService.addToCart(product, event.quantity, event.note);
      console.log(`Agregado: ${product.name}, Cantidad: ${event.quantity}, Nota: ${event.note}`);
    }
    this.closeModal();
  }
}