import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Product } from './product.model';
import { DiscountDialogComponent } from './../../dialogs/discount-dialog/discount-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = "http://localhost:3001/products";

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  private errorHandler(e: any): Observable<any> {
    this.showMessage('Ocorreu um erro ao realizar essa operação!', true);
    return EMPTY;
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    });
  }

  openDiscountDialog(): Observable<DiscountDialogComponent> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    return this.dialog.open(DiscountDialogComponent, dialogConfig).afterClosed();
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product)
      .pipe(map((object) => object), 
      catchError((error) => this.errorHandler(error))
    );
  }

  read(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl)
      .pipe(map((object) => object), 
      catchError((error) => this.errorHandler(error))
    );
  }

  readById(id: number): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Product>(url)
      .pipe(map((object) => object), 
      catchError((error) => this.errorHandler(error))
    );
  }

  update(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/${product.id}`;
    return this.http.put<Product>(url, product)
      .pipe(map((object) => object), 
      catchError((error) => this.errorHandler(error))
    );
  }

  delete(id: number): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Product>(url)
      .pipe(map((object) => object), 
      catchError((error) => this.errorHandler(error))
    );
  }

  validatePrice(price: number): number {
    return Math.round((Math.abs(price) + Number.EPSILON)*100)/100;
  }

  validateDiscount(discount: number): number {
    return Math.min(Math.round(Math.abs(discount)), 100);
  }

  calculatePriceWithDiscount(price: number, discount: number): number {
    return price != null && discount != null ? Math.round((price - price*discount/100 + Number.EPSILON)*100)/100 : null;
  }

}
