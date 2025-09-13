import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';



@Injectable({
  providedIn: 'root'
})
export class CollectionsheetService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbxMZpCDtx3Z9PJ4hO7JoCrDU2fCjcj36Cyk1USwi0bucHXq8TFq_EYTOREQ7eh0M-6PcQ/exec';





  // Helper function to append all fields
  private appendFormData1(formData: FormData, data: any) {
    console.log("fromdata", formData);
    console.log("my data", data);
    formData.append('uniqId', data.Uniq_Id || '');
    formData.append('salesManager', data.Sales_Manager || '');
    formData.append('salesperson', data.Salesperson || '');
    formData.append('invoiceId', data.Invoice_Id || '');
    formData.append('subId', data.Sub_Id || '');
    formData.append('companyName', data.Company_name || '');
    formData.append('totalAmount', data.Total_Amount || '');
    formData.append('amountReceived', data.Amount_Received || '');
    formData.append('transactionDetails', data.Discription || '');
    formData.append('productCategory', data.Product_Category || '');
    formData.append('expectedPaymentDate', data.Expected_Date_of_payment || '');
    formData.append('pendingAmount', data.Pending_Amount || "");
    formData.append('paymentStatus', data.Payment_Status || '');
    formData.append('lastUpdatedUserId', data.Last_Updaed_Userid || '');
    formData.append('dataUploadedDate', data.Data_Uploaded_Date || '');


    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  }











  constructor(private http: HttpClient) { }

  // CREATE
  createData(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'create');
    this.appendFormData(formData, data);
    return this.http.post(this.apiUrl, formData);
  }

  // READ
  readData(): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'read');
    return this.http.post(this.apiUrl, formData);
  }

  // UPDATE
  updateData(data: any): Observable<any> {
    console.log("ok data revi", data);
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('uniqId', data.Uniq_Id || '');
    formData.append('salesManager', data.Sales_Manager || '');
    formData.append('salesperson', data.Salesperson || '');
    formData.append('invoiceId', data.Invoice_Id || '');
    formData.append('subId', data.Sub_Id || '');
    formData.append('companyName', data.Company_name || '');
    formData.append('totalAmount', data.Total_Amount || '');
    formData.append('amountReceived', data.Amount_Received || '');
    formData.append('discription', data.Discription || '');
    formData.append('productCategory', data.Product_Category || '');
    formData.append('expectedPaymentDate', data.Expected_Date_of_payment || '');
    formData.append('pendingAmount', data.Pending_Amount !== undefined && data.Pending_Amount !== null ? String(data.Pending_Amount) : '');
    formData.append('paymentStatus', data.Payment_Status || '');
    formData.append('dataUploadedDate', data.Data_Uploaded_Date || '');
    formData.append('paymentProbability', data.Payment_Probability || '');

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    return this.http.post(this.apiUrl, formData);
  }

  // DELETE
  deleteData(uniqId: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('uniqId', uniqId);
    return this.http.post(this.apiUrl, formData);
  }



  //coment sheet data start

  private apiurl2 = 'https://script.google.com/macros/s/AKfycbzWp60klCZYj3MEnKUu6oUibiZ9wkHsLs-B1G6hprVVM1-HEbX9Mn_COSeBX5fLLQ/exec';

  private appendFormData(formData: FormData, data: any) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
  }

  // CREATE
  createData1(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'create');
    this.appendFormData(formData, data);
    return this.http.post(this.apiurl2, formData);
  }

  // READ (JSON में data मिलेगा)
  getData1(): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'read');
    return this.http.post<any>(this.apiurl2, formData);
  }

  // UPDATE
  updateData1(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'update');
    this.appendFormData(formData, data);
    return this.http.post(this.apiurl2, formData);
  }

  // DELETE
  deleteData1(uniqId: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('Uniq_Id', uniqId);
    return this.http.post(this.apiurl2, formData);
  }
























































}