import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Enum to define user roles for better type safety.
 */
type UserRole = 'investor' | 'businessOwner' | 'admin';

/**
 * Service to handle navigation based on user roles.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  /**
   * Defines role-based routes for navigation.
   */
  private readonly roleRoutes: Record<UserRole, string> = {
    investor: '/InvestorDashboard',
    businessOwner: '/BusinessDashboard',
    admin: '/AdminDashboard',
  };

  /**
   * Default route if role is not recognized.
   */
  private readonly defaultRoute = '/';

  constructor(private router: Router) {}

  /**
   * Navigates the user to the appropriate route based on their role.
   * @param {string} role - The user's role.
   */
  navigateByRole(role: string): void {
    const route = this.roleRoutes[role as UserRole] ?? this.defaultRoute;
    this.router.navigate([route]);
  }
}
