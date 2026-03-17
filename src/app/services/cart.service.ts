import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  public items = computed(() => this.cartItems());
  
  public totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  public totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  addToCart(product: Product, quantity: number, note: string): void {
    this.cartItems.update(currentItems => {
      const index = currentItems.findIndex(item => 
        item.id === product.id && item.note === note
      );

      if (index !== -1) {
        const updatedItems = [...currentItems];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity + quantity
        };
        return updatedItems;
      }

      return [...currentItems, { ...product, quantity, note }];
    });
  }

  removeItem(productId: number, note?: string): void {
    this.cartItems.update(items => 
      items.filter(item => !(item.id === productId && item.note === note))
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}