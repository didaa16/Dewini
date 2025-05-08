import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminControllerService } from 'src/app/FrontOffice/features/User/services/services';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-updateback',
  templateUrl: './updateback.component.html',
  styleUrls: ['./updateback.component.css']
})
export class UpdatebackComponent {
  updateUserForm: FormGroup;
  userId!: number;
  user: any = {};
  loading = false;
  showBanSection = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public adminService: AdminControllerService,
    private notificationService: NotificationService
  ) {
    this.updateUserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { 
      validator: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.loadUserData();
    });
  }

  loadUserData(): void {
    this.loading = true;
    this.adminService.getUserById({ id: this.userId }).subscribe({
      next: (data) => {
        this.user = data;
        this.updateUserForm.patchValue({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : null
        });
        this.showBanSection = true; // Afficher la section ban après chargement
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load user data', 'Error');
        this.router.navigate(['/dashboard/admin/users']);
        this.loading = false;
      }
    });
  }

  isPasswordChanged(): boolean {
    return !!this.updateUserForm.get('password')?.value;
  }

  updateUser(): void {
    if (this.updateUserForm.invalid) {
      this.notificationService.showError('Please fill all required fields correctly', 'Error');
      return;
    }
  
    const formData = this.updateUserForm.value;
    const updateData: any = {
      ...formData,
      id: this.userId
    };
  
    // Format date
    if (formData.dateOfBirth) {
      updateData.dateOfBirth = new Date(formData.dateOfBirth).toISOString().split('T')[0];
    }
  
    // Handle password change (no current password required for admin)
    if (!formData.password || formData.password.trim() === '') {
      delete updateData.password;
      delete updateData.confirmPassword;
    } else {
      updateData.password = formData.password; // Will be encoded in backend
    }
  
    this.loading = true;
    this.adminService.updateUser(updateData).subscribe({
      next: (updatedUser) => {
        this.notificationService.showSuccess('Profile updated successfully!', 'Success');
        setTimeout(() => {
          this.router.navigate(['/dashboard/admin/users']);
        }, 2000);
      },
      error: (error) => {
        console.error('Update error:', error);
        let errorMsg = 'Update failed';
        if (error.status === 400) {
          errorMsg = error.error?.message || 'Invalid data';
        } else if (error.status === 403) {
          errorMsg = 'Unauthorized to update this profile';
        } else if (error.status === 500) {
          errorMsg = 'Server error - please try again later';
        }
        this.notificationService.showError(errorMsg, 'Error');
        this.loading = false;
      }
    });
  }


  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    if (password && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
}