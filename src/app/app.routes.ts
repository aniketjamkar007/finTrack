import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionEntryComponent } from './transaction-entry/transaction-entry.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'finTrack | Dashboard' },
  { path: 'transaction', component: TransactionEntryComponent, title: 'finTrack | Add Transaction' },
  { path: 'transactions', component: TransactionListComponent, title: 'finTrack | Transactions' },
  { path: '**', redirectTo: '' },
];
