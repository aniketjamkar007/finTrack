import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../shared/transaction.service';

@Component({
  selector: 'app-transaction-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-entry.component.html',
  styleUrl: './transaction-entry.component.css',
})
export class TransactionEntryComponent {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private router = inject(Router);

  submitting = false;
  errorMessage = '';
  successMessage = '';

  readonly categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    expense: ['Food', 'Rent', 'Utilities', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Other'],
  };

  form = this.fb.group({
    type: this.fb.control<'income' | 'expense'>('expense', { nonNullable: true, validators: Validators.required }),
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    category: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    description: this.fb.control(''),
    date: this.fb.control(this.today(), { nonNullable: true, validators: Validators.required }),
  });

  get currentCategories(): string[] {
    return this.categories[this.form.controls.type.value];
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  onTypeChange(): void {
    this.form.controls.category.setValue('');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitting = true;

    this.transactionService
      .addTransaction({
        type: value.type,
        amount: Number(value.amount),
        category: value.category,
        description: value.description ?? '',
        date: value.date,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Transaction added.';
          this.form.reset({ type: value.type, amount: null, category: '', description: '', date: this.today() });
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err?.error?.error || 'Failed to add transaction. Is the API running?';
        },
      });
  }

  goToList(): void {
    this.router.navigate(['/transactions']);
  }
}
