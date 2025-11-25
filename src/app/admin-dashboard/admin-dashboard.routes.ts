import {Routes} from '@angular/router';
import {AdminLayout} from '@dashboard/layouts/admin-layout/admin-layout';
import {ProductAdminPage} from '@dashboard/pages/product-admin-page/product-admin-page';
import {ProductsAdminPage} from '@dashboard/pages/products-admin-page/products-admin-page';
import {isAdminGuard} from '@auth/guards/isAdmin.guard';

export const adminDashboardRoutes:Routes = [
  {
    path: '',
    component: AdminLayout,
    canMatch:[isAdminGuard],
    children:[
      {
        path: 'products',
        component: ProductsAdminPage
      },
      {
        path: 'products/:id',
        component: ProductAdminPage
      },
      {
        path: '**',
        redirectTo:'products'
      }
    ]
  }
];

export default adminDashboardRoutes;
