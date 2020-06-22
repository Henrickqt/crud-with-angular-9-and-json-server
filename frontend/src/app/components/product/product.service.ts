import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = "http://localhost:3001/products";

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
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

}
