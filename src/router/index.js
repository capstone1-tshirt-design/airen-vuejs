import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/middleware/auth'
import guest from '@/middleware/guest'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/admin',
      redirect: {
        name: 'Dashboard'
      },
      component: () => import('@/components/layouts/admin/Layout'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/components/admin/Dashboard'),
          meta: {
            breadcrumb: 'Dashboard',
            middleware: [auth]
          }
        },
        {
          path: 'products',
          redirect: {
            name: 'ProductList'
          },
          component: () => import('@/components/admin/Content'),
          name: 'Products',
          meta: {
            breadcrumb: 'Products'
          },
          children: [
            {
              path: '',
              name: 'ProductList',
              component: () => import('@/components/admin/product/Index'),
              meta: {
                breadcrumb: 'Product List',
                middleware: [auth]
              }
            },
            {
              path: 'add',
              name: 'AddProduct',
              component: () => import('@/components/admin/product/Form'),
              meta: {
                breadcrumb: 'Add Product',
                middleware: [auth]
              }
            },
            {
              path: ':id(\\d+)',
              name: 'EditProduct',
              component: () => import('@/components/admin/product/Form'),
              meta: {
                breadcrumb: 'Edit Product',
                middleware: [auth]
              }
            }
          ]
        },
        {
          path: 'designer',
          name: 'Designer',
          component: () => import('@/components/admin/Designer'),
          meta: {
            breadcrumb: 'Designer',
            middleware: [auth]
          }
        },
        {
          path: 'users',
          redirect: {
            name: 'UserList'
          },
          component: () => import('@/components/admin/Content'),
          name: 'Users',
          meta: {
            breadcrumb: 'Users'
          },
          children: [
            {
              path: ':role(customer|administrator)',
              name: 'UserList',
              component: () => import('@/components/admin/user/Index'),
              meta: {
                breadcrumb: 'User List',
                middleware: [auth]
              }
            },
            {
              path: ':role(customer|administrator)/add',
              name: 'AddUser',
              component: () => import('@/components/admin/user/Form'),
              meta: {
                breadcrumb: 'Add User',
                middleware: [auth]
              }
            }
          ]
        },
        {
          path: 'categories',
          redirect: {
            name: 'CategoryList'
          },
          component: () => import('@/components/admin/Content'),
          name: 'Categories',
          meta: {
            breadcrumb: 'Categories'
          },
          children: [
            {
              path: '',
              name: 'CategoryList',
              component: () => import('@/components/admin/category/Index'),
              meta: {
                breadcrumb: 'Category List',
                middleware: [auth]
              }
            },
            {
              path: 'add',
              name: 'AddCategory',
              component: () => import('@/components/admin/category/Form'),
              meta: {
                breadcrumb: 'Add Category',
                middleware: [auth]
              }
            },
            {
              path: ':id(\\d+)',
              name: 'EditCategory',
              component: () => import('@/components/admin/category/Form'),
              meta: {
                breadcrumb: 'Edit Category',
                middleware: [auth]
              }
            }
          ]
        },
        {
          path: 'orders',
          redirect: {
            name: 'OrderList'
          },
          component: () => import('@/components/admin/Content'),
          name: 'Orders',
          meta: {
            breadcrumb: 'Orders'
          },
          children: [
            {
              path: '',
              name: 'OrderList',
              component: () => import('@/components/admin/order/Index'),
              meta: {
                breadcrumb: 'Order List',
                middleware: [auth]
              }
            }
          ]
        },
        {
          path: 'profile',
          name: 'AdminProfile',
          component: () => import('@/components/admin/ProfileDetails'),
          meta: {
            breadcrumb: 'Profile',
            middleware: [auth]
          }
        },
        {
          path: 'profile/edit',
          name: 'AdminEditProfile',
          component: () => import('@/components/admin/Profile'),
          meta: {
            breadcrumb: 'Edit Profile',
            middleware: [auth]
          }
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/components/layouts/customer/Layout'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/components/customer/Home'),
          meta: {
            breadcrumb: 'Home',
            middleware: [guest]
          }
        },
        {
          path: 'shop',
          name: 'Shop',
          component: () => import('@/components/customer/Shop'),
          meta: {
            breadcrumb: 'Shop',
            middleware: [guest]
          }
        },
        {
          path: 'product/:id(\\d+)',
          name: 'SingleProduct',
          component: () => import('@/components/customer/SingleProduct'),
          meta: {
            breadcrumb: 'Product Detail',
            middleware: [guest]
          }
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('@/components/customer/Cart'),
          meta: {
            breadcrumb: 'Cart',
            middleware: [auth]
          }
        },
        {
          path: 'checkout',
          name: 'Checkout',
          component: () => import('@/components/customer/Checkout'),
          meta: {
            breadcrumb: 'Checkout',
            middleware: [auth]
          }
        },
        {
          path: 'purchase-confirmation',
          name: 'PurchaseConfirmation',
          component: () => import('@/components/customer/PurchaseConfirmation'),
          meta: {
            middleware: [auth]
          }
        },
        {
          path: 'faq',
          name: 'FAQ',
          component: () => import('@/components/customer/FAQ'),
          meta: {
            breadcrumb: 'FAQ',
            middleware: [guest]
          }
        },
        {
          path: 'contact-us',
          name: 'ContactUs',
          component: () => import('@/components/customer/ContactUs'),
          meta: {
            breadcrumb: 'Contact Us',
            middleware: [guest]
          }
        },
        {
          path: 'about-us',
          name: 'AboutUs',
          component: () => import('@/components/customer/AboutUs'),
          meta: {
            breadcrumb: 'About Us',
            middleware: [guest]
          }
        },
        {
          path: 'dashboard',
          name: 'CustomerDashboard',
          component: () => import('@/components/customer/Dashboard'),
          meta: {
            breadcrumb: 'Dashboard',
            middleware: [auth]
          }
        },
        {
          path: 'orders',
          name: 'MyOrders',
          component: () => import('@/components/customer/MyOrders'),
          meta: {
            breadcrumb: 'My Orders',
            middleware: [auth]
          }
        },
        {
          path: 'address',
          name: 'Address',
          component: () => import('@/components/customer/Address'),
          meta: {
            middleware: [auth]
          }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/components/customer/ProfileDetails'),
          meta: {
            breadcrumb: 'Profile',
            middleware: [auth]
          }
        },
        {
          path: 'profile/edit',
          name: 'EditProfile',
          component: () => import('@/components/customer/Profile'),
          meta: {
            breadcrumb: 'Edit Profile',
            middleware: [auth]
          }
        },
        {
          path: 'measurements',
          name: 'Measurements',
          component: () => import('@/components/customer/Measurements'),
          meta: {
            middleware: [auth]
          }
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/components/layouts/guest/Layout'),
      children: [
        {
          path: 'admin/login',
          name: 'AdminLogin',
          component: () => import('@/components/guest/Login'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/components/guest/Login'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/components/guest/Register'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'verify-email',
          name: 'VerifyEmail',
          component: () => import('@/components/guest//VerifyEmail'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/components/guest/ForgotPassword'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'admin/forgot-password',
          name: 'AdminForgotPassword',
          component: () => import('@/components/guest/ForgotPassword'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('@/components/guest/ResetPassword'),
          meta: {
            middleware: [guest]
          }
        },
        {
          path: 'admin/reset-password',
          name: 'AdminResetPassword',
          component: () => import('@/components/guest/ResetPassword'),
          meta: {
            middleware: [guest]
          }
        }
      ]
    },
    {
      path: '*',
      name: 'Page404',
      component: () => import('@/components/error/Page404')
    }
  ]
})

export default router
