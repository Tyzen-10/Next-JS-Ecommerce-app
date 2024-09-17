import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/db/client'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import React from 'react'

async function getSalesData() {
  const data = await prisma.order.aggregate({_sum:{pricePaidInCents:true},
  _count:true})
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count 
  }

  //using aggregate function for sum and count.
}
async function getUsersData() {
  const [userCount, orderData] = await Promise.all([prisma.user.count(),prisma.order.aggregate({
    _sum: {pricePaidInCents: true},
  })])
//commenting this out becoz Promise.all is better than back to back awaits.
  /*
  const userCount = await prisma.user.count()
  const orderData = await prisma.order.aggregate({
    _sum: {pricePaidInCents: true},
  })*/
 return {
  userCount,
  'averageValuePerUser': userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100 ,
  //checks if userCount 0 then value is 0.
  //if not 0, then orderData.sum.pricePaidInCents whose fallback is again 0.
  //if pricePaidinCents value is there /userCount and then /100 to convert from pennies to dollars.
 }
}
async function getProductsData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({where: {isAvailableForPurchase: true}}),
    prisma.product.count({where: {isAvailableForPurchase: false}})
  ])
  return {
    activeCount,
    inactiveCount,
  }
}
//aysnc is usally not possible -> but becoz it's a server component -> so possible.
const AdminPage = async () => {
  const [salesData,usersData,productsData] = await Promise.all([getSalesData(),getUsersData(),getProductsData()])
  //commenting this out becoz using Promise.all instead of multiple awaits.
  // const {amount, numberOfSales} = await getSalesData();
  return (
    <div>Admin Dashboard Page
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* <DashboardCard title='Sales' subtitle='sample desc' body='some tetx'></DashboardCard> */}
        <DashboardCard title='Sales' subtitle={formatNumber(salesData.numberOfSales)} body={formatCurrency(salesData.amount)}></DashboardCard>
        <DashboardCard title='Customers' subtitle={formatCurrency(usersData.averageValuePerUser)} body={formatNumber(usersData.userCount)}></DashboardCard>
        <DashboardCard title='Products' subtitle={`Inactive users: ${formatNumber(productsData.inactiveCount)}`} body={formatCurrency(productsData.activeCount)}></DashboardCard>
      </div>
    </div>
  )
}

export default AdminPage

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

function DashboardCard({title, subtitle, body}: DashboardCardProps) {
  return (
    <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent><p>{body}</p></CardContent>
        </Card>
  )
}
