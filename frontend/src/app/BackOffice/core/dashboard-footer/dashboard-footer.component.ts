import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-footer',
  templateUrl: './dashboard-footer.component.html',
  styleUrls: ['./dashboard-footer.component.css']
})
export class DashboardFooterComponent implements OnInit {
  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
