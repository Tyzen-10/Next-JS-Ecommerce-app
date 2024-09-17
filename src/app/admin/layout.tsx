import { Nav, NavLink } from '@/components/Nav'
import React, { ReactNode } from 'react'

export const dynamic = "force-dynamic" //stops nextjs from Caching.

const AdminLayout = ({children}: {children: ReactNode}) => {
  return (
    <div>AdminLayout
        <Nav>
            <NavLink href={`/admin`}>Dashboard</NavLink>
            <NavLink href={`/admin/products`}>Products</NavLink>
            <NavLink href={`/admin/users`}>Customers</NavLink>
            <NavLink href={`/admin/orders`}>Sales</NavLink>
        </Nav>
        {children}
    </div>
  )
}

export default AdminLayout