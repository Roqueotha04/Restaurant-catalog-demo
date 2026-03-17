import { Component, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private cartService = inject(CartService);

  @Output() close = new EventEmitter<void>();

  items = this.cartService.items;
  
  totalPrice = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  closeCart() {
    this.close.emit();
  }

  removeItem(productId: number, note?: string) {
    this.cartService.removeItem(productId, note);
  }

  sendToWhatsApp() {
    const phoneNumber = '5492236680996'; 
    
    let message = `*NUEVO PEDIDO*\n`;
    message += `==========================\n\n`;

    this.items().forEach(item => {
      message += `✅ *${item.name}*\n`;
      message += `   Unidades: ${item.quantity}\n`;
      if (item.note) {
        message += `   _Nota: ${item.note}_\n`;
      }
      message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `==========================\n`;
    message += `*TOTAL A PAGAR: $${this.totalPrice().toFixed(2)}*\n\n`;
    message += `_Pedido enviado desde el catálogo web._`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  }
}