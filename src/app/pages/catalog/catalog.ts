import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ProductCard } from '../../components/product-card/product-card';
import { Cart } from '../../components/cart/cart';
import { MenuContainer } from '../../components/menu-container/menu-container';

@Component({
  selector: 'app-catalog',
  imports: [Navbar, Footer, ProductCard, Cart, MenuContainer],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

}
