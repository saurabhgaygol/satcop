import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DayliteamworkservicesService {

  private scriptUrl = 'https://script.google.com/macros/s/AKfycbyUU3W5HaZ_KhsyQnh1zFzYHCUissI1XK7w1PKMR-G28wnVzJiEL3FjrcBWM3hRDitJEQ/exec'; // <-- Replace with your Apps Script URL

  constructor(private http: HttpClient) { }

  // 🔸 CREATE (Submit new work)
  createWork(payload: any): Observable<any> {


    const from = new FormData();

    from.append("action", "create");
    from.append("school_name", payload.school_name);
    from.append("branch_name", payload.branch_name);
    from.append("work_type", payload.work_type);
    from.append("work_sent_by", payload.work_sent_by || "");
    from.append("sent_datetime", payload.sent_datetime || "");
    from.append("work_handled_by", payload.work_handled_by);
    from.append("handled_datetime", payload.handled_datetime);
    from.append("status", payload.status);
    from.append("completed_datetime", payload.completed_datetime || "");
    from.append("work_description", payload.work_description);

    // 🔍 Debug FormData values
    for (const pair of from.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return this.http.post(this.scriptUrl, from, { responseType: 'text' });
  }
  // 🔸 (Optional) GET all works
  getAllWorks() {
    const from = new FormData();
    from.append("action", "read");
    return this.http.post<any[]>(this.scriptUrl, from);

  }

  // 🔸 (Optional) UPDATE
  updateWork(payload: any): Observable<any> {
    const from = new FormData();

    from.append("action", "update");
    from.append("id", payload.id)
    from.append("school_name", payload.school_name);
    from.append("branch_name", payload.branch_name);
    from.append("work_type", payload.work_type);
    from.append("work_sent_by", payload.work_sent_by || "");
    from.append("sent_datetime", payload.sent_datetime || "");
    from.append("work_handled_by", payload.work_handled_by);
    from.append("handled_datetime", payload.handled_datetime);
    from.append("status", payload.status);
    from.append("completed_datetime", payload.completed_datetime || "");
    from.append("work_description", payload.work_description);

    return this.http.post(this.scriptUrl, from, { responseType: 'text' });
  }

  // 🔸 (Optional) DELETE
  deleteWork(id: number) {
    const payload = {
      action: 'delete',
      id: id
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.scriptUrl, payload, { headers });
  }
}
