import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { UserControllerService } from '../../services/services';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateUserForm: FormGroup;
  userId!: number;
  user: any = {};
  loading = false;
  isMedecin = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserControllerService,
    private authService: AuthenticationService,
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
      specialite: [''],
      anneesExperience: ['', [Validators.min(0)]],
      currentPassword: [''],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { 
      validator: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    this.isMedecin = this.authService.getUserRoleFromToken() === 'MEDECIN';
    if (this.isMedecin) {
      this.updateUserForm.get('specialite')?.setValidators(Validators.required);
      this.updateUserForm.get('anneesExperience')?.setValidators([Validators.required, Validators.min(0)]);
      this.updateUserForm.updateValueAndValidity();
    }
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    this.userService.getUserById({ id: this.userId }).subscribe({
      next: (data) => {
        this.user = data;
        this.updateUserForm.patchValue({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : null,
          specialite: data.specialite,
          anneesExperience: data.anneesExperience
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load user data: ' + error.message, 'Error');
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
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const formData = this.updateUserForm.value;
    const updateData: any = {
      id: this.userId,
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : null
    };

    // Include MEDECIN-specific fields if applicable
    if (this.isMedecin) {
      updateData.specialite = formData.specialite;
      updateData.anneesExperience = formData.anneesExperience;
    }

    if (formData.password && formData.password.trim() !== '') {
      if (!formData.currentPassword) {
          this.notificationService.showError('Current password is required when changing password', 'Error');
          return;
      }
      updateData.currentPassword = formData.currentPassword;
      updateData.password = formData.password;
  }
  

    console.log('Sending update payload:', updateData);

    this.loading = true;
    this.userService.updateUser(updateData).subscribe({
      next: (updatedUser) => {
        this.notificationService.showSuccess('Profile updated successfully!', 'Success');
        
       if (formData.password) {
    localStorage.clear();
    this.notificationService.showInfo('Please login with your new password', 'Password Changed');
    setTimeout(() => {
        this.router.navigate(['/login'], {
            state: { email: this.user.email }
        });
    }, 2000);
        } else {
          setTimeout(() => this.router.navigate([`/user-profile/${this.userId}`]), 2000);
        }
      },
      error: (error) => {
        console.error('Update error:', error);
        let errorMsg = 'Update failed';
        if (error.status === 400) {
          errorMsg = error.error || 'Invalid data provided';
        } else if (error.status === 401) {
          errorMsg = 'Current password is incorrect';
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
      return { passwordMismatch: true };
    }
    return null;
  }
}