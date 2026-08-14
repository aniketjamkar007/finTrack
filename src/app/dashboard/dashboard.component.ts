import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TransactionService } from '../shared/transaction.service';
import { Summary, Transaction } from '../shared/transaction.model';

const POLL_INTERVAL_MS = 15000;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private destroyRef = inject(DestroyRef);

  summary: Summary = { income: 0, expense: 0, balance: 0 };
  recentTransactions: Transaction[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.pollSummary();
    this.pollRecentTransactions();
  }

  // Poll instead of a one-shot fetch so the dashboard stays fresh if a
  // transaction is added from another tab/device without a manual reload.
  private pollSummary(): void {
    timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => this.transactionService.getSummary()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (summary) => {
          this.summary = summary;
          this.error = '';
        },
        error: () => (this.error = 'Could not load summary. Is the API running?'),
      });
  }

  private pollRecentTransactions(): void {
    timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => this.transactionService.getTransactions()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (transactions) => {
          this.recentTransactions = transactions.slice(0, 5);
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load transactions. Is the API running?';
          this.loading = false;
        },
      });
  }
}
