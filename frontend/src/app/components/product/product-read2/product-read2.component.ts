import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { ProductRead2DataSource } from './product-read2-datasource';
import { HeaderService } from './../../template/header/header.service';
import { ProductService } from './../product.service';
import { Product } from './../product.model';

@Component({
  selector: 'app-product-read2',
  templateUrl: './product-read2.component.html',
  styleUrls: ['./product-read2.component.css']
})
export class ProductRead2Component implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Product>;

  dataSource: ProductRead2DataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'price', 'action'];

  constructor(
    private productService: ProductService,
    private headerService: HeaderService) {
    headerService.headerData = {
      title: 'Desafio',
      icon: 'check_circle',
      routeUrl: '/desafio'
    };
  }
  
  ngOnInit() {
    this.dataSource = new ProductRead2DataSource();
    this.productService.read().subscribe(products => {
      this.dataSource.data = products;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
