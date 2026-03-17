import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css'
})
export class ProductModalComponent {
  @Input({ required: true }) product!: Product;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ quantity: number, note: string }>();

  quantity = signal(1);
  note: string = '';

  increment() {
    this.quantity.update(v => v + 1);
  }

  decrement() {
    if (this.quantity() > 1) {
      this.quantity.update(v => v - 1);
    }
  }

  closeModal() {
    this.close.emit();
  }

  handleConfirm() {
    this.confirm.emit({
      quantity: this.quantity(),
      note: this.note
    });
    this.closeModal();
  }
}