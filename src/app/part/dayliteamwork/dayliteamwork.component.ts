import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DayliteamworkservicesService } from '../../services/dayliteamworkservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dayliteamwork',
  imports: [FormsModule, CommonModule],
  templateUrl: './dayliteamwork.component.html',
  styleUrl: './dayliteamwork.component.css'
})
export class DayliteamworkComponent {

  constructor(private workService: DayliteamworkservicesService) { }

  worktype: string = '';
  ticketId: string = '';

  form = {
    schoolname: '',
    branchname: '',
    work: '',
    username: '',
    submittime: '',
    company: '',
    stutas: ''
  };

  ngOnInit(): void {

    const data = sessionStorage.getItem('userdata');
    if (data) {
      const userdata = JSON.parse(data);
      this.form.username = userdata.userId;
      this.form.submittime = new Date().toLocaleString();

    }
    this.fetchAllWorks();

  }


  onWorkTypeChange() {
    if (this.worktype === 'Self') {
      this.form.company = 'Self';
    } else if (this.worktype === 'ticket') {
      this.form.company = this.ticketId || '';
    }
  }

  updateCompanyFromTicket() {
    if (this.worktype === 'ticket') {
      this.form.company = this.ticketId;
    }
  }


  submitForm() {
    this.form.stutas = 'Pending';

    if (!this.form.company || this.form.company.trim() === '') {
      alert('Please enter Ticket Id');
      return;
    }

    const payload = {
      action: 'create',
      school_name: this.form.schoolname,
      branch_name: this.form.branchname,
      work_type: this.form.company,
      work_sent_by: '',
      sent_datetime: '',
      work_handled_by: this.form.username,
      handled_datetime: this.form.submittime,
      status: this.form.stutas,
      completed_datetime: '',
      work_description: this.form.work,
    };
    console.log(payload);
    this.workService.createWork(payload).subscribe(
      res => {
        alert('Work Submitted Successfully!');
        this.resetForm();
        this.ngOnInit();

      },
      err => {
        alert('Error submitting work');
        console.error(err);
      }
    );
  }
  resetForm() {

    this.form = {
      schoolname: '',
      branchname: '',
      work: '',
      username: '',
      submittime: '',
      company: '',
      stutas: ''
    };
    this.worktype = '';
    this.ticketId = '';
  }

  worksfach: any[] = [];
  fetchAllWorks() {
    const userid = this.form.username;
    this.workService.getAllWorks().subscribe(
      (data) => {
        // Filter: only pending status and assigned to current user
        this.worksfach = data.filter(work =>

          work.work_handled_by === userid &&
          work.status === 'Pending'
        );

      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  updateWork2(id: number): void {
    console.log("Update clicked for ID:", id);
    const updatedworkdata = this.worksfach.find(item => item.id === id);

    const handledDateFormatted = new Date(updatedworkdata.handled_datetime).toLocaleString();

    const payload = {
      action: 'update',
      id: updatedworkdata.id,
      school_name: updatedworkdata.school_name,
      branch_name: updatedworkdata.branch_name,
      work_type: updatedworkdata.work_type,
      work_sent_by: '',
      sent_datetime: '',
      work_handled_by: updatedworkdata.work_handled_by,
      handled_datetime: handledDateFormatted,
      status: 'Done',
      completed_datetime: new Date().toLocaleString(),
      work_description: updatedworkdata.work_description,
    };

    this.workService.updateWork(payload).subscribe(
      res => {
        alert('Work Submitted Successfully!');
        this.ngOnInit();
      },
      err => {
        alert('Error submitting work');
        console.error(err);
      }
    );
  }




}
