import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TransactionService } from '../shared/transaction.service';
import { Transaction, TransactionType } from '../shared/transaction.model';

const POLL_INTERVAL_MS = 15000;

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private destroyRef = inject(DestroyRef);

  transactions: Transaction[] = [];
  loading = true;
  error = '';
  filterType: 'all' | TransactionType = 'all';

  ngOnInit(): void {
    // Poll instead of a one-shot fetch so this list stays current if a
    // transaction is added from another tab/device without a manual reload.
    timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => this.transactionService.getTransactions()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
          this.error = '';
        },
        error: () => {
          this.error = 'Could not load transactions. Is the API running?';
          this.loading = false;
        },
      });
  }

  get filteredTransactions(): Transaction[] {
    if (this.filterType === 'all') {
      return this.transactions;
    }
    return this.transactions.filter((t) => t.type === this.filterType);
  }
}
